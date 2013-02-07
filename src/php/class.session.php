<?
/**
 *	Session
 */

// Overwrite if used with cloud flare
$_SERVER['REMOTE_ADDR'] = getenv("HTTP_CF_CONNECTING_IP")
	? getenv("HTTP_CF_CONNECTING_IP")
	: getenv("HTTP_X_FORWARDED_FOR")
		? getenv("HTTP_X_FORWARDED_FOR")
		: getenv("REMOTE_ADDR");

require_once "inc.config.php";
require_once "class.db.php";
require_once 'php/class.password.php';	// password validation, hashing, and checking
//require_once "class.redis.php";

class Session {
	//private session_timeout = 900;	// 15min
	private $db;

	public $cookie = array();

	public $log = array();	// backend debugging

  	// Class constructor
	function __construct(){
		global $database;  //The database connection
		$this->db = $database;
		//$this->redis = new Redis('session:');
		$this->timer = new Timers;
		$this->password = new Password;

		//$this->domain = ($_SERVER['HTTP_HOST'] != 'localhost') ? $_SERVER['HTTP_HOST'] : false;
		//ini_set('session.cookie_domain',$this->domain);
		//ini_set('session.use_only_cookies','1');

		// PHPSESSION
		if (isset($_COOKIE[session_name()])) session_id($_COOKIE[session_name()]);
		$this->log['start session id'] = session_id();
		// session_regenerate_id()

		session_start();

		$this->create();
		$data = $this->get();
		$this->log['start data'] = $data;
		// check to see if ips match and if session still active
		if ($data && $_SERVER['REMOTE_ADDR'] == $data['ip']) {
			// place data in session cookie

			if (($this->cookie["remember"] || COOKIE_EXPIRE) && $data['timestamp'] >= $_SERVER['REQUEST_TIME']) {
				$this->cookie = $data;
				$this->cookie["timestamp"] = $_SERVER['REQUEST_TIME'] + ($this->cookie["remember"] ? COOKIE_EXPIRE_REMEMBER : COOKIE_EXPIRE);
			//} else if (!COOKIE_EXPIRE) {	// ** to be added on browser close
			//	$this->cookie = $data;
			} else {
				$this->del();
			}
		}

		$this->update_id();
		$this->make_defined();
  	}

	function __destruct() {
		/*$data = json_encode($this->log);
		if ($data != "[]") {
			$file = $_SERVER['DOCUMENT_ROOT'].'/log.txt';
			file_put_contents($file, "\n".$_SERVER['REQUEST_TIME']." (".date('r', $_SERVER['REQUEST_TIME']).")\n", FILE_APPEND);
			file_put_contents($file, $data, FILE_APPEND);
		}*/
  	}

  	public function update_id($regen = false) {
		if ($regen) {	// // rand required to prevent id changing during parallel requests
			$this->del();
			session_regenerate_id();
		}

		// update timestamp or insert new session id
		$this->set();
		$this->set_cookie(
			session_name(),
			session_id(),
			($this->cookie["remember"] ? $_SERVER['REQUEST_TIME'] + COOKIE_EXPIRE_REMEMBER :
				COOKIE_EXPIRE ? $_SERVER['REQUEST_TIME'] + COOKIE_EXPIRE : COOKIE_EXPIRE)
		);
  	}
  	
  	public function update() {
		$query = "SELECT * FROM users WHERE user_ID = '{{user_ID}}' LIMIT 0,1";
		$result = $this->db->query($query, array('user_ID' => $this->cookie["user_ID"]));
		if (!$result) return false;
		$r = $this->db->fetch_assoc($result);

		// cookie vars different then default
		$this->cookie["user_ID"] 	= $r['user_ID'];
		$this->cookie["user_email"] = $r['user_email'];
		$this->cookie["user_level"] = $r['user_level'];
		//$this->cookie["remember"] 	= $remember;
		$this->cookie["company_ID"] = $r['company_ID'];
		$this->cookie["timestamp"] 	= $_SERVER['REQUEST_TIME']+($this->cookie["remember"] ? COOKIE_EXPIRE_REMEMBER : COOKIE_EXPIRE);

		$this->update_id(true);	// change ID
		$this->make_defined();
		return true;
  	}

	private function create() {
		$this->cookie = array();
		$this->cookie["PHPSESSID"] 		= session_id();
		$this->cookie["ip"] 			= $_SERVER['REMOTE_ADDR'];
		$this->cookie["ua"] 			= $_SERVER['HTTP_USER_AGENT'];
		$this->cookie["lang"] 			= '';
		$this->cookie["user_ID"] 		= 0;
		$this->cookie["user_email"] 	= '';
		$this->cookie["user_level"] 	= 0;
		$this->cookie["remember"] 		= 0;
		$this->cookie["company_ID"] 	= 0;
		$this->cookie["timestamp"] 		= $_SERVER['REQUEST_TIME'] + COOKIE_EXPIRE;
		return $this->cookie;
	}

	private function set($timestamp = 0) {
		$this->cookie["PHPSESSID"] = session_id();
		$cookie = $this->cookie;
		if ($timestamp) $cookie['timestamp'] = $timestamp;
		$this->log['save'] = session_id();
		$this->log['cookie'] = $this->cookie;
		//$this->redis->hmset(session_id(), $cookie);
		$this->db->insert_update('sessions', $cookie, $cookie);
	}

	private function get() {
		//return $this->redis->hgetall(session_id());
		$r = $this->db->select('sessions', array('PHPSESSID' => session_id()));
		if ($r) return $this->db->fetch_assoc($r);
		else return $this->create();
	}

	private function del() {
		//$this->redis->del(session_id());
		$this->db->delete('sessions', array('PHPSESSID' => session_id()));
	}

	private function make_defined() {
		foreach ($this->cookie as $key => $value) {
			if (!defined(strtoupper($key))) define(strtoupper($key), $value);
		}
	}

	// reset session_ID for security
	function login($email, $password, $remember = 0) {

		$query = "SELECT * FROM users WHERE user_email = '{{user_email}}' OR user_name = '{{user_email}}' LIMIT 0,1";
		$result = $this->db->query($query, array('user_email' => $email));
		if (!$result) return false;	// user / pass combo not found
		$r = $this->db->fetch_assoc($result);

		if (!$this->password->check($password, $r['password'], $r['user_email'])) {
			return false;	// password doesn't match
		}

		// cookie vars different then default
		$this->cookie["user_ID"] 	= $r['user_ID'];
		$this->cookie["user_email"] = $r['user_email'];
		$this->cookie["user_level"] = $r['user_level'];
		$this->cookie["remember"] 	= $remember;
		$this->cookie["company_ID"] = $r['company_ID'];
		$this->cookie["timestamp"] 	= $_SERVER['REQUEST_TIME']+($this->cookie["remember"] ? COOKIE_EXPIRE_REMEMBER : COOKIE_EXPIRE);

		$this->update_id(true);	// change ID
		$this->make_defined();
		return $r['user_ID'];
	}

	function logout() {
		$this->create();
		$this->del();
		$this->unset_cookie(session_name());
		$this->unset_cookie('on');
	}


	//-- Helper Fucntions --//
	function set_cookie($name, $value, $expire=0, $path=COOKIE_PATH, $domain=COOKIE_DOMAIN, $secure=COOKIE_SECURE, $httponly=COOKIE_HTTPONLY) {
		$_COOKIE[$name] = $value;
		setcookie($name, $value, $expire, $path, $domain, $secure, $httponly);	// $expire = 0 mean until browser closed
	}

	/*function set_cookie($name, $value, $expire=0, $path=COOKIE_PATH, $domain=COOKIE_DOMAIN, $secure=COOKIE_SECURE, $httponly=COOKIE_HTTPONLY) {
		$_COOKIE[$name] = $value;
		header('Set-Cookie: '.rawurlencode($name).'='.rawurlencode($value)
			.(empty($expire) ? '' : '; expires='.gmdate('D, d-M-Y H:i:s', $expire).' GMT')
            .(empty($domain) ? '' : '; Domain='.$domain)
            .(empty($maxage) ? '' : '; Max-Age='.$maxage)
            .(empty($path) ? '' : '; Path='.$path)
            .(!$secure ? '' : '; Secure')
            .(!$httponly ? '' : '; HttpOnly'), false);
	}*/

	function unset_cookie($name) {
		setcookie ($name, "", 1);
		setcookie ($name, false);
		unset($_COOKIE[$name]);
	}

};

$session = new Session;


?>
