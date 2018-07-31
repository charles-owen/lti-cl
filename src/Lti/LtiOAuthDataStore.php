<?php
/**
 * @file
 * DataStore object supporting OAuth authentication
 */

namespace CL\Lti;

/**
 * DataStore object supporting OAuth authentication
 */
class LtiOAuthDataStore extends OAuth\OAuthDataStore {

	private $config;
	private $consumer;
	private $consumer_key;
	private $consumer_secret;

	/**
	 * LtiOAuthDataStore constructor.
	 * @param \CL\Site\Site $config
	 * @param $consumer_key
	 * @param $consumer_secret
	 * @param LtiConsumer $consumer
	 */
	public function __construct(\CL\Site\Site $config, $consumer_key, $consumer_secret, LtiConsumer $consumer) {
		$this->config = $config;
		$this->consumer = $consumer;
		$this->consumer_key = $consumer_key;
		$this->consumer_secret = $consumer_secret;

	}

	/**
	 * Lookup a given consumer key.
	 *
	 * Since we assume only one consumer, this just returns an OAuthConsumer object.
	 * @param $consumer_key Key to lookup
	 * @return OAuth::OAuthConsumer
	 */
	public function lookup_consumer($consumer_key) {
		return new OAuth\OAuthConsumer($this->consumer_key, $this->consumer_secret);
	}

	/**
	 * Lookup an authentication token for a consumer.
	 *
	 * Since we assume only one consumer, this just creates a new OAuthToken object
	 * @param $consumer
	 * @param $token_type
	 * @param $token
	 * @return OAuth::OAuthToken
	 */
	public function lookup_token($consumer, $token_type, $token) {

		return new OAuth\OAuthToken($consumer, '');

	}

	/**
	 * Lookup nonce in the nonce table.
	 * @param $consumer
	 * @param $token
	 * @param $nonce
	 * @param $timestamp
	 * @return bool
	 */
	public function lookup_nonce($consumer, $token, $nonce, $timestamp) {
		$nonces = new LtiNonces($this->config->db);
		return !$nonces->add($this->consumer->id, $nonce, $timestamp);
	}

	/**
	 * Create a new request token.
	 * @param $consumer
	 * @param null $callback
	 * @return null
	 */
	public function new_request_token($consumer, $callback = null) {
		return NULL;
	}

	/**
	 * Create a new access token.
	 * @param $token
	 * @param $consumer
	 * @param null $verifier
	 * @return null
	 */
	public function new_access_token($token, $consumer, $verifier = null) {
		return NULL;
	}

}