<?php


require_once 'class.db.php';

class Company extends Core {
	private $table = 'companies';

	function __construct() {
		global $session;
		parent::__construct();
		
		$this->session = $session;
	}

	function __destruct() {
		parent::__destruct();
	}
	
	function search($keyword=NULL, $limit=NULL) {
		if ($limit && !is_int($limit)) return;
		if (!$limit) $limit = 10;
		$return = array();
		
		$query = "SELECT company_ID, company_name, company_url, company_phone" //
				." FROM companies C"
				." WHERE"
				." (company_name LIKE '%{{keyword}}%' OR company_details LIKE '%{{keyword}}%' OR company_url LIKE '%{{keyword}}%')"
				." LIMIT 0,{{limit}}";
		$companies = $this->db->query($query, array('keyword' => $keyword, 'limit' => $limit));
		while ($companies && $company = $this->db->fetch_assoc($companies)) {
			$return[] = $company;
		}

		return $return;
	}
	
	/**
	 *	get a list of users for a company
	 *	session company only (privacy)
	 *
	 */
	function get_user($user_ID=NULL) {
		$return = array();

		$db_where = array('company_ID' => COMPANY_ID);
		if (!is_null($user_ID)) {
			$db_where['user_ID'] = $user_ID;
		}/* else {
			$db_where['user_ID'] =$this->session->cookie["user_ID"];
		}*/

		$results = $this->db->select('users',
			$db_where,
			array("user_ID", "user_level", "user_name", "user_name_first", "user_name_last", "user_email", "user_phone", "user_details", "timestamp_create")
		);
		if ($results) {
			while($user = $this->db->fetch_assoc($results, array("user_phone"))) {
				$user['user_ID'] = $user['user_ID'];
				$return[$user['user_ID']] = $user;
			}
			if (!is_null($user_ID)) {
				$return = $return[0];
			}
		}

		return $return;
	}

	// new user
	function post_user($request_data=NULL) {
		$return = array();
		$params = array(
			"user_ID",
			"user_name",
			"user_email",
			"user_level",
			//"user_cell",
			"user_phone",
			//"user_fax",
			"user_function",
		);

		foreach ($params as $key) {
			$request_data[$key] = isset($request_data[$key]) ? $request_data[$key] : NULL;
		}

		$this->filter->set_request_data($request_data);
		$this->filter->set_group_rules('users');
		if(!$this->filter->run()) {
			$return["errors"] = $this->filter->get_errors();
			return $return;
		}
		$request_data = $this->filter->get_request_data();
		
		// confirm same company
		
		$user = array(
			'company_ID' => COMPANY_ID,
			//'user_name' => $request_data['user_name'],
			'user_name_first' => $request_data['user_name_first'],
			'user_name_last' => $request_data['user_name_last'],
			'user_email' => $request_data['user_email'],
			'user_level' => $request_data['user_level'],
			'user_phone' => $request_data['user_phone'],
			//'timestamp_create' => $_SERVER['REQUEST_TIME'],
			//'timestamp_update' => $_SERVER['REQUEST_TIME'],
		);

		//print_r($user);
		$user_ID = $this->db->insert('users', $user);
		
		// add user reset
		$expire_timestamp = $_SERVER['REQUEST_TIME']+360*24*60; // 60 day life
		$hash = substr(hash("sha512", $request_data['user_email']+$_SERVER['REQUEST_TIME']), 0, 16);
		
		$mail = new Mail;
		$mail->send($request_data['user_email'], 'password_reset_request_new', array("hash" => $hash));
		
		$insert = array('user_ID' => $user_ID, 'hash' => $hash, 'expire_timestamp' => $expire_timestamp);
		$this->db->insert_update('user_reset', $insert, $insert);
		
		return $user_ID;
	}
	
	function put_user($request_data=NULL) {
		$return = array();
		$params = array(
			"user_ID",
			"user_name_first",
			"user_name_last",
			//"user_email",
			"user_level",
			//"user_cell",
			"user_phone",
			//"user_fax",
			"user_function",
		);

		foreach ($params as $key) {
			$request_data[$key] = isset($request_data[$key]) ? $request_data[$key] : NULL;
		}

		$this->filter->set_request_data($request_data);
		$this->filter->set_group_rules('users');
		if(!$this->filter->run()) {
			$return["errors"] = $this->filter->get_errors();
			return $return;
		}
		$request_data = $this->filter->get_request_data();
		
		// confirm same company
		// ****
		
		// update
		$user = array(
			'user_ID' => $request_data['user_ID'],
			'company_ID' => COMPANY_ID,
			//'user_name' => $request_data['user_name'],
			'user_name_first' => $request_data['user_name_first'],
			'user_name_last' => $request_data['user_name_last'],
			//'user_email' => $request_data['user_email'],
			'user_level' => $request_data['user_level'],
			'user_phone' => $request_data['user_phone'],
			//'timestamp_create' => $_SERVER['REQUEST_TIME'],
			'timestamp_update' => $_SERVER['REQUEST_TIME'],
		);

		
		$this->db->insert_update('users', $user);
		
	}

	/*
	 *	get a company details
	 *
	 */
	function get($company_ID=NULL) {
		$return = array();
		$company_ID = is_null($company_ID) ? COMPANY_ID: $company_ID;

		$results = $this->db->select('companies',
			array('company_ID' => $company_ID),
			array('company_ID','company_name','company_url','company_phone','company_details','user_default_ID','location_default_ID')
		);
		if ($results) {
			$company = $this->db->fetch_assoc($results, array("company_phone"));
			
			$return = $company;
			
			// primary user
			$results = $this->db->select('users',
				array('company_ID' => COMPANY_ID, 'user_ID' => $company['user_default_ID']),
				array("user_ID", "user_name", "user_name_first", "user_name_last", "user_email", "user_phone", "user_details")
			);
			while ($results && $user = $this->db->fetch_assoc($results, array("user_phone"))) {
				$user['user_ID'] = $user['user_ID'];
				$return['user'] = $user;
			}
			// get users
			/*$results = $this->db->select('users',
				array('company_ID' => COMPANY_ID),
				array("user_ID", "user_name", "user_name_first", "user_name_last", "user_email", "user_details")
			);
			while ($results && $user = $this->db->fetch_assoc($results)) {
				$return['users'][$user['user_ID']] = $user;
			}*/
			
			// primary location
			$results = $this->db->select('locations',
				array('company_ID' => COMPANY_ID, 'location_ID' => $company['location_default_ID']),
				array('location_ID', 'company_ID', 'location_name', 'address_1', 'address_2', 'city', 'region_code', 'country_code', 'mail_code', 'latitude', 'longitude', 'location_phone', 'location_fax')
			);
			while ($results && $location = $this->db->fetch_assoc($results)) {
				$location['company_ID'] =  $location['company_ID'];
				$location['location_ID'] =  $location['location_ID'];
				$location['latitude'] = (double) $location['latitude'];
				$location['longitude'] = (double) $location['longitude'];
				$return['location'] = $location;
			}
			// get locations
			/*$results = $this->db->select('locations', array('company_ID' => COMPANY_ID));
			while ($results && $location = $this->db->fetch_assoc($results)) {
				$return['locations'][$location['location_ID']] = $location;
			}*/

		}
		//print_r($return);
		return $return;
	}

	/*
	create company detials for signup
	session company only (privacy)
	*/
	function post($request_data=NULL) {
		$alerts = array();
		$params = array(
			// company
			"company_name",
			"company_url",
			"company_phone",

		);

		foreach ($params as $key) {
			$request_data[$key] = isset($request_data[$key]) ? $request_data[$key] : NULL;
		}

		// validate and sanitize
		/*$this->filter->set_request_data($request_data);
		$this->filter->set_group_rules('companies,locations,users');
		$this->filter->set_key_rules(array('company_name', 'company_type', 'address_1', 'city', 'region_code', 'country_code', 'mail_code', 'user_name', 'user_email', 'password'), 'required');
		$this->filter->set_all_rules('trim|sanitize_string', true);
		if(!$this->filter->run()) {
			$return["errors"] = $this->filter->get_errors();
			return $return;
		}
		$request_data = $this->filter->get_request_data();*/

		// company //
		$company = array(
			"company_name"			=> $request_data["company_name"],
			"company_url"			=> $request_data["company_url"],
			"company_phone"			=> $request_data["company_phone"],
			"user_default_ID"		=> USER_ID,
			'timestamp_create' 		=> $_SERVER['REQUEST_TIME'],
			'timestamp_update' 		=> $_SERVER['REQUEST_TIME'],
		);
		$company_ID = $this->db->insert('companies', $company);

		// add to user
		$this->db->update('users', array('company_ID' => $company_ID), array('user_ID' => USER_ID));
		
		$this->session->update();	// add company_ID into session
		
		return $company_ID;
	}

	function put($request_data=NULL) {
		$alerts = array();
		$params = array(
			// company
			"company_name",
			"company_url",
			"company_details",
			"company_phone",
		);

		foreach ($params as $key) {
			$request_data[$key] = isset($request_data[$key]) ? $request_data[$key] : NULL;
		}

		// company //
		$company = array(
			"company_ID"			=> COMPANY_ID,
			"company_name"			=> $request_data["company_name"],
			"company_url"			=> $request_data["company_url"],
			"company_phone"			=> $request_data["company_phone"],
			"company_details"		=> $request_data["company_details"],
			//'timestamp_create' 		=> $_SERVER['REQUEST_TIME'],
			'timestamp_update' 		=> $_SERVER['REQUEST_TIME'],
		);



		$this->db->insert_update('companies', $company, $company);

		return;
	}

}

?>