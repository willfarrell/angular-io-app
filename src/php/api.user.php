<?php

require_once 'class.filter.php';

class User {
	private $db;
	private $session;
	private $filter;
	private $table = 'users';

	function __construct() {
		global $database, $session, $filter;
		$this->db = $database;
		$this->session = $session;
		$this->filter = $filter;
		
		// dev
		$this->timer = new Timers;
		$this->log = FirePHP::getInstance(true);
	}

	function __destruct() {

	}
	
	private function __log($var_dump) {
		$this->log->fb($var_dump, FirePHP::INFO);
	}

	function get_onboard_done() {
		if (USER_ID) {
			$this->db->update(
				'users',
				array('user_level' => 1),
				array('user_ID' => USER_ID, 'user_level' => 0)
			);
			$this->session->update(); // update user_level
		}
	}

	function post_onboard($request_data=NULL) {
		$return = array();

		// validate and sanitize
		$this->filter->set_request_data($request_data);
		$this->filter->set_group_rules('contact');
		$this->filter->set_key_rules(array('email', 'message'), 'required');
		if(!$this->filter->run()) {
			$return["errors"] = $this->filter->get_errors('error');
			return $return;
		}
		$request_data = $this->filter->get_request_data();

		return $return;
	}
	
	/*
	*/
	function get_name($user_name=NULL) {
		$return = array();
		
		// add in user_name check
		
		
		
		// check user_ID
		$db_where = array();
		if ($user_name) {
			$db_where['user_name'] = $user_name;
		} else {
			return $return;
		}
		$db_select = array("user_ID", "user_name", "user_name_first", "user_name_last", "user_email", "user_phone", "user_details");

		$results = $this->db->select('users', $db_where, $db_select);
		if ($results) {
			while($user = $this->db->fetch_assoc($results, array("user_phone"))) {
				/*if (!is_null($user_ID) && $user['user_name'] == '') {
					$user['user_name'] = $user["user_name_first"]." ".$user["user_name_last"];
				}*/
				$return = $user;
			}
			/*if (!is_null($user_ID)) {
				$return = $return[0];
			}*/
		}
		
		
		return $return;
	}
	
	/*
	get a list of users for a company
	session company only (privacy)
	*/
	function get($user_ID=NULL) {
		$return = array();
		
		
		// check user_ID
		$db_where = array();
		$db_select = array();
		if ($user_ID != 0) {
			$db_where['user_ID'] = $user_ID;
		} else {
			$db_where['user_ID'] = USER_ID;
		}
		$db_select = array("user_ID", "user_name", "user_name_first", "user_name_last", "user_email", "user_phone", "user_details");
		
		$results = $this->db->select('users', $db_where, $db_select);
		if ($results) {
			while($user = $this->db->fetch_assoc($results, array("user_phone"))) {
				/*if (!is_null($user_ID) && $user['user_name'] == '') {
					$user['user_name'] = $user["user_name_first"]." ".$user["user_name_last"];
				}*/
				$return = $user;
			}
			/*if (!is_null($user_ID)) {
				$return = $return[0];
			}*/
		}
		
		
		return $return;
	}

	// update user
	function put($request_data=NULL) {
		$return = array();
		$params = array(
			"user_ID",
			//"company_ID",
			"user_name",
			//"user_email",
			"user_details",
			//"user_cell",
			"user_phone",
			"user_url",
			//"user_fax",
			//"user_function",

		);

		foreach ($params as $key) {
			$request_data[$key] = isset($request_data[$key]) ? $request_data[$key] : NULL;
		}
		
		unset($request_data['user_email']);	// incase it was passed - angular passes disabled fields
		
		// username unique?
		if (isset($request_data['user_name'])) {
			$account = new Account;
			$user_name_errors = $account->get_unique($request_data['user_name']);
			if (is_array($user_name_errors)) $return = $user_name_errors;
		}

		//$request_data['company_ID'] = $this->session->cookie["company_ID"];

		$this->filter->set_request_data($request_data);
		$this->filter->set_group_rules('users');
		if(!$this->filter->run()) {
			$return["errors"] = array_merge($return, $this->filter->get_errors());
			return $return;
		}
		$request_data = $this->filter->get_request_data();

		$user = array(
			'user_ID' => USER_ID,
			'user_name' => $request_data['user_name'],
			'user_name_first' => $request_data['user_name_first'],
			'user_name_last' => $request_data['user_name_last'],
			//'user_email' => $request_data['user_email'],
			'user_details' => $request_data['user_details'],
			//'user_cell' => $request_data['user_cell'],
			'user_phone' => $request_data['user_phone'],
			'user_url' => $request_data['user_url'],
			//'user_fax' => $request_data['user_fax'],
			//'user_function' => $request_data['user_function'],
			'timestamp_update' => $_SERVER['REQUEST_TIME'],
		);
		$this->__log($user);
		
		$this->db->insert_update('users', $user, $user);
		
		//$this->session->update(); // update session info
		
		return $return;
	}
}

?>
