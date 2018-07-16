<?php

namespace CL\Lti;

/**
 * An LTI tool consumer.
 */
class LtiConsumer {

	public function __construct($row = null) {
		if($row !== null) {
			$this->id = $row['id'];
			$this->ltiVersion = $row['lti_version'];
			$this->productVersion = $row['product_version'];
			$this->productFamily = $row['product_family'];
			$this->created = strtotime($row['created']);
		}
	}

	public $id = 0;
	public $ltiVersion = '';
	public $productFamily = '';
	public $productVersion = '';
	public $created = 0;
}