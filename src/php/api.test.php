<?php

/**
 * This class is used to obtain variables
 * sent to email or unabtainable through
 * the regular API
 *
 * Allows access for:
 * - Confirm Email
 * - Reset Password
 * - Verify TOTP Code
 */

require_once 'php/class.totp.php';

class Test extends Core {

	function __construct() {
		parent::__construct();
		
	}

	function __destruct() {
		parent::__destruct();
	}
	
	/**
	 * Dummy REST call
	 *
	 * @param string $input
	 * @return string
	 *
	 * @url GET dummy/{input}
	 * @access public
	 */
	function dummyCall($input) {
		return $input;
	}
	
	/**
	 * Runs all Validate and filter
	 *
	 * @param array $request_data POST data
	 * @return array
	 *
	 * @url POST apivalidation
	 * @access public
	 */
	/*function apiValidation($request_data) {
		return $request_data;
	}*/
	
	/**
	 * Get TOTP Code 
	 *
	 * @param string $secret
	 * @return string
	 *
	 * @url GET totpcode/{secret}
	 */
	function totpCode($secret) {
		$totp = new TOTP;
		$code = $totp->getCode($secret);
		return $code;
	}
	
	/**
	 * Get email confirm Code 
	 *
	 * @param string $email
	 * @return string
	 *
	 * @url GET emailconfirmCode
	 * @url GET emailconfirmCode/{email}
	 */
	function emailConfirmCode($email = NULL) {
		$ID = $this->getIdFromEmail($email);
		
		$r = $this->db->select('user_confirm', array("user_ID" => $ID), array("hash"));
		if (!$r) { return FALSE; }
		$hash = $this->db->fetch_assoc($r);
		return $hash['hash'];
	}
	
	/**
	 * Get password reset Code 
	 *
	 * @param string $email
	 * @return string
	 *
	 * @url GET passwordresetcode
	 * @url GET passwordresetcode/{email}
	 */
	function passwordRestCode($email = NULL) {
		$ID = $this->getIdFromEmail($email);
		
		$r = $this->db->select('user_reset', array("user_ID" => $ID), array("hash"));
		if (!$r) { return FALSE; }
		$hash = $this->db->fetch_assoc($r);
		return $hash['hash'];
	}
	
	private function getIdFromEmail($email = NULL) {
		if (is_null($email)) {
			$ID = USER_ID;
		} else {
			$r = $this->db->select('users', array("user_email" => $email), array("user_ID"));
			if (!$r) { return FALSE; }
			$tmp = $this->db->fetch_assoc($r);
			$ID = $tmp['user_ID'];
		}
		return $ID;
	}
}
	
?>