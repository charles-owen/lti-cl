<?php
/**
 * @file
 * Table class for LTI tool consumers
 */

namespace CL\Lti;


/**
 * Table class for LTI tool consumers
 *
 * In our system we only support one LTI consumer since it is assumed the site
 * will be associated with one LMS.
 */
class LtiConsumers extends \CL\Tables\Table {
	/**
	 * LtiConsumers constructor.
	 * @param \CL\Tables\Config $config
	 */
	function __construct(\CL\Tables\Config $config) {
		parent::__construct($config, "lti_consumer");
	}

	/**
	 * Add a record to the table.
	 * @param LtiConsumer $consumer
	 * @return int|null
	 */
	public function add(LtiConsumer $consumer) {
		$sql = <<<SQL
insert into $this->tablename(lti_version, product_family, product_version, created)
values(?, ?, ?, ?)
SQL;

		$pdo = $this->config->pdo;
		$stmt = $pdo->prepare($sql);
		try {
			if($stmt->execute([$consumer->ltiVersion,
					$consumer->productFamily, $consumer->productVersion, $this->timeStr($consumer->created)]) === false) {
				return null;
			}
		} catch(\PDOException $exception) {
			return null;
		}

		$consumer->id = $pdo->lastInsertId();
		return $consumer->id;
	}

	/**
	 * Update a record
	 * @param LtiConsumer $consumer
	 * @return null
	 */
	public function update(LtiConsumer $consumer) {
		$sql = <<<SQL
update $this->tablename
set lti_version=?, product_family=?, product_version=?
where id=?
SQL;

		$pdo = $this->config->pdo;
		$stmt = $pdo->prepare($sql);
		try {
			if($stmt->execute([$consumer->ltiVersion,
					$consumer->productFamily, $consumer->productVersion, $consumer->id]) === false) {
				return null;
			}
		} catch(\PDOException $exception) {
			return null;
		}
	}

	/**
	 * Get the one and only consumer if it exists.
	 * @return LtiConsumer|null
	 */
	public function get() {
		$sql = <<<SQL
select * from $this->tablename
SQL;

		$pdo = $this->config->pdo;
		$stmt = $pdo->prepare($sql);
		try {
			if($stmt->execute() === false) {
				return null;
			}
		} catch(\PDOException $exception) {
			return null;
		}

		$row = $stmt->fetch(\PDO::FETCH_ASSOC);
		if($row === false) {
			return null;
		}

		return new LtiConsumer($row);
	}

	/**
	 * Get the consumer by its id value
	 * @param $id Internal consumer ID.
	 * @return LtiConsumer|null
	 */
	public function getById($id) {
		$sql = <<<SQL
select * from $this->tablename
where id=?
SQL;

		return $this->getByValue($sql, $id);
	}

	private function getByValue($sql, $value) {
		$pdo = $this->config->pdo;
		$stmt = $pdo->prepare($sql);
		try {
			if($stmt->execute([$value]) === false) {
				return null;
			}
		} catch(\PDOException $exception) {
			return null;
		}

		$row = $stmt->fetch(\PDO::FETCH_ASSOC);
		if($row === false) {
			return null;
		}

		return new LtiConsumer($row);
	}

	/**
	 * Delete a consumer record.
	 * @param string $id Record id to delete
	 */
	public function delete($id) {
		$sql = <<<SQL
delete from $this->tablename
where id=?
SQL;

		$stmt = $this->config->pdo->prepare($sql);
		try {
			$stmt->execute([$id]);
		} catch(\PDOException $exception) {
			return;
		}
	}

	/**
	 * Create SQL for this table.
	 * @return string SQL
	 */
	public function createSQL() {
		return <<<SQL
CREATE TABLE if not exists $this->tablename (
  id              int(11) NOT NULL AUTO_INCREMENT, 
  lti_version     varchar(10) NOT NULL, 
  product_family  varchar(254), 
  product_version varchar(100), 
  created         datetime NOT NULL, 
  PRIMARY KEY (id));
SQL;

	}
}