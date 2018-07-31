<?php

namespace CL\Lti;

/**
 * An LTI tool consumer.
 */
class LtiConsumer {

	/**
	 * LtiConsumer constructor.
	 * @param array $row Database row (optional)
	 */
	public function __construct($row = null) {
		if($row !== null) {
			$this->id = $row['id'];
			$this->ltiVersion = $row['lti_version'];
			$this->productVersion = $row['product_version'];
			$this->productFamily = $row['product_family'];
			$this->created = strtotime($row['created']);
		}
	}

	/// Record ID
	public $id = 0;

	/// LTI version for this consumer
	public $ltiVersion = '';

	/// Consumer product family
	public $productFamily = '';

	/// Consumer product version
	public $productVersion = '';

	/// When was this record created?
	public $created = 0;
}