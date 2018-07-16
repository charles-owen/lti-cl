<?php
/**
 * @file
 * View class for viewing the content of files.
 */

namespace CL\Lti\Views;

use CL\Site\Site;
use CL\Site\View;

/**
 * View LTI Errors
 */
class ErrorView extends View {
	/**
	 * FileView constructor.
	 * @param Site $site The Site configuration
	 * @param array $properties Properties passed from the router.
	 */
	public function __construct(Site $site, $properties) {
		parent::__construct($site, ["open"=>true]);

		switch($properties['id']) {
			case 'validate':
			default:
				$this->title = "Unable to Validate";
				$this->error = 'The External Learning Tools link was not able to successfully validate.';
				break;

			case 'available':
				$this->title = "Not Available";
				$this->error = <<<HTML
The page you have attempted to access is not available when a Learning Management System external
learning activity is active.
HTML;
				break;

			case 'configure':
				$this->title = "LTI Not Configured";
				$this->error = 'The External Learning Tools link was not properly configured.';
				break;
		}
	}

	/**
	 * Present the page content
	 * @return string HTML
	 */
	public function present() {
		$html = <<<HTML
<div class="content">
<div class="full">
<div class="centerbox comp">
<p class="shoutout">$this->error</p>
</div>
</div>
</div>
HTML;
		return $html;
	}


	private $error;
}