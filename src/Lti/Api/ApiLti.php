<?php

namespace CL\Lti\Api;

use CL\Lti\LtiOutcomes;
use CL\Site\Site;
use CL\Site\System\Server;
use CL\Site\Api\APIException;
use CL\Lti\LtiTableMaker;
use CL\Site\Api\JsonAPI;
use CL\Users\User;
use CL\Lti\LtiServices;


/**
 * API Resource for /api/lti
 */
class ApiLti extends \CL\Users\Api\Resource {
	const QUERY_LIMIT = 500;

	public function __construct() {
		parent::__construct();
	}

	public function dispatch(Site $site, Server $server, array $params, array $properties, $time) {
		$user = $this->isUser($site);

		if(count($params) === 0) {
			return $this->query($site, $user, $server);
		}

		switch($params[0]) {
			case 'grade':
				return $this->grade($site, $user, $server, $time);

			case 'items':
				return $this->items($site, $user);

			case 'tables':
				return $this->tables($site, $server, new LtiTableMaker($site->db));
		}

		throw new APIException("Invalid API Path", APIException::INVALID_API_PATH);
	}

	public function query(Site $site, User $user, Server $server) {
		$this->atLeast($user, User::STAFF);

		$params = [];
		$get = $server->get;

		if(!empty($get['memberId'])) {
			$params['memberId'] = $get['memberId'];
		}

		if(!empty($get['limit'])) {
			$limit = $get['limit'];
		} else {
			$limit = ApiLti::QUERY_LIMIT;
		}

		$params['limit'] = $limit + 1;

		if(!empty($get['assignTag'])) {
			$params['assignTag'] = $get['assignTag'];
		}

		if(!empty($get['gradeTag'])) {
			$params['assignTag'] = $get['assignTag'];
		}

		$fs = new LtiOutcomes($site->db);
		$result = $fs->query($params);

		$send = [];
		foreach($result as $row) {
			$send[] = [
				'user'=>$row['user']->data(),
				'assignTag'=>$row['assignTag'],
				'gradeTag'=>$row['gradeTag'],
				'grade'=>$row['grade'],
				'created'=>$row['created'],
				'modified'=>$row['modified'],
				'createdStr'=> $row['createdStr'],
				'modifiedStr'=> $row['modifiedStr'],
				'type'=>$row['type']
			];
		}

		$json = new JsonAPI();
		$json->addData('outcomes',  0, $send);
		return $json;
	}


	/**
	 * Get all assignment and grade tags from the table.
	 * @param Site $site The Site object
	 * @param User $user The current user
	 */
	private function items(Site $site, User $user) {
		$this->atLeast($user, User::STAFF);

		$ltiOutcomes = new LtiOutcomes($site->db);
		$assignTags = $ltiOutcomes->queryAssignTags();
		$gradeTags = $ltiOutcomes->queryGradeTags();

		$json = new JsonAPI();
		$json->addData('assigntags',  0, $assignTags);
		$json->addData('gradetags', 0, $gradeTags);
		return $json;
	}

	private function grade(Site $site, User $user, Server $server, $time) {
		$ltiOutcomes = new LtiOutcomes($site->db);

		$post = $server->post;
		$this->ensure($post, ["grade", 'assignTag', 'token']);
		$grade = +$post['grade'];
		$token = $post['token'];
		$assignTag = trim(strip_tags($post['assignTag']));
		$gradeTag = !empty($post['gradeTag']) ? trim(strip_tags($post['gradeTag'])) : '';

		$data = !empty($post['data']) ? $post['data'] : null;
		$type = !empty($post['type']) ? $post['type'] : null;

		$outcome = $ltiOutcomes->get($user, $assignTag, $gradeTag);
		if($outcome === null || $outcome['token'] === null || empty($outcome['token'])) {
			// Grading is not supported for this assignment/grade
			throw new APIException('Grading is not supported');
		}

		if($token !== $outcome['token']) {
			throw new APIException('Grading is not authorized');
		}

		// Is it better than the current grade?
		if($outcome['grade'] !== null && $grade <= $outcome['grade']) {
			// If not, we are done!
			return new JsonAPI();
		}

		if(!$ltiOutcomes->setGrade($user, $assignTag, $gradeTag, $grade, $data, $type, $time)) {
			throw new APIException('Unable to set grade');
		}

		$service = new LtiServices($site);
		$ret = $service->doOutcomesService($user, LtiServices::EXT_WRITE, $outcome, $grade);

		return new JsonAPI();
	}
}