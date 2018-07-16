<?php
/**
 * @file
 * View class for viewing the content of files.
 */

namespace CL\Lti;

use CL\Site\Site;
use CL\Site\View;

/**
 * View class for viewing the content of files.
 */
class FileView extends View {
	/**
	 * FileView constructor.
	 * @param Site $site The Site configuration
	 * @param array $properties Properties passed from the router.
	 */
	public function __construct(Site $site, $properties) {
		parent::__construct($site);

		// Paths to the view are of the form:
		// cl/filesystem/view/22/assign1/grade3
		$memberId = $properties['id'];
		$assignTag = $properties['assign'];
		$gradeTag = $properties['grade'];
		if($assignTag === '-') {
			$assignTag = '';
		}
		if($gradeTag === '-') {
			$gradeTag = '';
		}

		$fs = new LtiOutcomes($site->db);
		$files = $fs->query(['memberId'=>$memberId, 'assignTag'=>$assignTag, 'gradeTag'=>$gradeTag]);
		if(count($files) > 0) {
			$this->file = $files[0];
			$viewUser = $this->file['user'];
			$this->title = $viewUser->name . ': ' . $this->file['assignTag'];
			if($this->file['gradeTag'] !== '') {
				$this->title .= '/' . $this->file['gradeTag'];
			}
		} else {
			$this->title = "File: File does not exist";
		}
	}

	/**
	 * Present the page content
	 * @return string HTML
	 */
	public function present() {
		$user = $this->file['user']->userId;
		$userName = $this->file['user']->name;
		$assignTag = $this->file['assignTag'];
		$gradeTag = $this->file['gradeTag'];

		$type = $this->file['type'];
		$created = $this->file['createdStr'];
		$modified = $this->file['modifiedStr'];

		$html = <<<HTML
<div>
<p></p>
<table class="small">
<tr><th class="center">Category</th><th>Name</th></tr>
<tr><th>User</th><td>$user</td></tr>
<tr><th>User Name</th><td>$userName</td></tr>
<tr><th>Assignment</th><td>$assignTag</td></tr>
<tr><th>Item</th><td>$gradeTag</td></tr>
<tr><th>Type</th><td>$type</td></tr>
<tr><th>Created</th><td>$created</td></tr>
<tr><th>Modified</th><td>$modified</td></tr>

</table>
HTML;

		switch($type) {
			case 'text/plain':
			case 'application/json':
				$html .= $this->textPlain();
				break;

			default:
				$html .= '<p class="center">Unable to preview this file type</p>';
				break;
		}

		$html .= '</div>';
		return $html;
	}

	private function textPlain() {
		$html = '';

		$fs = new LtiOutcomes($this->site->db);
		$content = $fs->readText($this->file['user']->member->id, $this->file['assignTag'], $this->file['gradeTag']);

		$x = htmlentities($content['data']);
		$html .= <<<HTML
<pre class="code">$x</pre>
HTML;

		return $html;
	}

	private $file = null;
}