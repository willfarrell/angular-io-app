<?php

class Account extends Core {
	private $table = 'users';

	function __construct() {
		global $session;
		parent::__construct();
		
		$this->session = $session;
		$this->password = new Password;
	}

	function __destruct() {
		
		parent::__destruct();
	}
	
	// check if still signned in
	function get_signcheck() {
		return USER_ID ? 1 : 0;
	}

	// change session ID
	function get_regen() {
		$this->session->update_id(true);
	}
	
	// don't upgrade with global vars, use $this->session->cookie
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
			"user_name" => $r['user_name'],
			"user_name_first" => $r['user_name_first'],
			"user_name_last" => $r['user_name_last'],
		);
		
		$return["company_ID"] = $r['company_ID'];
		// company
		if ($return["company_ID"]) {
			$query = "SELECT * FROM companies WHERE company_ID = '{{company_ID}}' LIMIT 0,1";
			$result = $this->db->query($query, array('company_ID' => $return["company_ID"]));
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
     * 
     * Check if a user_name is unique
     *
     * @param string $value query string
     *
     * @return true
     * @aceess puiblic
     */
	function get_unique($value=NULL) {	// $type=NULL,
		// for user_name only

		$query = "SELECT * FROM users WHERE user_name = '{{user_name}}' && user_ID != '{{user_ID}}' LIMIT 0,1";
		$result = $this->db->query($query, array('user_name' => strtolower($value), 'user_ID' => USER_ID));
		if ($result) {
			$return["errors"]["user_name"] = "Not unique";
			return $return;
		}
	}
	
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
			//"user_name"   		  => $request_data["user_name"],
			"password"     		  => $password_hash,
			"password_history"    => $password_hash,
			'password_timestamp'  => $_SERVER['REQUEST_TIME'],
			'referral_user_ID'    => $referral_user_ID,
			//'timestamp_create'    => $_SERVER['REQUEST_TIME'],
			//'timestamp_update'    => $_SERVER['REQUEST_TIME'],
		);
		$user_ID = $this->db->insert('users', $user);


		$hash = substr(hash("sha512", $email.$_SERVER['REQUEST_TIME']), 0, 16);
		
		$insert = array('user_ID' => $user_ID, 'hash' => $hash);
		$this->db->insert_update('user_confirm', $insert, $insert);

		$this->notify->send($user_ID, 'signup_confirm_email', array("hash" => $hash), "email");
		
		return $return;
	}
	
	function resend_confirm_email() {
		$hash = substr(hash("sha512", USER_EMAIL.$_SERVER['REQUEST_TIME']), 0, 16);
		
		$insert = array('user_ID' => USER_ID, 'hash' => $hash);
		$this->db->insert_update('user_confirm', $insert, $insert);

		$this->notify->send(USER_ID, 'signup_confirm_email', array("hash" => $hash), "email");
	}

	//
	function post_signin($request_data=NULL) {
		$return = array();

		// validate and sanitize
		$this->filter->set_request_data($request_data);
		if(!$this->filter->run('signin')) {
			$return["errors"] = $this->filter->get_errors('error');
			return $return;
		}
		$request_data = $this->filter->get_request_data();
		
		//if ($request_data['remember'] == 'true') $remember = true;
		//else  $remember = false;
		//$this->redis->hset()

		$login = $this->session->login($request_data['email'], $request_data['password'], isset($request_data['remember'])); // , $request_data['ua']
		if ($login) {
			if ($this->session->cookie['totp_secret']) {
				return array("totp" => true, "user_ID" => $this->session->cookie['user_ID']);
			} else {
				return $this->get_session();
			}
		}

		$return["errors"]['signin'] = "Sign in information invalid.";
		return $return;
	}

	// /profile/hello/$id
	function signout() {
		$this->session->logout();
	}

	//-- Confirm email address --//
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
			$return["alerts"][] = array("class" => "error", "label" => "Error", "message"=>"Confirmation code invalid.");
			$return["errors"]["confirm_code"] = "Confirmation code invalid.";
		}
		return $return;
	}
	
	// check token based on service
	function put_totp($code='') {
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
	
	function get_onboard_done() {
		// Check permissions
		if(!$this->permission->check()) {
			return $this->permission->errorMessage();
		};
		
		$this->db->update(
			'users',
			array(
				'timestamp_create'  => $_SERVER['REQUEST_TIME'],
				'timestamp_update'  => $_SERVER['REQUEST_TIME'],
			),
			array('user_ID' => USER_ID)
		);
		$this->session->update();
	}
	
	//!-- Two Factor Authentication --//
	// to build

	//!-- One Time Passes --//
	// to build

	//!-- Forgot password process --//
	// Reset Step 1 - Send email to start process
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
			$expire_timestamp = $_SERVER['REQUEST_TIME']+360;
			
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

	// Reset Step 2 - Confirm request still valid
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

	// Reset Step 3 - Confirm identity (2-step verification)
	function put_reset_verify($request_data=NULL) {
		$return = array();
		
		//$reset_check = $this->reset_check($request_data['hash']);
		//if (is_array($reset_check)) return $reset_check;

	}


	// Reset Step 4 - Update password | Change password
	function put_reset_password($request_data=NULL) {
		$return = array();
		
		$this->filter->set_request_data($request_data);
		$this->filter->set_group_rules('password');
		$this->filter->set_key_rules(array('hash', 'new_password'), 'required');
		if(!$this->filter->run()) {
			$return["errors"] = $this->filter->get_errors();
			return $return;
		}
		$request_data = $this->filter->get_request_data();
		
		// reconfirm hash is still valid
		$return = $this->reset_check_hash($request_data['hash']);
		if (isset($return["alerts"])) return $return;
		
		// check hash
		$query = "SELECT * FROM user_reset WHERE hash = '{{hash}}' LIMIT 0,1";
		$result = $this->db->query($query, array('hash' => $request_data['hash']));
		if (!$result) return false; // user / pass combo not found
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

	function put_password_change($request_data=NULL) {
		$return = array();
		
		// Check permissions
		if(!$this->permission->check($request_data)) {
			return $this->permission->errorMessage();
		};
		
		$user_ID = USER_ID;
		
		$this->filter->set_request_data($request_data);
		$this->filter->set_group_rules('password');
		$this->filter->set_key_rules(array('old_password', 'new_password'), 'required');
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

	function put_email_change($request_data=NULL) {
		$return = array();
		
		// Check permissions
		if(!$this->permission->check($request_data)) {
			return $this->permission->errorMessage();
		};
		
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


	function delete() {
		// Check permissions
		if(!$this->permission->check()) {
			return $this->permission->errorMessage();
		};
		
		$this->db->update('users',
			array('timestamp_delete' => $_SERVER['REQUEST_TIME']),
			array('user_ID' => USER_ID)
		);
	}

}

?>
