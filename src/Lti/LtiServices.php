<?php
/**
 * @file
 * Services that communicate with the remote LMS.
 *
 * Includes the outcomes service: setting grades.
 *
 * Some parts based on: https://github.com/IMSGlobal/LTI-Tool-Provider-Library-PHP
 */

namespace CL\Lti;

use CL\Users\User;
use CL\Site\Site;

/**
 * Services that communicate with the remote LMS.
 */
class LtiServices {
	/// Read action
	const EXT_READ = 1;

	/// Write (create/update) action.
	const EXT_WRITE = 2;

	/// Delete action.
	const EXT_DELETE = 3;

	private $site;

	/**
	 * LtiServices constructor.
	 * @param Site $site Site object
	 */
	public function __construct(Site $site) {
		$this->site = $site;
	}



	/**
	 * Perform an Outcomes service request.
	 *
	 * @param User $user User to perform outcomes for
	 * @param int $action The action type constant
	 * @param Outcome $outcome Outcome object
	 * @param int $grade Grade to apply (0-100)
	 *
	 * @return boolean True if the request was successfully processed
	 */
	public function doOutcomesService(User $user, $action, $outcome, $grade) {

		$sourcedId = $outcome['lis_result_sourcedid'];

		$response = false;
		$this->extResponse = null;

		switch ($action) {
			case self::EXT_READ:
				$do = 'readResult';
				break;

			case self::EXT_WRITE:
				$do = 'replaceResult';
				break;

			case self::EXT_DELETE:
				$do = 'deleteResult';
				break;

			default:
				return false;
		}

		if (is_null($grade)) {
			$value = '';
		} else {
			$value = $grade / 100.0;
		}

		$xml = '';
		if ($action === self::EXT_WRITE) {
			$xml = <<<EOF
		<result>
		  <resultScore>
		    <language>en</language>
		    <textString>$value</textString>
		  </resultScore>
		</result>
EOF;
		}

		$sourcedId = htmlentities($sourcedId);
		$xml = <<<EOF
      <resultRecord>
        <sourcedGUID>
          <sourcedId>{$sourcedId}</sourcedId>
        </sourcedGUID>{$xml}
      </resultRecord>
EOF;

		if ($this->doLTI11Service($do, $outcome, $xml)) {
			switch ($action) {
				case self::EXT_READ:
					if (!isset($this->extNodes['imsx_POXBody']["{$do}Response"]['result']['resultScore']['textString'])) {
						break;
					} else {
						// $ltiOutcome->setValue($this->extNodes['imsx_POXBody']["{$do}Response"]['result']['resultScore']['textString']);
					}
				case self::EXT_WRITE:
				case self::EXT_DELETE:
					$response = true;
					break;
			}
		}

		return $response;
	}

	/**
	 * Send a service request to the tool consumer.
	 *
	 * @param string $type Message type value
	 * @param string $url  URL to send request to
	 * @param string $xml  XML of message request
	 *
	 * @return boolean True if the request successfully obtained a response
	 */
	private function doLTI11Service($type, $outcome, $xml) {

		$url = $outcome['lis_outcome_service_url'];
		$key = $outcome['key'];
		$keyValues = $this->site->lti->getKey($key);
		if($keyValues === null) {
			// Not a valid key
			return false;
		}

		$this->keyValues = $keyValues;
		$secret = $keyValues['secret'];

		$ok = false;
		$this->extRequest = null;
		$this->extRequestHeaders = '';
		$this->extResponse = null;
		$this->extResponseHeaders = '';
		if (!empty($url)) {
			$id = uniqid();
			$xmlRequest = <<< EOD
<?xml version = "1.0" encoding = "UTF-8"?>
<imsx_POXEnvelopeRequest xmlns = "http://www.imsglobal.org/services/ltiv1p1/xsd/imsoms_v1p0">
  <imsx_POXHeader>
    <imsx_POXRequestHeaderInfo>
      <imsx_version>V1.0</imsx_version>
      <imsx_messageIdentifier>{$id}</imsx_messageIdentifier>
    </imsx_POXRequestHeaderInfo>
  </imsx_POXHeader>
  <imsx_POXBody>
    <{$type}Request>
{$xml}
    </{$type}Request>
  </imsx_POXBody>
</imsx_POXEnvelopeRequest>
EOD;

			// Calculate body hash
			$hash = base64_encode(sha1($xmlRequest, true));
			$params = array('oauth_body_hash' => $hash);

			// Add OAuth signature
			$hmacMethod = new OAuth\OAuthSignatureMethod_HMAC_SHA1();
			$consumer = new OAuth\OAuthConsumer($key, $secret, null);
			$req = OAuth\OAuthRequest::from_consumer_and_token($consumer, null, 'POST', $url, $params);
			$req->sign_request($hmacMethod, $consumer, null);
			$header = $req->to_header();
			$header .= "\nContent-Type: application/xml";

			// Connect to tool consumer
			$http = new HTTPMessage($url, 'POST', $xmlRequest, $header);

			// Parse XML response
			if ($http->send()) {
				$this->extResponse = $http->response;
				$this->extResponseHeaders = $http->responseHeaders;
				try {
					$this->extDoc = new \DOMDocument();
					$this->extDoc->loadXML($http->response);
					$this->extNodes = $this->domnodeToArray($this->extDoc->documentElement);
					if (isset($this->extNodes['imsx_POXHeader']['imsx_POXResponseHeaderInfo']['imsx_statusInfo']['imsx_codeMajor']) &&
						($this->extNodes['imsx_POXHeader']['imsx_POXResponseHeaderInfo']['imsx_statusInfo']['imsx_codeMajor'] === 'success')) {
						$ok = true;
					}
				} catch (\Exception $e) {
				}
			}

		}

		return $ok;

	}

	/**
	 * Convert DOM nodes to array.
	 *
	 * @param DOMElement $node XML element
	 *
	 * @return array Array of XML document elements
	 */
	private function domnodeToArray($node)
	{

		$output = '';
		switch ($node->nodeType) {
			case XML_CDATA_SECTION_NODE:
			case XML_TEXT_NODE:
				$output = trim($node->textContent);
				break;
			case XML_ELEMENT_NODE:
				for ($i = 0; $i < $node->childNodes->length; $i++) {
					$child = $node->childNodes->item($i);
					$v = $this->domnodeToArray($child);
					if (isset($child->tagName)) {
						$t = $child->tagName;
						if (!isset($output[$t])) {
							$output[$t] = array();
						}
						$output[$t][] = $v;
					} else {
						$s = (string) $v;
						if (strlen($s) > 0) {
							$output = $s;
						}
					}
				}
				if (is_array($output)) {
					if ($node->attributes->length) {
						$a = array();
						foreach ($node->attributes as $attrName => $attrNode) {
							$a[$attrName] = (string) $attrNode->value;
						}
						$output['@attributes'] = $a;
					}
					foreach ($output as $t => $v) {
						if (is_array($v) && count($v)==1 && $t!='@attributes') {
							$output[$t] = $v[0];
						}
					}
				}
				break;
		}

		return $output;

	}

}