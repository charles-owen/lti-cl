<?php
/**
 * @file
 *Site configuration object for the Lti plugin
 */

namespace CL\Lti;

use CL\Site\System\Server;
use CL\Site\Router;
use CL\Site\Site;
use CL\Lti\Views\ErrorView;
use CL\Lti\Api\ApiLti;
use CL\Users\User;

/**
 * Site configuration object for the Lti plugin
 */
class LtiPlugin extends \CL\Site\Plugin {
	const JWT_LTI_GROUP = 'lti_group'; ///< Field to use in JWT for LTI group

	/**
	 * A tag that represents this plugin
	 * @return string A tag like 'course', 'users', etc.
	 */
	public function tag() {return 'lti';}

	/**
	 * Return an array of tags indicating what plugins this one is dependent on.
	 * @return array of tags this plugin is dependent on
	 */
	public function depends() {return ['course'];}

	/**
	 * Amend existing object
	 * The Router is amended with routes for the login page
	 * and for the user API.
	 * @param $object Object to amend.
	 */
	public function amend($object) {
		if($object instanceof Router) {
			$router = $object;
			$router->addRoute(['lti', 'error', ':id'], function(Site $site, Server $server, array $params, array $properties, $time) {
				$view = new ErrorView($site, $properties);
				return $view->whole();
			});

			$router->addRoute(['lti', 'download', ':id', ':assign', ':grade'], function(Site $site, Server $server, array $params, array $properties, $time) {
				$view = new FileDownload($site, $server, $properties);
				return $view->whole();
			});

			$router->addRoute(['lti', 'view', ':id', ':assign', ':grade'], function(Site $site, Server $server, array $params, array $properties, $time) {
				$view = new FileView($site, $properties);
				return $view->whole();
			});

			$router->addRoute(['api', 'lti', '*'], function(Site $site, Server $server, array $params, array $properties, $time) {
				$resource = new ApiLti();
				return $resource->apiDispatch($site, $server, $params, $properties, $time);
			});
		}
	}

	/**
	 * Install the plugin
	 * @param Site $site The Site configuration object
	 */
	public function install(Site $site) {
		$this->site = $site;
		$site->install("lti", $this);

		$site->addPreStartup(function(Site $site, Server $server, $time) {
			return $this->preStartup($site, $server, $time);
		});

		$site->addPostStartup(function(Site $site, Server $server, $time) {
			return $this->postStartup($site, $server, $time);
		});


	}

	/**
	 * Handle activities prior to startup of the user system
	 *
	 * Ensure the tables exist, then we test for any LTI Launch Request.
	 *
	 * Any LTI Launch request must occur before the normal system startup
	 * of users and members.
	 *
	 * @param Site $config
	 * @param Server $server
	 * @param int $time Current time
	 * @return null|string redirect page.
	 */
	private function preStartup(Site $site, Server $server, $time) {
		// Potential LTI Launch
		if($server->server['REQUEST_METHOD'] === 'POST' && isset($server->post['lti_message_type'])) {
			$launchRequest = new LaunchRequest();
			$ret = $launchRequest->attempt($site, $server, $time);
			if(!$ret) {
				return $site->root . '/cl/lti/error/validate';
			}

			$key = $launchRequest->key;
			$keyValues = $launchRequest->keyValues;
			$consumer = $launchRequest->consumer;
			$semester = $keyValues['semester'];
			$section = $keyValues['section'];

			$userMaker = new LtiUserMaker($site, $server, $time);
			$user = $userMaker->findOrMake($consumer,  $semester, $section);
			if($user === null) {
				return $site->root . '/cl/lti/error.php';
			}

			//
			// Get any indicated group
			//
			// When we connect to a page that has an LTI group
			// set in the start command, the group is set in the
			// Json web token (JWT). Then, any other pages that have an indicated
			// group can only be accessed if the group is the same.
			//
			// The allows an authenticated user to browse to pages
			// available to them, but not to browse to another problem.
			//
			$group = !empty($site->options['lti']) ? $site->options['lti'] : null;

			// Set it in the system and JWT
			if($group !== null) {
				$user->setJWT(self::JWT_LTI_GROUP, $group);
			} else {
				$user->unsetJWT(self::JWT_LTI_GROUP);
			}

			//
			// Get any outcomes support
			//
			$post = $server->post;
			if(!empty($site->options['assignment']) &&
				!empty($post['lis_result_sourcedid']) &&
				!empty($post['lis_outcome_service_url'])) {
				$ltiGrades = new LtiOutcomes($site->db);

				$assignTag = trim(strip_tags($site->options['assign-tag']));
				$gradeTag = !empty($site->options['grade-tag']) ? trim(strip_tags($site->options['grade-tag'])) : null;
				$sourcedId = trim(strip_tags($post['lis_result_sourcedid']));
				$url = trim(strip_tags($post['lis_outcome_service_url']));
				$gradeToken = !empty($site->options['grade-token']) ?
					trim(strip_tags($site->options['grade-token'])) : null;

				$ret = $ltiGrades->getOrMake($user, $key, $assignTag, $gradeTag, $gradeToken, $sourcedId, $url, $time);
			}

			//
			// A new JWT cookie is created
			//
			$jwt = $user->createJWT($site, $time);
			$cookiename = $site->cookiePrefix . User::COOKIENAME;
			$server->setcookie($cookiename, $jwt, 0, "/");

			// All set, so we redirect back to this page
			return $server->server['REQUEST_URI'];
		}


		return null;
	}


	/**
	 * Handle activities after startup of the user system
	 *
	 * Test for an LTI group violation.
	 *
	 * @param Site $config
	 * @param Server $server
	 * @param int $time Current time
	 * @return null|string redirect page.
	 */
	private function postStartup(Site $site, Server $server, $time) {

		$site->console->addPlugin('lticonsole', ['courseconsole']);

		//
		// Test for a group violation.
		//
		$requestedGroup = !empty($site->options['lti']) ? $site->options['lti'] : null;
		$user = $site->users->user;
		if($user !== null) {
			// We have a valid user
			$dataJWT = $user->dataJWT;
			if(isset($dataJWT[self::JWT_LTI_GROUP])) {
				$activeGroup = $dataJWT[self::JWT_LTI_GROUP];

				// If there is an active group and the page requested group is not it,
				// we don't allow access!
				if($requestedGroup !== null && $requestedGroup !== $activeGroup) {
					return $site->root . '/cl/lti/error/available';
				}
			} else {
				// If the page has a requested group and we don't have an active
				// group, we don't allow access.
				if($requestedGroup !== null) {
					return $site->root . '/cl/lti/error/available';
				}
			}
		}

		return null;
	}

	/**
	 * Ensure tables exist for a given subsystem.
	 * @param Site $site The site configuration component
	 */
	public function ensureTables(Site $site) {
		$maker = new LtiTableMaker($site->db);
		$maker->create(false);
	}


	/**
	 * Property get magic method
	 * @param string $key Property name
	 *
	 *
	 * @return null|string
	 */
	public function __get($key) {
		switch($key) {


			default:
				return parent::__get($key);
		}
	}

	/**
	 * Property set magic method
	 * @param $key Property name
	 * @param $value Value to set
	 */
	public function __set($key, $value) {
		parent::__set($key, $value);
	}


	public function start(\CL\Site\Server $server = null) {
		if($server === null) {
			// This will start the session
			$server = new \CL\Site\Server();
		}

		$redirect = parent::start($server);
		if($redirect !== null) {
			return $redirect;
		}

		if($server->server['REQUEST_METHOD'] === 'POST' &&
			!empty($server->post['lti_message_type']) && $server->post['lti_message_type'] === 'basic-lti-launch-request') {
			$lr = new LaunchRequest($this);
			$redirect = $lr->attempt($server);
			if($redirect !== null) {
				return $redirect;
			}
		}

		return null;
	}

	/**
	 * Add a key for the LTI service
	 * @param string $key Key to use
	 * @param string $secret Secret value
	 * @param string $semester Semester code, as in FS18
	 * @param string $section Section code, like 001
	 */
	public function addKey($key, $secret, $semester, $section) {
		$this->keys[$key] = ['secret'=>$secret, 'semester'=>$semester, 'section'=>$section];
	}

	public function getKey($key) {
		if(isset($this->keys[$key])) {
			return $this->keys[$key];
		}

		return null;
	}

	private $site = null;
	private $keys = [];
}