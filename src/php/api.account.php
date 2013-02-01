<?php

require_once 'class.mail.php';

class Account {
	private $table = 'users';

	function __construct() {
		global $database, $session, $filter;
		$this->db = $database;
		$this->filter = $filter;
		$this->session = $session;
		$this->password = new Password;
		
		// Dev
		$this->log = FirePHP::getInstance(true);
		$this->timer = new Timers;
	}

	function __destruct() {
		
	}
	
	private function __log($var_dump) {
		$this->log->fb($var_dump, FirePHP::INFO);
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
		if (!$result) return $return; // user / pass combo not found
		$r = $this->db->fetch_assoc($result);

		$return = array();
		$return["user_ID"]     = $r['user_ID'];
		$return["user_level"]  = $r['user_level'];
		$return["password_timestamp"]  = $r['password_timestamp']; // for password reset reminder
		$return["password_age"] = floor(($_SERVER["REQUEST_TIME"] - $r['password_timestamp'])/86400);

		$return["ref"]   = base_convert($r['user_ID'],10,32);
		$return["email_confirm"] = ($r['timestamp_confirm']) ? true : false;

		$return["user"] = array(
			"user_ID" => $r['user_ID'],
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
			$return["errors"]["user_name"] = array("class" => "error","message"=>"Not unique");
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
		$referral_user_ID = (isset($request_data['referral'])) ? base_convert($request_data['ref'],32,10) : 0;

		// user //
		$password_hash = $this->password->hash($request_data["password"], $email);
		$user = array(
			"user_email"   		  => $request_data["email"],
			//"user_name"   		  => $request_data["user_name"],
			"password"     		  => $password_hash,
			"password_history"    => $password_hash,
			'password_timestamp'  => $_SERVER['REQUEST_TIME'],
			'referral_user_ID'    => $referral_user_ID,
			'timestamp_create'    => $_SERVER['REQUEST_TIME'],
			'timestamp_update'    => $_SERVER['REQUEST_TIME'],
		);
		$user_ID = $this->db->insert('users', $user);


		$hash = substr(hash("sha512", $email+$_SERVER['REQUEST_TIME']), 0, 16);
		
		$insert = array('user_ID' => $user_ID, 'hash' => $hash);
		$this->db->insert_update('user_confirm', $insert, $insert);

		$mail = new Mail;
		$mail->send($email, 'signup_confirm_email', array("hash" => urlencode($hash)));

		return $return;
	}
	
	function resend_confirm_email() {
		$hash = substr(hash("sha512", USER_EMAIL+$_SERVER['REQUEST_TIME']), 0, 16);
		
		$insert = array('user_ID' => USER_ID, 'hash' => $hash);
		$this->db->insert_update('user_confirm', $insert, $insert);

		$mail = new Mail;
		$mail->send(USER_EMAIL, 'signup_confirm_email', array("hash" => urlencode($hash)));
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
			//-- add app related session params here --//
			return $this->get_session();
		}

		$return["errors"]['signin'] = array("class" => "error", "message"=>"Sign in information invalid.");
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
			$return["errors"]["confirm_code"] = array("class" => "error", "label" => "Error", "message"=>"Confirmation code invalid.");
		}
		return $return;
	}

	//!-- Two Factor Authentication --//
	// to build

	//!-- One Time Passes --//
	// to build

	//!-- Forgot password process --//
	// Reset Step 1 - Send email to start process
	function reset_email($email=NULL) {
		$return = array();

		$this->filter->set_request_data('email', $email);
		if(!$this->filter->run('email')) {
			$return["alerts"] = $this->filter->get_errors();
			return $return;
		}
		$email = $this->filter->get_request_data('email');

		$mail = new Mail;

		$result = $this->db->select('users', array('user_email' => $email));
		if ($result) { // user exists
			$user = $this->db->fetch_assoc($result);
			$expire_timestamp = $_SERVER['REQUEST_TIME']+360;
			$hash = preg_replace("/[^\w]/", "", $this->password->hash($email)); // strip special check  to save url encoding

			$mail->send($email, 'password_reset_request', array("hash" => urlencode($hash)));
			
			$insert = array('user_ID' => $user['user_ID'], 'hash' => $hash, 'expire_timestamp' => $expire_timestamp);
			//$this->redis->hmset($hash, array('hash' => $hash, 'user_ID' => $user['user_ID'], 'expire_timestamp' => $expire_timestamp));
			$this->db->insert_update('user_reset', $insert, $insert);
		} else {  // not a user
			$mail->send($email, 'password_reset_request_fail');
		}

		//$return["alerts"][] = array("class" => "info", "message"=>"We have sent an email to $email with further instructions.");
		return $return;
	}

	// Reset Step 2 - Confirm request still valid
	function reset_check($hash=NULL) {
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

		// check hash
		$query = "SELECT user_ID FROM user_reset WHERE hash = '{{hash}}' LIMIT 0,1";
		$result = $this->db->query($query, array('hash' => $request_data['hash']));
		if (!$result) return false; // user / pass combo not found
		$result = $this->db->fetch_assoc($result);
		$user_ID = $result['user_ID'];
		
		// validate password
		//$this->password->validate($request_data['new_password']);
		
		// get user email
		$result = $this->db->select('users', array('user_ID' => $user_ID));
		if (!$result) return false; // will never fire
		$result = $this->db->fetch_assoc($result);
		$user_email = $result['user_email'];
		
		// update user
		$password_hash = $this->password->hash($request_data['new_password'], $user_email);
		$query = "UPDATE users SET"
				." password = '{{password}}',"
				." password_timestamp = '{{password_timestamp}}',"
				." password_history = CONCAT(password_history, \",{{password}}\" ),"
				." timestamp_update = '{{timestamp_update}}'"
				." WHERE user_ID = '{{user_ID}}'";
		$this->db->query($query,
			array(
				'password' => $password_hash,
				'password_timestamp' => $_SERVER['REQUEST_TIME'],
				'timestamp_update' => $_SERVER['REQUEST_TIME'],
				'user_ID' => $user_ID
			)
		);
		
		// remove reset request
		$this->db->delete('user_reset', array('hash' => $request_data['hash']));

		// mail user
		$mail = new Mail;
		$mail->send($user_email, 'password_changed_notification');

		return $return;
	}
	//-- End Forgot password process --//

	function put_password_change($request_data=NULL) {
		$return = array();
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
			return $return;
		}

		$query = "SELECT password FROM users WHERE user_ID = '{{user_ID}}' LIMIT 0,1";
		$result = $this->db->query($query, array('user_ID' => $user_ID));
		if (!$result) return false; // will not fire

		$r = $this->db->fetch_assoc($result);

		if (!$this->password->check($request_data['old_password'], $r['password'], $this->session->cookie['user_email'])) {
			$return["errors"]["old_password"] = array("class" => "error","message"=>"Your old password does not match.");
			return $return;
		}
		
		if ($user_ID) {
			$password_hash = $this->password->hash($request_data['new_password'], USER_EMAIL);
			$query = "UPDATE users SET"
					." password = '{{password}}',"
					." password_timestamp = '{{password_timestamp}}',"
					." password_history = CONCAT(password_history, \",{{password}}\" ),"
					." timestamp_update = '{{timestamp_update}}'"
					." WHERE user_ID = '{{user_ID}}'";
			$this->db->query($query,
				array(
					'password' => $password_hash,
					'password_timestamp' => $_SERVER['REQUEST_TIME'],
					'timestamp_update' => $_SERVER['REQUEST_TIME'],
					'user_ID' => $user_ID
				)
			);

			// mail user confirming a password change
			$mail = new Mail;
			$mail->send($this->session->cookie['user_email'], 'password_changed_notification');

		}

		return $return;
	}

	function put_email_change($request_data=NULL) {
		$return = array();
		$email = $request_data["user_email"];

		// unique email?
		$result = $this->db->select('users', array('user_email' => $email));
		if ($result) {
			$return["errors"]["user_email"] = array("class" => "error","message"=>"Not unique");
		}

		$check = $this->session->login($this->session->cookie['user_email'], $request_data['password'], $this->session->cookie['remember']);
		if (!$check) {	// valid password
			$return["errors"]["password"] = array("class" => "error","message"=>"Password Invalid");
		}

		if ($result || !$check) {	// return errors
			return $return;
		}

		$this->db->update('users',
			array(
				'user_email' => $email,
				'password' => $this->password->hash($request_data['password'], $request_data['email']),
				'password_timestamp' => $_SERVER['REQUEST_TIME'],
				'timestamp_confirm' => 0,
				'timestamp_update' => $_SERVER['REQUEST_TIME'],
			),
			array('user_ID' => USER_ID)
		);
		$this->session->update();	// update user_email into session

		$hash = hash("sha512", $email);
		
		$insert = array('user_ID' => USER_ID, 'hash' => $hash);
		$this->db->insert_update('user_confirm', $insert, $insert);

		$mail = new Mail;
		$mail->send($email, 'email_changed_notification', array("hash" => urlencode($hash)));

		return $return;
	}


	function delete() {
		$this->db->update('users',
			array('timestamp_delete' => $_SERVER['REQUEST_TIME']),
			array('user_ID' => USER_ID)
		);
	}

}

?>
