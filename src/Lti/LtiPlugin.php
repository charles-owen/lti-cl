<?php
/**
 * @file
 * Plugin class for the LTI subsystem
 */

namespace CL\Lti;

use CL\Site\Site;
use CL\Site\System\Server;
use CL\Lti\Views\ErrorView;
use CL\Lti\Api\ApiLti;
use CL\Users\User;
use CL\Lti\LtiOutcomes;

/**
 * Plugin class for the LTI subsystem
 */
class LtiPlugin extends \CL\Site\Components\Plugin {
	const JWT_LTI_GROUP = 'lti_group'; ///< Field to use in JWT for LTI group


	/**
	 * Install the plugin
	 * @param Site $site The Site configuration object
	 */
	public function install(Site $site) {
		$site->install("lti", new LtiConfig());

		$site->addRoute(['lti', 'error', ':id'], function(Site $site, Server $server, array $params, array $properties, $time) {
			$view = new ErrorView($site, $properties);
			return $view->whole();
		});

		$site->addPreStartup(function(Site $site, Server $server, $time) {
			return $this->preStartup($site, $server, $time);
		});

		$site->addStartup(function(Site $site, Server $server, $time) {
			return $this->startup($site, $server, $time);
		}, 50); // Must be less than the value for Users

		$site->addPostStartup(function(Site $site, Server $server, $time) {
			return $this->postStartup($site, $server, $time);
		});

		$site->addRoute(['lti', 'download', ':id', ':assign', ':grade'], function(Site $site, Server $server, array $params, array $properties, $time) {
			$view = new FileDownload($site, $server, $properties);
			return $view->whole();
		});

		$site->addRoute(['lti', 'view', ':id', ':assign', ':grade'], function(Site $site, Server $server, array $params, array $properties, $time) {
			$view = new FileView($site, $properties);
			return $view->whole();
		});

		$site->addRoute(['api', 'lti', '*'], function(Site $site, Server $server, array $params, array $properties, $time) {
			$resource = new ApiLti();
			return $resource->apiDispatch($site, $server, $params, $properties, $time);
		});
	}

	/**
	 * Handle activities prior to startup of the user system
	 *
	 * Ensure the tables exist
	 *
	 * @param Site $config
	 * @param Server $server
	 * @param int $time Current time
	 * @return null|string redirect page.
	 */
	private function preStartup(Site $site, Server $server, $time) {
		// Ensure the tables exist
		$ltiUsers = new LtiUsers($site->db);
		if(!$ltiUsers->exists()) {
			$maker = new LtiTableMaker($site->db);
			$maker->create(false);
		}
		return null;
	}

	/**
	 * Handle startup of the LTI system
	 * @param Site $site
	 * @param Server $server
	 * @param int $time Current time
	 * @return null|string redirect page.
	 */
	private function startup(Site $site, Server $server, $time) {

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
}