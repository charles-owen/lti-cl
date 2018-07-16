<?php
/**
 * Locate or make user based on the LTI request
 */

namespace CL\Lti;

use CL\Site\Site;
use CL\Site\System\Server;
use CL\Course\Members;
use CL\Course\Member;
use CL\Users\Users;
use CL\Users\User;

class LtiUserMaker {

	public function __construct(Site $site, Server $server, $time) {
		$this->site = $site;
		$this->server = $server;
		$this->time = $time;
	}

	/**
	 * Find a course member for this combination of consumer, key, semester, and section
	 * or make one if none exists.
	 * @param LtiConsumer $consumer
	 * @param $semester
	 * @param $section
	 * @return User object with a membership.
	 */
	public function findOrMake(LtiConsumer $consumer, $semester, $section) {
		// Find the user id
		if(!isset($this->server->post['user_id'])) {
			return $this->site->root . '/cl/lti/error.php?e=c';
		}

		$post = $this->server->post;
		$ltiUserId =  strip_tags($post['user_id']);
		$this->roles = isset($post['roles']) ? strip_tags($post['roles']) : '';

		//
		// First we see if there is already an lti_user record
		// for this course member.
		//
		$ltiUsers = new LtiUsers($this->site->db);
		$ltiUser = $ltiUsers->get($consumer->id, $ltiUserId, $semester, $section);
		if($ltiUser !== null) {
			// We have an existing valid LTI user
			return $ltiUser;

		} else {
			return $this->make($consumer, $ltiUserId, $semester, $section);
		}

	}

	private function make(LtiConsumer $consumer, $ltiUserId, $semester, $section) {
		// Is there an existing course member?
		$members = new Members($this->site->db);

		$result = $members->query([
			'userUser'=>$this->getUserId(),
			'semester'=>$semester,
			'section'=>$section
		]);

		if(!empty($result)) {
			$user = $result[0];
		} else {
			$user = $this->getUser();

			// We now have a new or existing user
			// Create a course membership
			$member = new Member();
			$member->userId = $user->id;
			$member->semester = $semester;
			$member->sectionId = $section;
			$member->role = $this->getNewMemberRole();
			$members->add($member, $this->time);
			$user->member = $member;
		}

		// Create the corresponding lti_user record
		$ltiUsers = new LtiUsers($this->site->db);
		$ltiUsers->add($user,
			$consumer->id,
			$ltiUserId,
			$this->roles,
			$this->time);

		return $user;
	}

	/**
	 * Get a user object.
	 *
	 * If one already exists, return that. Otherwise, create one.
	 */
	private function getUser() {
		$users = new Users($this->site->db);

		// Do we have a user id?
		$userId = $this->getUserId();

		if($userId !== null) {
			$user = $users->getByUser($userId);
			if ($user !== null) {
				// There is an existing user
				return $user;
			}

			$user = new User();
			$user->userId = $userId;
		} else {
			$user = new User();
		}

		$user->role = $this->getNewUserRole();

		$post = $this->server->post;

		if(!empty($post['lis_person_name_family']) && !empty($post['lis_person_name_given'])) {
			$user->name = strip_tags($post['lis_person_name_family']) . ', ' . strip_tags($post['lis_person_name_given']);
		} else if(!empty($post['lis_person_name_full'])) {
			$nameParts = explode(' ', strip_tags($post['lis_person_name_full']));

			$num = count($nameParts);
			$name = $nameParts[$num - 1];
			if($num > 1) {
				$num .= ',';

				for($i=0; $i<$num-1; $i++) {
					$name .= ' ' . $nameParts[$i];
				}
			}

			$user->name = $name;
		}

		if(!empty($post['lis_person_contact_email_primary'])) {
			$user->email = strip_tags($post['lis_person_contact_email_primary']);
		}

		$users->add($user, $this->time);
		return $user;
	}

	/**
	 * Get the user ID from the server POST data.
	 * This may need to be modified for other learning management systems.
	 * @return null|string
	 */
	private function getUserId() {
		// Do we have a user id?
		if (!empty($this->server->post['ext_d2l_username'])) {
			return strip_tags($this->server->post['ext_d2l_username']);
		}

		return null;
	}

	private function getNewUserRole()
	{
		if($this->hasRole('Administrator') ||
			$this->hasRole('urn:lti:sysrole:ims/lis/SysAdmin') ||
			$this->hasRole('urn:lti:sysrole:ims/lis/Administrator') ||
			$this->hasRole('urn:lti:instrole:ims/lis/Administrator')) {
			return User::ADMIN;
		}

		return User::USER;
	}

	private function getNewMemberRole()
	{
		if($this->hasRole('Administrator') ||
			$this->hasRole('urn:lti:sysrole:ims/lis/SysAdmin') ||
			$this->hasRole('urn:lti:sysrole:ims/lis/Administrator') ||
			$this->hasRole('urn:lti:instrole:ims/lis/Administrator')) {
			return Member::ADMIN;
		}

		if($this->hasRole('Instructor') ||
			$this->hasRole('ContentDeveloper')) {
			return Member::INSTRUCTOR;
		}

		if($this->hasRole('TeachingAssistant')) {
			return Member::STAFF;
		}

		if($this->hasRole('Learner')) {
			return Member::STUDENT;
		}

		return Member::GUEST;
	}

	private function hasRole($role) {
		$roles = explode(',', $this->roles);
		if(in_array($role, $roles)) {
			return true;
		}

		if (substr($role, 0, 4) !== 'urn:') {
			if(in_array('urn:lti:role:ims/lis/' . $role, $roles)) {
				return true;
			}

			if(in_array('urn:lti:instrole:ims/lis/' . $role, $roles)) {
				return true;
			}
		}

		return false;
	}

	private $roles;
	private $site;
	private $server;
	private $time;
}