<?php
/**
 * @file
 * Table maker for Lti tables
 */

namespace CL\Lti;

use CL\Tables\Config;

/**
 * Table maker for Lti tables
 */
class LtiTableMaker extends \CL\Tables\TableMaker {

	/**
	 * SiteTableMaker constructor.
	 * @param Config $config
	 */
	public function __construct(Config $config) {
		parent::__construct($config);

		$this->add(new \CL\Lti\LtiUsers($config));
		$this->add(new \CL\Lti\LtiNonces($config));
		$this->add(new \CL\Lti\LtiConsumers($config));
		$this->add(new \CL\Lti\LtiOutcomes($config));
	}
}