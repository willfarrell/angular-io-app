<?php

/**
 * User - manage profile
 *
 * PHP version 5.4
 *
 * @category  PHP
 * @package   Angular.io
 * @author    will Farrell <iam@willfarrell.ca>
 * @copyright 2000-2013 Farrell Labs
 * @license   http://angulario.com
 * @version   0.0.1
 * @link      http://angulario.com
 *
 * @access protected
 */

require_once 'class.filter.php';

class User extends Core {
	private $table = 'users';
	
	/**
	 * Constructs a User object.
	 */
	function __construct() {
		global $session;
		parent::__construct();
		
		$this->session = $session;
	}
	
	/**
	 * Destructs a User object.
	 *
	 * @return void
	 */
	function __destruct() {
		parent::__destruct();
	}
	
	/**
	 * Search for users
	 *
	 * @param string $keyword Query string
	 * @param int $limit      Max number of results
	 * @return array
	 *
	 * @url GET search
	 * @url GET search/{keyword}
	 * @url GET search/{keyword}/{limit}
	 * @access protected
	 */
	function search($keyword = '', $limit = 10) {
		if ($limit && !is_int($limit)) return; // add into filter
		
		$request_data = $this->filter->run(array("keyword" => $keyword, "limit" => $limit));
		if ($this->filter->hasErrors()) { return $this->filter->getErrorsReturn(); }
		
		$return = array();
		
		$query = "SELECT user_ID, user_username, user_name_first, user_name_last, user_phone, user_function" //
				." FROM users U"
				." WHERE"
				." U.timestamp_onboard != 0 AND"
				." (user_username LIKE '%{{keyword}}%' OR user_name_first LIKE '%{{keyword}}%' OR user_name_last LIKE '%{{keyword}}%' OR user_email LIKE '%{{keyword}}%@' OR user_details LIKE '%{{keyword}}%' OR user_url LIKE '%{{keyword}}%')"
				." LIMIT 0,{{limit}}";
		$users = $this->db->query($query, array('keyword' => $keyword, 'limit' => $limit));
		while ($users && $user = $this->db->fetch_assoc($users)) {
			$return[] = $user;
		}

		return $return;
	}
	
	/**
	 * Notification settings for a user
	 *
	 * @return array
	 *
	 * @url GET notify
	 * @access protected
	 */
	function get_notify() {
		
		$r = $this->db->select("users", array("user_ID"=>USER_ID), array("notify_json"));
		if ($r) {
			$json = $this->db->fetch_assoc($r);
			return json_decode($json['notify_json'], true);
		}
		
		throw new RestException(400, 'Error');
	}
	
	/**
	 * Notification settings for a user
	 *
	 * @param array $request_data PUT data
	 * @return array
	 *
	 * @url PUT notify
	 * @access protected
	 */
	function put_notify($request_data=array()) {
		
		$request_data = $this->filter->run($request_data);
		if ($this->filter->hasErrors()) { return $this->filter->getErrorsReturn(); }
		
		// strip out serverside only vars
		$ignore = file_get_contents('json/config.notify.server.json');
		$ignore = json_decode($ignore, true);
		
		foreach($ignore as $key => $value) {
			unset($request_data[$key]);
		}
		
		// save
		$this->db->update("users", array("notify_json" => json_encode($request_data)), array("user_ID"=>USER_ID));
		
		return TRUE;
	}
	
	/**
	 * Security settings for a user
	 *
	 * @return array
	 *
	 * @url GET security
	 * @access protected
	 */
	function get_security() {
		
		$r = $this->db->select($this->table, array("user_ID"=>USER_ID), array("security_json"));
		if ($r) {
			$json = $this->db->fetch_assoc($r);
			return json_decode($json['security_json'], true);
		}
		return FALSE;
	}
	
	/**
	 * Create new secret.
	 * 16 characters, randomly chosen from the allowed base32 characters.
	 *
	 * @param string $service Future feature
	 * @return string
	 *
	 * @url GET totp/generate
	 * @url GET totp/generate/{service}
     * @access protected
	 */
	function totpSecret($service = NULL) {
		
		//$request_data = $this->filter->run();
		//if ($this->filter->hasErrors()) { return $this->filter->getErrorsReturn(); }
		
		$totp = new TOTP;
		
		switch ($service) {
			case 'google':
				$secret = $totp->createSecret();
				break;
			case 'authy':
				
				break;
			default:
				$secret = '';
				break;
		}
		return $secret;
	}
	
	/**
     * Check if the code is correct. This will accept codes starting
     * from $discrepancy*30sec ago to $discrepancy*30sec from now
     *
     * @param string $secret
     * @param string $code
     * @return bool
     *
     * @url PUT totp/check/{secret}/{code}
     * @access protected
     */
	function totpCheck($secret='', $code='') {
		$request_data = $this->filter->run(array("secret" => $secret, "code" => $code));
		if ($this->filter->hasErrors()) { return $this->filter->getErrorsReturn(); }
		
		$totp = new TOTP;
		$checkResult = $totp->verifyCode($secret, $code, 2);
		return $checkResult;
	}
	
	/**
	 * Test emailing a PGP encrypted email to a user
	 *
	 * @param array $request_data PUT data
	 * @return array
	 *
	 * @url PUT pgp
	 * @access protected
	 */
	function put_pgp($request_data=NULL) {
		
		$request_data = $this->filter->run($request_data);
		if ($this->filter->hasErrors()) { return $this->filter->getErrorsReturn(); }
		
		// make sure server is in array - no - add in extra checks
		
		
		$pgp = new PGP;
		$key = $pgp->getPublicKeyFromServer($request_data["keyserver"], USER_EMAIL);
		
		list($message, $subject) = $this->notify->compile("pgp_test", array());
		
		//$message = $pgp->encryptString($key['public_key'], $message);
		//$this->notify->email($email, $subject, $message);
		
		return $key;
	}
	/*function put_pgp($request_data=NULL) {
		
		//if (!$request_data['key']) $request_data['key'] = ''; ///****** filter needed here
		$this->filter->set_request_data($request_data);
		if(!$this->filter->run()) {
			$return["errors"] = $this->filter->get_errors();
			return $return;
		}
		$request_data = $this->filter->get_request_data();
		
		list($message, $subject) = $this->notify->compile("pgp_test", array());
		
		$this->notify->email->encrypt($request_data['key'], USER_EMAIL, $subject, $message);
	}*/
	
	/**
	 * Security settings for a user
	 *
	 * @param array $request_data PUT data
	 * @return array
	 *
	 * @url PUT security
	 * @access protected
	 */
	function put_security($request_data=array()) {
		
		$request_data = $this->filter->run($request_data);
		if ($this->filter->hasErrors()) { return $this->filter->getErrorsReturn(); }
		
		if (isset($request_data['totp']) && $request_data['totp']['service'] == "0") {
			unset($request_data['totp']);
		}
		
		$this->db->update($this->table, array("security_json" => json_encode($request_data)), array("user_ID"=>USER_ID));
		
		if (isset($request_data['totp'])) {
			$this->session->update(array("totp_secret" => $request_data['totp']["secret"]));
		}
		
		return TRUE;
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
	function get_unique($value) {
		$request_data = $this->filter->run(array("user_username" => $value));
		if ($this->filter->hasErrors()) { return $this->filter->getErrorsReturn(); }
		/*// validate and sanitize
		$this->filter->set_request_data(array("user_username" => $value));
		if(!$this->filter->run()) {
			$return["errors"] = $this->filter->get_errors('error');
		}*/
		
		$query = "SELECT * FROM {$this->table} WHERE user_username = '{{user_username}}' && user_ID != '{{user_ID}}' LIMIT 0,1";
		$result = $this->db->query($query, array('user_username' => strtolower($value), 'user_ID' => USER_ID));
		
		if ($result) {
			$return["errors"]["user_username"] = "Not unique";
			return $return;
		}
		return TRUE;
	}
	
	/**
	 * Get user info by username
	 *
	 * @param string $username Username of user
	 * @return array
	 *
	 * @url GET name
	 * @url GET name/{user_username}
	 * @access protected
	 */
	function getByName($user_username = NULL) {
		$return = array();
		
		$request_data = $this->filter->run(array("user_username" => $user_username));
		if ($this->filter->hasErrors()) { return $this->filter->getErrorsReturn(); }
		
		// check user_ID
		$db_where = array();
		if ($user_username) {
			$db_where['user_username'] = $user_username;
		} else {
			$db_where['user_ID'] = USER_ID;
		}
		$db_select = array("user_ID", "user_username", "user_name_first", "user_name_last", "user_email", "user_function", "user_phone", "user_url", "user_details");

		$results = $this->db->select($this->table, $db_where, $db_select);
		if ($results) {
			while($user = $this->db->fetch_assoc($results, array("user_phone"))) {
				/*if (!is_null($user_ID) && $user['user_username'] == '') {
					$user['user_username'] = $user["user_name_first"]." ".$user["user_name_last"];
				}*/
				$return = $user;
			}
			/*if (!is_null($user_ID)) {
				$return = $return[0];
			}*/
		}
		
		return $return;
	}
	
	/**
	 * Get user details by User ID
	 * 
	 * @param int $user_ID User ID
	 * @return array
	 *
	 * @url GET
	 * @url GET {user_ID}
	 * @access protected
	 */
	function getById($user_ID = 0) {
		$return = array();
		
		$request_data = $this->filter->run(array("user_ID" => $user_ID));
		if ($this->filter->hasErrors()) { return $this->filter->getErrorsReturn(); }
		
		// check user_ID
		$db_where = array();
		$db_select = array();
		if ($user_ID != 0) {
			$db_where['user_ID'] = $user_ID;
		} else {
			$db_where['user_ID'] = USER_ID;
		}
		$db_select = array("user_ID", "user_username", "user_name_first", "user_name_last", "user_email", "user_function", "user_phone", "user_url", "user_details");
		
		$results = $this->db->select($this->table, $db_where, $db_select);
		if ($results) {
			while($user = $this->db->fetch_assoc($results, array("user_phone"))) {
				/*if (!is_null($user_ID) && $user['user_username'] == '') {
					$user['user_username'] = $user["user_name_first"]." ".$user["user_name_last"];
				}*/
				$return = $user;
			}
			/*if (!is_null($user_ID)) {
				$return = $return[0];
			}*/
		}
		
		
		return $return;
	}

	/**
	 * update user details
	 * 
	 * @param array $request_data PUT data
	 * @return NULL
	 *
	 * @url PUT
	 * @access protected
	 */
	function put($request_data=NULL) {
		$return = array();
		$params = array(
			//"user_ID",
			//"company_ID",
			"user_username",
			"user_name_first",
			"user_name_last",
			//"user_email",
			"user_function",
			"user_phone",
			"user_url",
			"user_details",
		);

		foreach ($params as $key) {
			$request_data[$key] = isset($request_data[$key]) ? $request_data[$key] : NULL;
		}
		
		$request_data = $this->filter->run($request_data);
		if ($this->filter->hasErrors()) { return $this->filter->getErrorsReturn(); }
		
		//unset($request_data['user_email']);	// incase it was passed - angular passes disabled fields
		
		// username unique?
		if (isset($request_data['user_username']) && $request_data['user_username']) {
			$account = new Account;
			$user_name_errors = $this->get_unique($request_data['user_username']);
			if (is_array($user_name_errors)) { return $user_name_errors; }
		}

		//$request_data['company_ID'] = $this->session->cookie["company_ID"];

		/*$this->filter->set_request_data($request_data);
		$this->filter->set_group_rules('users');
		if(!$this->filter->run()) {
			$return["errors"] = array_merge($return, $this->filter->get_errors());
		}
		$request_data = $this->filter->get_request_data();*/
		/*if (isset($return["errors"])) {
			return $return;
		}*/
		
		$user = array(
			'user_ID' => USER_ID,
			//'user_email' => $request_data['user_email'],
			'user_username' => $request_data['user_username'],
			'user_name_first' => $request_data['user_name_first'],
			'user_name_last' => $request_data['user_name_last'],
			'user_phone' => $request_data['user_phone'],
			'user_url' => $request_data['user_url'],
			'user_function' => $request_data['user_function'],
			'user_details' => $request_data['user_details'],
			'timestamp_update' => $_SERVER['REQUEST_TIME'],
		);
		
		$this->db->insert_update($this->table, $user, $user);
		
		return TRUE;
	}
}

?>
