<?php
/**
 * @file
 *Site configuration object for the Lti plugin
 */

namespace CL\Lti;

use CL\Site\Components\InstalledConfig;
use CL\Site\System\Server;


/**
 * Site configuration object for the Lti plugin
 */
class LtiConfig extends InstalledConfig {
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

//	public function initializeSession(Server $server) {
//		// See if there is an active session already
//		if(isset($server->session[self::SESSION_ID])) {
//			$this->session = $server->session[self::SESSION_ID];
//		} else {
//			// Create the session object and put it into the session
//			$this->session = new LtiSession();
//			$server->setSession(self::SESSION_ID, $this->session);
//		}
//	}

	private $keys = [];
}