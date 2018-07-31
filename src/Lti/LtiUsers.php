<?php
/**
 * @file
 * Table class for LTI Nonce values.
 */

namespace CL\Lti;

use CL\Course\Member;
use CL\Course\Members;
use CL\Users\User;
use CL\Tables\Config;


/**
 * Table class for LTI Users.
 *
 * This table maps the LTI User ID to a site user ID.
 */
class LtiUsers extends \CL\Tables\Table {
	/**
	 * LtiUsers constructor.
	 * @param Config $config Database configuration
	 */
	function __construct(Config $config) {
		parent::__construct($config, "lti_user");
	}

	/**
	 * Add a member to the table.
	 * @param User $user The user to add. Must include a membership.
	 * @param $ltiConsumerId - The LTI consumer
	 * @param $ltiUserId - The Lti user ID from the launch request
	 * @param $ltiRoles LTI provided roles
	 * @param int $time Current time
	 * @return bool
	 */
	function add(User $user, $ltiConsumerId, $ltiUserId, $ltiRoles, $time=null) {
		if($time === null) {
			$time = time();
		}

		$sql = <<<SQL
insert into $this->tablename(memberid, lti_consumerid, lti_userid, lti_roles, created)
values(?, ?, ?, ?, ?)
SQL;

		$stmt = $this->config->pdo->prepare($sql);
		try {
			if($stmt->execute([$user->member->id, $ltiConsumerId, $ltiUserId, $ltiRoles, $this->timeStr($time)]) === false) {
				return false;
			}
		} catch(\PDOException $exception) {
			return false;
		}

		return true;
	}


	/**
	 * Get an existing LTI user.
	 * @param string $ltiConsumerId The LTI consumer ID
	 * @param string $ltiUserId The LTI user ID
	 * @param string $semester Semester code, as in FS18
	 * @param string $sectionId Section ID, as in '730'
	 * @return User|null User with membership if successful
	 */
	function get($ltiConsumerId, $ltiUserId, $semester, $sectionId) {
		$members = new Members($this->config);

		$sql = $members->memberUserJoinSQL();
		$sql .= <<<SQL
join $this->tablename lti_user
on member.id = lti_user.memberid
where lti_consumerid=? and lti_userid=? and member.semester=? and member.section=?
SQL;

		$stmt = $this->config->pdo->prepare($sql);
		try {
			if($stmt->execute([$ltiConsumerId, $ltiUserId, $semester, $sectionId]) === false) {
				return null;
			}
		} catch(\PDOException $exception) {
			return null;
		}

		$row = $stmt->fetch(\PDO::FETCH_ASSOC);
		if($row === false) {
			return null;
		}

		$user = new User($row);
		$member = new Member($row);
		$user->member = $member;

		return $user;
	}

	/**
	 * create table statement
	 * @return string HTML
	 */
	function createSQL() {
		return <<<SQL
CREATE TABLE if not exists $this->tablename (
  memberid       int(11) NOT NULL, 
  lti_consumerid int(11) NOT NULL, 
  lti_userid     varchar(254) NOT NULL, 
  lti_roles      varchar(254) NOT NULL, 
  created        datetime NOT NULL, 
  PRIMARY KEY (memberid), 
  INDEX (lti_consumerid), 
  INDEX (lti_userid));

SQL;

	}
}