<?php
/**
 * @file
 * Table class for LTI Nonce values.
 */

namespace CL\Lti;


/**
 * Table class for LTI Nonce values.
 *
 * A nonce is a value sent with the authorization. It can only be used
 * one time, which prevents playback attacks.
 */
class LtiNonces extends \CL\Tables\Table {
	/// Maximum nonce age in the table in seconds
	const MAX_NONCE_AGE = 30 * 60;  // seconds

	/**
	 * LtiNonces constructor.
	 * @param \CL\Tables\Config $config Database configuration object
	 */
	function __construct(\CL\Tables\Config $config) {
		parent::__construct($config, "lti_nonce");
	}

	/**
	 * Add a nonce to the table.
	 * @param string $consumerId The consumer's ID
	 * @param string $value Value of the nonce
	 * @param int $time Current time
	 * @return True if success, false if already exists
	 */
	function add($consumerId, $value, $time=null) {
		if($time === null) {
			$time = time();
		}

		$sql = <<<SQL
insert into $this->tablename(lti_consumerid, value, expires)
values(?, ?, ?)
SQL;

		$stmt = $this->config->pdo->prepare($sql);
		try {
			if($stmt->execute([$consumerId, $value, $this->timeStr($time + self::MAX_NONCE_AGE)]) === false) {
				return false;
			}
		} catch(\PDOException $exception) {
			return false;
		}

		return true;
	}

	/**
	 * Expire any out-of-date nonces in the table (by deleting them)
	 * @param int $time Current time
	 * @return bool
	 */
	public function expire($time = null) {
		if($time === null) {
			$time = time();
		}

		$sql = <<<SQL
delete from $this->tablename
where expires <= ?
SQL;

		$stmt = $this->config->pdo->prepare($sql);
		try {
			if($stmt->execute([$this->timeStr($time)]) === false) {
				return false;
			}
		} catch(\PDOException $exception) {
			return false;
		}

		return true;
	}

	/**
	 * Create table command
	 * @return string SQL
	 */
	public function createSQL() {
		return <<<SQL
CREATE TABLE if not exists $this->tablename (
  lti_consumerid int(11) NOT NULL, 
  value          varchar(32) NOT NULL, 
  expires        datetime NOT NULL, 
  PRIMARY KEY (lti_consumerid, 
  value));
SQL;

	}
}