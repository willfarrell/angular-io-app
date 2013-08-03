<?php
/**
 * Handle core Account level operations
 */

require_once 'php/class.session.php';
require_once 'php/class.totp.php';

if (!defined("PASSWORD_RESET_LENGTH")) define("PASSWORD_RESET_LENGTH", 3600);

class Account extends Core {
	
	/**
	 * Constructs a Account object.
	 */
	function __construct() {
		global $session;
		parent::__construct();
		
		$this->session = $session;
		$this->password = new Password;
	}
	
	/**
	 * Destructs a Account object.
	 *
	 * @return void
	 */
	function __destruct() {
		parent::__destruct();
	}
	
	/**
	 * check if still signned in
	 *
	 * @url GET signcheck
	 * @access public
	 */
	function get_signcheck() {
		return USER_ID;
	}

	/**
	 * change session ID
	 *
	 * @retrurn bool
	 *
	 * @url GET regen
	 * @access public
	 */
	function get_regen() {
		$this->session->regen_id(true);
		return TRUE;
	}

	/**
	 * don't upgrade with global vars, use $this->session->cookie
	 *
	 * @url GET session
	 * @access protected
	 */
	function get_session() {		
		$return = array();
		
		// same as in session - refactor
		$query = "SELECT * FROM users WHERE user_ID = '{{user_ID}}' LIMIT 0,1";
		$result = $this->db->query($query, array('user_ID' => $this->session->cookie['user_ID']));
		if (!$result) { return $return; } // user / pass combo not found
		$r = $this->db->fetch_assoc($result);

		$return = array();
		$return["account"] = array(
			"password_timestamp" => $r['password_timestamp'], // for password reset reminder
			"password_age" => floor(($_SERVER["REQUEST_TIME"] - $r['password_timestamp'])/86400),
			"timestamp_create" => $r['timestamp_create'], // for onboard trigger
			
			"referral" => base_convert($r['user_ID'], 10, 32),
			"email_confirm" => ($r['timestamp_confirm']) ? true : false,
		);
		
		$return["user"] = array(
			"user_ID" => $r['user_ID'],
			"user_level"  => $r['user_level'],
			"user_email" => $r['user_email'],
			"user_username" => $r['user_username'],
			"user_name_first" => $r['user_name_first'],
			"user_name_last" => $r['user_name_last'],
		);
		
		// company
		$return["company"] = array(
			"company_ID" => 0
		);
		if ($r["company_ID"]) {
			$query = "SELECT * FROM companies WHERE company_ID = '{{company_ID}}' LIMIT 0,1";
			$result = $this->db->query($query, array('company_ID' => $r["company_ID"]));
			if ($result) {
				$r = $this->db->fetch_assoc($result);

				$return["company"] = array(
					"company_ID" => $r['company_ID'],
					"company_name" => $r['company_name'],
					"company_url" => $r['company_url'],
				);
			}
		}

		return $return;
	}
	
	/**
	 * Check if a user_username is unique
	 *
	 * @param string $value query string
	 * @return array
	 * 
	 * @url GET unique/{value}
	 * @aceess public
	 */
	function get_unique($value=NULL) {	// $type=NULL,
		// for user_username only

		$query = "SELECT * FROM users WHERE user_username = '{{user_username}}' && user_ID != '{{user_ID}}' LIMIT 0,1";
		$result = $this->db->query($query, array('user_username' => strtolower($value), 'user_ID' => USER_ID));
		if ($result) {
			$return["errors"]["user_username"] = "Not unique";
			return $return;
		}
		return TRUE;
	}
	
	/**
	 * Sign Up
	 *
	 * @param array $request_data POST data
	 * @return array
	 * 
	 * @url POST signup
	 * @aceess public
	 */
	function post_signup($request_data=NULL) {
		$return = array();

		// validate and sanitize
		$this->filter->set_request_data($request_data);
		$this->filter->set_group_rules('table_users');
		if(!$this->filter->run()) {
			$return["errors"] = $this->filter->get_errors('error');
			return $return;
		}
		$request_data = $this->filter->get_request_data();
		
		$email = $request_data["email"];

		// referral
		$referral_user_ID = (isset($request_data['referral'])) ? base_convert($request_data['referral'],32,10) : 0;

		// user //
		$password_hash = $this->password->hash($request_data["password"], $email);
		$user = array(
			"user_email"   		  => $request_data["email"],
			"user_level"		  => 9,
			//"user_username"   		  => $request_data["user_username"],
			"password"	 		  => $password_hash,
			"password_history"	=> $password_hash,
			'password_timestamp'  => $_SERVER['REQUEST_TIME'],
			'referral_user_ID'	=> $referral_user_ID,
			//'timestamp_confirm'   => 0,
			//'timestamp_create'	=> $_SERVER['REQUEST_TIME'],
			//'timestamp_update'	=> $_SERVER['REQUEST_TIME'],
		);
		$user_ID = $this->db->insert('users', $user);
		
		// send confirm email
		$hash = substr(hash("sha512", $email.$_SERVER['REQUEST_TIME']), 0, 16);
	
		$insert = array('user_ID' => $user_ID, 'hash' => $hash);
		$this->db->insert_update('user_confirm', $insert, $insert);

		$this->notify->send($user_ID, 'signup_confirm_email', array("hash" => $hash), "email");
		
		//$return = array("alerts" => array(array('class' => 'success', 'label' => 'Account created!', 'message' => 'Check your email for an activation link.')));
		
		return TRUE;
	}
	
	/**
	 * Resend confirmation email
	 *
	 * @return NULL
	 * 
	 * @url GET resend_confirm_email
	 * @aceess protected
	 */
	function resend_confirm_email() {
		$hash = substr(hash("sha512", USER_EMAIL.$_SERVER['REQUEST_TIME']), 0, 16);
		
		$insert = array('user_ID' => USER_ID, 'hash' => $hash);
		$this->db->insert_update('user_confirm', $insert, $insert);

		$this->notify->send(USER_ID, 'signup_confirm_email', array("hash" => $hash), "email");
	}

	/**
	 * Sign In
	 *
	 * @param array $request_data POST data
	 * @return array
	 * 
	 * @url POST signin
	 * @aceess public
	 */
	function post_signin($request_data=NULL) {
		$return = array();

		// validate and sanitize
		$this->filter->set_request_data($request_data);
		if(!$this->filter->run()) {
			$return["errors"] = $this->filter->get_errors('error');
			return $return;
		}
		$request_data = $this->filter->get_request_data();
		
		// set non true values to 0
		if ($request_data['remember'] != 1) $request_data['remember'] = 0;
		//$this->redis->hset()

		$login = $this->session->login($request_data['email'], $request_data['password'], $request_data['remember']); // , $request_data['ua']
		if ($login) {
			if ($this->session->cookie['totp_secret']) {
				return array("totp" => true, "user_ID" => $this->session->cookie['user_ID']);
			} else {
				return $this->get_session();
			}
		}

		$return["errors"]['password'] = "Sign in information invalid.";
		return $return;
	}
	
	/**
	 * check token based on service
	 *
	 * @param string $code Hash code
	 * @return array
	 * 
	 * @url PUT totp/{code}
	 * @aceess public
	 */
	function totpVerify($code='') {
		$checkResult = false;
		$totp = new TOTP;
		
		$service = 'google';
		switch ($service) {
			case 'google':
				$checkResult = $totp->verifyCode(TOTP_SECRET, $code, 2);
				break;
			case 'authy':
				
				break;
		}
		
		
		if ($checkResult) {
			return $this->get_session();
		}
	}
	
	//!-- Two Factor Authentication --//
	// to build
	
	/**
	 * Sign Out
	 * 
	 * @return bool
	 *
	 * @url GET signout
	 * @aceess public
	 */
	function signout() {
		$this->session->logout();
		return TRUE;
	}

	/**
	 * 
	 * confirm email address from hash provided in email
	 * send to user from `signup`, `resend_confirm_email`
	 *
	 * @param string $hash email hash
	 * @return array
	 * 
	 * @url GET confirm_email/{hash}
	 * @aceess public
	 */
	function confirm_email($hash=NULL) {
		$return = array();

		$result = $this->db->select('user_confirm', array('hash' => $hash));
		if ($result) {
			$request = $this->db->fetch_assoc($result);

			$this->db->update('users',
				array('timestamp_confirm' => $_SERVER['REQUEST_TIME']),
				array('user_ID' => $request['user_ID'])
			);

			$this->db->delete('user_confirm', array('hash' => $hash));
		} else {
			$return["alerts"][] = array("class" => "error", "label" => "Error:", "message"=>"Confirmation code invalid.");
			$return["errors"]["confirm_code"] = "Confirmation code invalid.";
		}
		return $return;
	}
	
	
	
	/**
	 * change onboard bit in DB to complete
	 *
	 * @return bool
	 * 
	 * @url GET onboard_done
	 * @aceess public
	 */
	function get_onboard_done() {
		// Check permissions
		/*if(!$this->permission->check()) {
			return $this->permission->errorMessage();
		};*/
		
		$this->db->update(
			'users',
			array(
				'timestamp_create'  => $_SERVER['REQUEST_TIME'],
				'timestamp_update'  => $_SERVER['REQUEST_TIME'],
			),
			array('user_ID' => USER_ID)
		);
		$this->session->update();
		
		return TRUE;
	}
	
	

	//!-- Forgot password process --//
	/**
	 * Reset Step 1 - Send email to start process
	 *
	 * @param string $email Email to reset password
	 * @return array
	 * 
	 * @url GET reset_send
	 * @aceess public
	 */
	function reset_send($email=NULL) {
		$return = array();

		$this->filter->set_request_data('email', $email);
		if(!$this->filter->run('email')) {
			$return["alerts"] = $this->filter->get_errors();
			return $return;
		}
		$email = $this->filter->get_request_data('email');

		$result = $this->db->select('users', array('user_email' => $email));
		if ($result) { // user exists
			$user = $this->db->fetch_assoc($result);
			$expire_timestamp = $_SERVER['REQUEST_TIME']+PASSWORD_RESET_LENGTH;
			
			$hash = substr(hash("sha512", $email.$_SERVER['REQUEST_TIME']), 0, 16);
			
			$this->notify->send($user['user_ID'], 'password_reset_request', array("hash" => $hash), "email");
			
			$insert = array('user_ID' => $user['user_ID'], 'hash' => $hash, 'expire_timestamp' => $expire_timestamp);
			//$this->redis->hmset($hash, array('hash' => $hash, 'user_ID' => $user['user_ID'], 'expire_timestamp' => $expire_timestamp));
			$this->db->insert_update('user_reset', $insert, $insert);
		} else {  // not a user
			$this->notify->sendEmail($email, 'password_reset_request_fail', array());
		}

		//$return["alerts"][] = array("class" => "info", "message"=>"We have sent an email to $email with further instructions.");
		return $return;
	}

	/**
	 * Reset Step 2 - Confirm request still valid
	 *
	 * @param string $hash Hash from email sent
	 * @return array
	 * 
	 * @url GET reset_check
	 * @aceess public
	 */
	function reset_check($hash=NULL) {
		$return = array();
		
		$return = $this->reset_check_hash($hash);
		if (isset($return["alerts"])) return $return;
		
		// ** add check if addition security is enabled
		// $return['security']
		// else return true
		return $return;
	}
	
	
	private function reset_check_hash($hash=NULL) {
		$return = array();

		$result = $this->db->select('user_reset', array('hash' => $hash));
		//$result = $this->redis->hgetall($hash);
		if ($result) {
			$request = $this->db->fetch_assoc($result);

			// request still valid
			if ($_SERVER['REQUEST_TIME'] < $request['expire_timestamp']) {
				return true;
			} else {
				$return["alerts"][] = array("class" => "error","message"=>"This password reset request has expired.");
			}
		} else {
			$return["alerts"][] = array("class" => "error","message"=>"This password reset request is not valid.");
		}
		return $return;
	}

	/**
	 * Reset Step 3 - Confirm identity (2-step verification)
	 *
	 * @param array $request_data PUT data
	 * @return array
	 * 
	 * @url PUT reset_verify
	 * @aceess public
	 */
	function put_reset_verify($request_data=NULL) {
		$return = array();
		
		//$reset_check = $this->reset_check($request_data['hash']);
		//if (is_array($reset_check)) return $reset_check;
		return $return;
	}

	/**
	 * Reset Step 4 - Update password | Change password
	 *
	 * @param array $request_data PUT data
	 * @return array
	 * 
	 * @url PUT reset_password
	 * @aceess public
	 */
	function put_reset_password($request_data=NULL) {
		$return = array();
		
		$this->filter->set_request_data($request_data);
		if(!$this->filter->run()) {
			$return["errors"] = $this->filter->get_errors();
			return $return;
		}
		$request_data = $this->filter->get_request_data();
		
		// reconfirm hash is still valid
		$alerts = $this->reset_check_hash($request_data['hash']);
		if (isset($alerts["alerts"])) { return $alerts; }
		
		// check hash
		$query = "SELECT * FROM user_reset WHERE hash = '{{hash}}' LIMIT 0,1";
		$result = $this->db->query($query, array('hash' => $request_data['hash']));
		if (!$result) {
			return false; // user / pass combo not found
		}
		$result = $this->db->fetch_assoc($result);
		$user_ID = $result['user_ID'];
		$expire_timestamp = $result['expire_timestamp'];
		
		// validate password
		if ($this->password->validate($request_data['new_password'])) {
			$return["errors"]["new_password"] = $this->password->get_errors();
			return $return;
		}
		
		// get user email
		$result = $this->db->select('users', array('user_ID' => $user_ID));
		if (!$result) return false; // will never fire
		$result = $this->db->fetch_assoc($result);
		$user_email = $result['user_email'];
	
		// new Password w/ $user_ID, $user_email - because not signed in
		$this->password = new Password($user_ID, $user_email); 
		
		// update user password
		$this->password->update($request_data['new_password'], $user_email);
		
		// remove reset request AND any expired reset requests
		$this->db->query("DELETE FROM user_reset WHERE hash = '{{hash}}' OR expire_timestamp < ".$_SERVER['REQUEST_TIME'], array('hash' => $request_data['hash']));
		
		// mail user
		$this->notify->send($user_ID, 'password_changed_notification', array(), "email");
		
		// update email confirm timestamp if not already done so - happens when extra users are added to a company
		if (!$expire_timestamp) {
			$this->db->update('users', array('timestamp_confirm' => $_SERVER['REQUEST_TIME']), array('user_ID' => USER_ID));
		}
		
		return $return;
	}
	//-- End Forgot password process --//
	
	/**
	 * Change password
	 *
	 * @param array $request_data PUT data
	 * @return array
	 * 
	 * @url PUT password_change
	 * @aceess public
	 */
	function put_password_change($request_data=NULL) {
		$return = array();
		
		// Check permissions
		/*if(!$this->permission->check($request_data)) {
			return $this->permission->errorMessage();
		};*/
		
		$user_ID = USER_ID;
		
		$this->filter->set_request_data($request_data);
		if(!$this->filter->run()) {
			$return["errors"] = $this->filter->get_errors();
			return $return;
		}
		$request_data = $this->filter->get_request_data();
		
		// validate password
		if ($this->password->validate($request_data['new_password'])) {
			$return["errors"]["new_password"] = $this->password->get_errors();
		}

		$query = "SELECT password FROM users WHERE user_ID = '{{user_ID}}' LIMIT 0,1";
		$result = $this->db->query($query, array('user_ID' => $user_ID));
		if (!$result) return false; // will not fire

		$r = $this->db->fetch_assoc($result);

		if (!$this->password->check($request_data['old_password'], $r['password'], USER_EMAIL)) {
			$return["errors"]["old_password"] = "Your current password does not match.";
		}
		
		if (count($return)) {	// return errors
			return $return;
		}
		
		if ($user_ID) {
			$this->password->update($request_data['new_password'], USER_EMAIL);

			// mail user confirming a password change
			$this->notify->send($user_ID, 'password_changed_notification', array(), "email");

		}

		return $return;
	}
	
	/**
	 * Change email
	 *
	 * @param array $request_data PUT data
	 * @return array
	 * 
	 * @url PUT email_change
	 * @aceess public
	 */
	function put_email_change($request_data=NULL) {
		$return = array();
		
		// Check permissions
		/*if(!$this->permission->check($request_data)) {
			return $this->permission->errorMessage();
		};*/
		
		$email = $request_data["user_email"];

		// unique email?
		$result = $this->db->select('users', array('user_email' => $email));
		if ($result) {
			$return["errors"]["user_email"] = "Not unique";
		}

		$check = $this->session->login(USER_EMAIL, $request_data['password'], $this->session->cookie['remember']);
		if (!$check) {	// valid password
			$return["errors"]["password"] = "Password Invalid";
		}

		if (count($return)) {	// return errors
			return $return;
		}
		
		// update email
		$this->db->update('users', array('user_email' => $email), array('user_ID' => USER_ID));
		
		// updte password
		$this->password->update($request_data['password'], $email);
		
		// update session
		$this->session->update();	// update user_email into session
		
		// confirm email
		$hash = substr(hash("sha512", $email.$_SERVER['REQUEST_TIME']), 0, 16);
		
		$insert = array('user_ID' => USER_ID, 'hash' => $hash);
		$this->db->insert_update('user_confirm', $insert, $insert);

		$this->notify->send(USER_ID, 'email_changed_notification', array("hash" => $hash), "email");

		return $return;
	}
	
	/**
	 * Delete own account
	 *
	 * @return bool
	 *
	 * @url DELETE
	 * @url GET delete
	 * @access protected
	 */
	function delete() {
		
		$this->db->delete('users',
			array('user_ID' => USER_ID)
		);
		
		//** add in hooks to delete entire footprint
		
		return TRUE;
	}

}

?>
