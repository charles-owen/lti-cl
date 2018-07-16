<?php
/**
 * @file
 * View class for viewing the content of files.
 */

namespace CL\Lti;

use CL\Site\Site;
use CL\Site\View;
use CL\Site\System\Server;

class FileDownload extends View {
	public function __construct(Site $site, Server $server, $properties) {
		parent::__construct($site);

		$this->properties = $properties;
		$this->server = $server;
	}

	public function whole() {

		// Paths to the view are of the form:
		// cl/filesystem/view/22/assign1/grade3
		$memberId = $this->properties['id'];
		$assignTag = $this->properties['assign'];
		$gradeTag = $this->properties['grade'];
		if($assignTag === '-') {
			$assignTag = '';
		}
		if($gradeTag === '-') {
			$gradeTag = '';
		}

		$fs = new LtiOutcomes($this->site->db);
		$file = $fs->readText($memberId, $assignTag, $gradeTag);
		if($file === null) {
			return "No such file";
		}

		switch($file['type']) {
			case 'text/plain':
			default:
				$name = 'submission.txt';
				break;

			case 'application/json':
				$name = 'submission.json';
				break;

			case 'text/html':
				$name = 'submission.html';
				break;

			case 'text/css':
				$name = 'submission.css';
				break;
		}

		$server = $this->server;
		$server->header('Content-Type: ' . $file['type']);
		$server->header("Content-Transfer-Encoding: Binary");
		$server->header("Content-disposition: attachment; filename=\"$name\"");
		return $file['data'];
	}

	private $properties;

	private $server;
	private $id;
}