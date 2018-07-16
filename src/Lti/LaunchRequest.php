<?php
/**
 * @file
 * Handle POST method that might be a launch request.
 */

namespace CL\Lti;

/**
 * Handle POST method that might be a launch request.
 */
class LaunchRequest {

	/**
	 * Get standard properties for a course.
	 *
	 * @param $key
	 * @return Course|mixed|null|string Property value
	 */
	public function __get($key)
	{
		switch ($key) {
			case 'key':
				return $this->key;

			case 'keyValues':
				return $this->keyValues;

			case 'consumer':
				return $this->consumer;

			default:
				$trace = debug_backtrace();
				trigger_error(
					'Undefined property ' . $key .
					' in ' . $trace[0]['file'] .
					' on line ' . $trace[0]['line'],
					E_USER_NOTICE);
				return null;
		}
	}

	/**
	 * Attempt an LTI launch
	 * @param \CL\Site\Site $config
	 * @param \CL\Site\System\Server $server
	 * @param null $time
	 * @return true if successful, false if not
	 */
	public function attempt(\CL\Site\Site $config, \CL\Site\System\Server $server, $time=null) {
		if($time === null) {
			$time = time();
		}

		$this->config = $config;
		$this->time = $time;

		$post = $server->post;

		// Standard checks
		$musts = ['lti_message_type', 'lti_version', 'oauth_consumer_key', 'resource_link_id'];
		foreach($musts as $must) {
			if(empty($post[$must])) {
				return false;
			}
		}

		if( $server->server['REQUEST_METHOD'] !== 'POST' ||
			$server->post['lti_message_type'] !== 'basic-lti-launch-request' ||
			($server->post['lti_version'] !== 'LTI-1p0' && $server->post['lti_version'] !== 'LTI-2p0')) {
			return false;
		}

		$key = strip_tags($server->post['oauth_consumer_key']);
		$this->key = $key;
		$keyValues = $this->config->lti->getKey($key);
		if($keyValues === null) {
			// Not a valid key
			return false;
		}

		$this->keyValues = $keyValues;
		$secret = $keyValues['secret'];

		list($fresh, $consumer) = $this->getConsumer($key, $server);
		$this->consumer = $consumer;

		try {
			$store = new LtiOAuthDataStore($config, $key, $secret, $consumer);
			$oauthServer = new OAuth\OAuthServer($store, $time);
			$method = new OAuth\OAuthSignatureMethod_HMAC_SHA1();
			$oauthServer->add_signature_method($method);

			$request = new OAuth\OAuthRequest("POST",
				$server->server['REQUEST_SCHEME'] . '://' .
				$server->server['SERVER_NAME'] .
				$server->server['REQUEST_URI'], $server->post);
			$oauthServer->verify_request($request);
		} catch (OAuth\OAuthException $e) {
			// Verification has failed
			if($fresh) {
				$consumers = new LtiConsumers($this->config->db);
				$consumers->delete($consumer->id);
			}
			return false;
		}

		//
		// We have successfully authenticated!
		//
		return true;
	}

	private function getConsumer($key, \CL\Site\System\Server $server) {
		$ltiVersion = strip_tags($server->post['lti_version']);
		$productFamily = $this->maybeFromPost('tool_consumer_info_product_family_code', $server);
		$productVersion = $this->maybeFromPost('tool_consumer_info_version', $server);

		//
		// See if a consumer exists
		//
		$consumers = new LtiConsumers($this->config->db);
		$consumer = $consumers->get($key);
		if($consumer !== null) {
			// Does the data match?
			$any = false;
			if($consumer->productVersion !== $productVersion) {
				$consumer->productVersion = $productVersion;
				$any = true;
			}

			if($consumer->productFamily !== $productFamily) {
				$consumer->productFamily = $productFamily;
				$any = true;
			}

			if($consumer->ltiVersion !== $ltiVersion) {
				$consumer->ltiVersion = $ltiVersion;
				$any = true;
			}

			if($any) {
				$consumers->update($consumer);
			}

			return [false, $consumer];
		}

		// Create a new consumer
		$consumer = new LtiConsumer();
		$consumer->key = $key;
		$consumer->ltiVersion = $ltiVersion;
		$consumer->productFamily = $productFamily;
		$consumer->productVersion = $productVersion;
		$consumer->created = $this->time;

		$consumers->add($consumer);
		return [true, $consumer];
	}

	private function maybeFromPost($key, \CL\Site\System\Server $server, $default='') {
		if(isset($server->post[$key])) {
			return strip_tags($server->post[$key]);
		}

		return $default;
	}

	private $key;
	private $keyValues;
	private $time;
	private $config;
	private $consumer;
}