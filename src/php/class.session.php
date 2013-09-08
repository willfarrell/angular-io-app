<?php

/**
 * Session - maintains a users session while using the app
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
 */

$_SERVER['HTTP_USER_AGENT'] = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';

require_once 'class.password.php';	// password validation, hashing, and checking

if(!defined("SESSION_EXPIRE")) define("SESSION_EXPIRE", 2592000); // 30 days
/*
ini_set('session.use_cookies', 1);
ini_set('session.use_only_cookies', 1);
ini_set("session.name", "PHPSESSID");
ini_set("session.cookie_lifetime", 60*60*24*30); // gets overwritten when "remember" is not checked
ini_set("session.cookie_path", "/");
ini_set("session.cookie_domain", ""); // getenv("HTTP_HOST")
ini_set("session.cookie_secure", (getenv("HTTPS") == "on"));
ini_set("session.cookie_httponly", TRUE);
if (in_array('sha512', hash_algos())) {
	ini_set('session.hash_function', 'sha512');
}
ini_set('session.hash_bits_per_character', 5);
*/

class Session extends Core {
	/**
	 * All session vars related to the Session 
	 * ID stored in the cookie
	 *
	 * @var array()
	 */
	public $cookie = array();
	
	/**
	 * Session ini parameters
	 *
	 * @var array()
	 */
	private $params = array();
	
	/**
	 * Default DB table for the class
	 *
	 * @var string
	 */
	private $table = 'sessions';
	
	/**
	 * Constructs a Session object.
	 */
	function __construct(){
		parent::__construct();
		$this->cache = new Cache('session');
		$this->password = new Password;
		
		/*session_set_save_handler(
			array(&$this, 'open'),
			array(&$this, 'close'),
			array(&$this, 'read'),
			array(&$this, 'write'),
			array(&$this, 'destroy'),
			array(&$this, 'clean'));
		*/
		
		$this->create();
		
		if (isset($_COOKIE[session_name()])) { session_id($_COOKIE[session_name()]); }
		$this->params = array(
			"lifetime" => SESSION_EXPIRE, //ini_get("session.cookie_expire"),
			"path" => ini_get("session.cookie_path"),
			"domain" => ini_get("session.cookie_domain"),
			"secure" => ini_get("session.cookie_secure"),
			"httponly" => ini_get("session.cookie_httponly")
		);
		session_start();
		
		$data = $this->get();
		$this->set_cookie($data && $data["remember"]);
		
		// check to see if ips match and if session still active
		if ($data && $_SERVER['REMOTE_ADDR'] === $data['ip'] && $data["ua"] === $_SERVER['HTTP_USER_AGENT']) {
			// place data in session cookie
			if (!$data["remember"] || $data["timestamp"] + $this->params["lifetime"] > $_SERVER['REQUEST_TIME']) {
				$this->cookie = $data;
				$this->cookie["timestamp"] = $_SERVER['REQUEST_TIME'];
			} else {
				$this->del();
			}
		}
		
		$this->set();
		$this->make_defined();
	}
	
	/**
	 * Destructs a Session object.
	 *
	 * @return void
	 */
	function __destruct() {
		session_write_close();
		parent::__destruct();
	}
	
	/**
	 * Creates a blank session array
	 *
	 * @return array
	 */
	private function create() {
		$this->cookie = array();
		$this->cookie[session_name()]	= session_id();
		$this->cookie["ip"]				= $_SERVER['REMOTE_ADDR'];
		$this->cookie["ua"]				= $_SERVER['HTTP_USER_AGENT'];
		//$this->cookie["lang"]			= '';
		$this->cookie["user_ID"]		= 0;
		$this->cookie["user_email"]		= '';
		$this->cookie["user_level"]		= 0;
		$this->cookie["remember"]		= 0;
		$this->cookie["company_ID"]		= 0;
		$this->cookie["totp_secret"]	= '';
		$this->cookie["timestamp"]		= $_SERVER['REQUEST_TIME'];
		
		return $this->cookie;
	}
	
	/**
	 * Regenerate session ID
	 * Called from api.account.php
	 *
	 * @return void
	 */
	public function regen_id() {
		$this->del();
		session_set_cookie_params($this->cookie["remember"] ? $this->params["lifetime"] : 0);
		session_regenerate_id();
	}
	
	/**
	 * Save session array to DB
	 *
	 * @return void
	 */
	private function set() {
		$this->cookie[session_name()] = session_id();
		//$this->redis->hmset(session_id(), $cookie);
		if ($this->cookie['user_ID']) {
			$this->db->insert_update($this->table, $this->cookie, $this->cookie);
		}
		$this->set_cookie($this->cookie["remember"] ? ($_SERVER['REQUEST_TIME'] + $this->params["lifetime"]) : 0);
	}
	
	/**
	 * Get session array to DB
	 *
	 * @return array
	 */
	private function get() {
		//return $this->redis->hgetall(session_id());
		$r = $this->db->select($this->table, array(session_name() => session_id()));
		if ($r) { return $this->db->fetch_assoc($r); }
		return $this->create();
	}
	
	/**
	 * Delete session array to DB
	 *
	 * @return void
	 */
	private function del() {
		//$this->redis->del(session_id());
		$this->db->delete($this->table, array(session_name() => session_id()));
	}
	
	/**
	 * Converts session array params into
	 * global defined vars
	 *
	 * @return void
	 */
	private function make_defined() {
		foreach ($this->cookie as $key => $value) {
			if (!defined(strtoupper($key))) { define(strtoupper($key), $value); }
		}
	}
	
	/**
	 * Performs login - checks password & email
	 * Called from Account::post_signin
	 *
	 * @param string $email Email address
	 * @param string $password Password
	 * @param bool   $remember Toggle remembering session
	 *
	 * @return int
	 */
	public function login($email, $password, $remember = 0) {
		$query = "SELECT * FROM users WHERE user_email = '{{user_email}}' OR user_username = '{{user_email}}' LIMIT 0,1";
		$result = $this->db->query($query, array('user_email' => $email));
		if (!$result) { return false; }	// user / pass combo not found
		$r = $this->db->fetch_assoc($result);

		if (!$this->password->check($password, $r['password_hash'], $r['user_email'])) {
			return false;	// password doesn't match
		}
		
		// totp
		if ($r['security_json'] !== "") {
			$secret_json = json_decode($r['security_json'], true);
			$totp_secret = (!is_array($secret_json)) ? $secret_json['totp']['secret'] : null;
		} else {
			$totp_secret = null;
		}
		
		// cookie vars different than default
		$this->cookie["user_ID"] 	= $r['user_ID'];
		$this->cookie["user_email"] = $r['user_email'];
		$this->cookie["user_level"] = $r['user_level'];
		$this->cookie["remember"] 	= $remember;
		$this->cookie["company_ID"] = $r['company_ID'];
		$this->cookie["totp_secret"] = $totp_secret;
		$this->cookie["timestamp"] 	= $_SERVER['REQUEST_TIME'];
		
		$this->regen_id();
		$this->set();
		$this->make_defined();
		
		return $r['user_ID'];
	}
	
	/**
	 * Update session from DB
	 *
	 * @param array $arr Cookie key-value pairs
	 * @return void
	 */
	public function update($arr = array()) {
		foreach ($arr as $key => $value) {
			$this->cookie[$key] = $value;
		}
		$this->cookie["timestamp"] 	= $_SERVER['REQUEST_TIME'];
		
		$this->set();
	}
	
	/**
	 * Performs logout - removes session
	 * Called from Account::post_signout
	 *
	 * @return void
	 */
	public function logout() {
		$this->create();
		$this->del();
		$this->unset_cookie();
		//session_destroy();
	}
	
	/**
	 * Set a session cookie
	 *
	 * @param bool $remeber Toggle remembering session
	 *
	 * @return void
	 */
	private function set_cookie($remember = FALSE) {
		session_set_cookie_params(
			$remember ? $this->params["lifetime"] : 0,
			$this->params["path"],
			$this->params["domain"],
			$this->params["secure"],
			$this->params["httponly"]
		);
		$_COOKIE[session_name()] = session_id();
		setcookie(
			session_name(),
			session_id(),
			$remember ? ($_SERVER['REQUEST_TIME'] + $this->params["lifetime"]) : 0,
			$this->params["path"],
			$this->params["domain"],
			$this->params["secure"],
			$this->params["httponly"]
		);
	}
	
	/**
	 * Unset a session cookie
	 *
	 * @return void
	 */
	private function unset_cookie() {
		session_set_cookie_params(1);
		setcookie(session_name(), "", 1);
		setcookie(session_name(), false);
		unset($_COOKIE[session_name()]);
	}
};

$session = new Session;

?>