<?php
/**
 * @file
 * LTI Outcomes service support table lti_outcome
 */

namespace CL\Lti;

use CL\Users\User;
use CL\Course\Members;
use CL\Course\Member;


/**
 * LTI Outcomes service support table lti_outcome
 */
class LtiOutcomes extends \CL\Tables\Table {

	/**
	 * Members constructor.
	 * @param \CL\Tables\Config $config Database configuration object
	 */
	public function __construct(\CL\Tables\Config $config) {
		parent::__construct($config, "lti_outcome");
	}


	/**
	 * Create an SQL create table command for the lti_grade table
	 * @return string SQL
	 */
	public function createSQL() {
		return <<<SQL
CREATE TABLE if not exists $this->tablename (
  memberid                int(11) NOT NULL, 
  assigntag               varchar(30) NOT NULL, 
  gradetag                varchar(30) NOT NULL, 
  `key`                   varchar(254) NOT NULL, 
  lis_result_sourcedid    varchar(254) NOT NULL, 
  lis_outcome_service_url mediumtext NOT NULL, 
  grade                   int(11), 
  created                 datetime NOT NULL, 
  modified                datetime NOT NULL, 
  token                   varchar(30), 
  data                    longblob, 
  type                    varchar(50), 
  PRIMARY KEY (memberid, 
  assigntag, 
  gradetag), 
  INDEX (assigntag));

SQL;

	}

	/**
	 * Get a record from the lti_grade table.
	 * @param User $user User we are getting the record for
	 * @param $assignTag The assignment tag
	 * @param null $gradeTag The grade tag (optional)
	 * @return null|array Array with the fields of the table on success.
	 */
	public function get(User $user, $assignTag, $gradeTag=null) {
		$sql = <<<SQL
select * from $this->tablename
where memberid=? and assigntag=? and gradetag=?
SQL;

		if($gradeTag === null) {
			$gradeTag = '';
		}

		//echo $this->sub_sql($sql, [$user->member->id, $assignTag, $gradeTag]);
		$pdo = $this->pdo;
		$stmt = $pdo->prepare($sql);
		try {
			if($stmt->execute([$user->member->id, $assignTag, $gradeTag]) === false) {
				return null;
			}
		} catch(\PDOException $exception) {
			return null;
		}

		$row = $stmt->fetch(\PDO::FETCH_ASSOC);
		if($row === false || $row === null) {
			return null;
		}

		$row['created'] = strtotime($row['created']);
		$row['modified'] = strtotime($row['modified']);
		return $row;
	}

	/**
	 * Get an appropriate lti_grade object. If one already exists,
	 * update it to the values of $sourcedId and $url if necessary and return it.
	 * If not, create a new record and return that.
	 * @param User $user User this is for. Must be a course member.
	 * @param string $key Key for the resource
	 * @param string $assignTag Assignment tag
	 * @param null|string $gradeTag Grading item tag
	 * @param string $gradeToken Token used to identify the grade in the remote system
	 * @param string $sourcedId The lis_result_sourcedid value.
	 * @param string $url The lis_outcome_service_url
	 * @param int $time The current time
	 * @return array|null Array with the table fields.
	 */
	public function getOrMake(User $user, $key, $assignTag, $gradeTag=null, $gradeToken, $sourcedId, $url, $time) {
		$pdo = $this->pdo;

		if($gradeTag === null) {
			$gradeTag = '';
		}

		$row = $this->get($user, $assignTag, $gradeTag);
		if($row !== null) {
			// We have an existing record. However, the sourcedId and/or the url
			// or the key or the grading token may have changed.
			if($row['lis_result_sourcedid'] === $sourcedId &&
				$row['lis_outcome_service_url'] === $url &&
			    $row['token'] === $gradeToken) {
				return $row;
			}

			$sql = <<<SQL
update $this->tablename
set `key`=?, lis_result_sourcedid=?, lis_outcome_service_url=?, modified=?, token=?
where memberid=? and assigntag=? and gradetag=?
SQL;

			$stmt = $pdo->prepare($sql);
			try {
				if($stmt->execute([$key, $sourcedId, $url, $this->timeStr($time), $gradeToken,
						$user->member->id, $assignTag, $gradeTag]) === false) {
					return null;
				}

				$row['key'] = $key;
				$row['modified'] = $time;
				$row['lis_result_sourcedid'] = $sourcedId;
				$row['lis_outcome_service_url'] = $url;
				return $row;
			} catch(\PDOException $exception) {
				return null;
			}
		} else {
			// Create a new record
			$sql = <<<SQL
insert into $this->tablename(memberid, `key`, assigntag, gradetag, lis_result_sourcedid, lis_outcome_service_url, created, modified, token)
values(?, ?, ?, ?, ?, ?, ?, ?, ?)
SQL;

			//echo $this->sub_sql($sql, [$user->member->id, $key, $assignTag, $gradeTag, $sourcedId,
			//	$url, $this->timeStr($time), $this->timeStr($time)]);
			$stmt = $pdo->prepare($sql);
			try {
				if($stmt->execute([$user->member->id, $key, $assignTag, $gradeTag, $sourcedId,
						$url, $this->timeStr($time), $this->timeStr($time), $gradeToken]) === false) {
					return null;
				}

				return [
					'memberid'=>$user->member->id,
					'key'=>$key,
					'assigntag'=>$assignTag,
					'gradetag'=>$gradeTag,
					'lis_result_sourcedid'=>$sourcedId,
					'lis_outcome_service_url'=>$url,
					'created'=>$time,
					'modified'=>$time,
					'grade'=>null

				];

			} catch(\PDOException $exception) {
				return null;
			}

		}
	}

	/**
	 * Set a grade in the outcomes table.
	 * @param User $user
	 * @param $assignTag
	 * @param null $gradeTag
	 * @param $grade
	 * @param $data
	 * @param $type
	 * @param $time
	 * @return bool
	 */
	public function setGrade(User $user, $assignTag, $gradeTag=null, $grade, $data, $type, $time) {
		$sql = <<<SQL
update $this->tablename
set grade=?, data=?, `type`=?, modified=?
where memberid=? and assigntag=? and gradetag=?
SQL;

		$exec = [$grade, $data, $type, $this->timeStr($time),
			$user->member->id, $assignTag, $gradeTag];
		//echo $this->sub_sql($sql, $exec);
		$stmt = $this->pdo->prepare($sql);
		try {
			return $stmt->execute($exec);
		} catch(\PDOException $exception) {
			return false;
		}
	}


	/**
	 * Query the table for the LTI console page presentation of results
	 * @param $params Parameters to the query
	 * @return array Array of results.
	 */
	public function query($params) {
		// Utility class that makes it easy to build
		// complex combinations of arbitrary parameters
		$where = new \CL\Tables\TableWhere($this);

		if(isset($params['memberId'])) {
			$where->append('lti.memberid=?', $params['memberId'], \PDO::PARAM_INT);
		}

		if(isset($params['assignTag'])) {
			$where->append('lti.assigntag=?', $params['assignTag']);
		}

		if(isset($params['gradeTag'])) {
			$where->append('lti.gradetag=?', $params['gradeTag']);
		}

		$members = new Members($this->config);

		$additional = <<<SQL
lti.assigntag as assigntag, lti.gradetag as gradetag, lti.grade as grade,
lti.created as created, lti.modified as modified, lti.type as type
SQL;

		$sql = $members->memberUserJoinSQL($additional);
		$sql .= <<<SQL
join $this->tablename lti
on member.id = lti.memberid
$where->where
order by user.name, user.id, assigntag, gradetag
SQL;

		if(isset($params['limit'])) {
			$sql .= "\nlimit ?";
			$where->append(null, intval($params['limit']), \PDO::PARAM_INT);
		}

		// echo $where->sub_sql($sql);

		$result = $where->execute($sql);
		$ret = [];
		foreach($result as $row) {
			$user = new User($row);
			$user->member = new Member($row);
			$ret[] = [
				'user'=>$user,
				'assignTag'=>$row['assigntag'],
				'gradeTag'=>$row['gradetag'],
				'grade'=>$row['grade'],
				'created'=>strtotime($row['created']),
				'modified'=>strtotime($row['modified']),
				'createdStr'=> date("n-d-Y h:i:sa", strtotime($row['created'])),
				'modifiedStr'=> date("n-d-Y h:i:sa", strtotime($row['modified'])),
				'type'=>$row['type']
			];
		}

		return $ret;
	}


	/**
	 * Get all indicated assignment tags
	 */
	public function queryAssignTags() {
		$sql = <<<SQL
select distinct assigntag
from $this->tablename
order by assigntag
SQL;

		$stmt = $this->pdo->prepare($sql);
		try {
			if(!$stmt->execute()) {
				return false;
			}
		} catch(\PDOException $e) {
			return false;
		}

		$tags = [];
		foreach($stmt->fetchAll(\PDO::FETCH_ASSOC) as $row) {
			$tags[] = $row['assigntag'];
		}

		return $tags;
	}

	/**
	 * Get all indicated grade tags
	 */
	public function queryGradeTags() {
		$sql = <<<SQL
select distinct gradetag
from $this->tablename
order by gradetag
SQL;

		$stmt = $this->pdo->prepare($sql);
		try {
			if(!$stmt->execute()) {
				return false;
			}
		} catch(\PDOException $e) {
			return false;
		}

		$tags = [];
		foreach($stmt->fetchAll(\PDO::FETCH_ASSOC) as $row) {
			if($row['gradetag'] === '') {
				continue;
			}

			$tags[] = $row['gradetag'];
		}

		return $tags;
	}

	/**
	 * Read text from an LTI submission.
	 * @param int $memberId The internal member ID
	 * @param string $assignTag Assignment tag
	 * @param string $gradeTag Grading item tag
	 * @return array|null
	 */
	public function readText($memberId, $assignTag, $gradeTag) {
		$pdo = $this->pdo;

		$sql = <<<SQL
select `data`, type from $this->tablename
where memberid=? and assigntag=? and gradetag=?
SQL;

		$data = null;
		$type = null;

		$stmt = $pdo->prepare($sql);
		$stmt->execute([$memberId, $assignTag, $gradeTag]);

		//echo $this->sub_sql($sql, [$userId, $appTag, $name]);

		$stmt->bindColumn(1, $data, \PDO::PARAM_STR);
		$stmt->bindColumn(2, $type, \PDO::PARAM_STR);
		if($stmt->fetch(\PDO::FETCH_BOUND) !== false) {
			return [
				'data' => $data,
				'type' => $type
			];
		} else {
			return null;
		}
	}

}