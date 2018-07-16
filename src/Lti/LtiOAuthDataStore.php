<?php
/**
 * Created by PhpStorm.
 * User: charl
 * Date: 6/25/2018
 * Time: 6:08 PM
 */

namespace CL\Lti;


class LtiOAuthDataStore extends OAuth\OAuthDataStore {

	private $config;
	private $consumer;
	private $consumer_key;
	private $consumer_secret;

	public function __construct(\CL\Site\Site $config, $consumer_key, $consumer_secret, LtiConsumer $consumer) {
		$this->config = $config;
		$this->consumer = $consumer;
		$this->consumer_key = $consumer_key;
		$this->consumer_secret = $consumer_secret;

	}

	function lookup_consumer($consumer_key) {
		return new OAuth\OAuthConsumer($this->consumer_key, $this->consumer_secret);
	}

	function lookup_token($consumer, $token_type, $token) {

		return new OAuth\OAuthToken($consumer, '');

	}

	function lookup_nonce($consumer, $token, $nonce, $timestamp) {
		$nonces = new LtiNonces($this->config->db);
		return !$nonces->add($this->consumer->id, $nonce, $timestamp);
	}

	function new_request_token($consumer, $callback = null) {

		return NULL;

	}

	function new_access_token($token, $consumer, $verifier = null) {

		return NULL;

	}

}