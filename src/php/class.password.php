<?php

// Class Password

require_once 'class.db.php';
require_once 'class.session.php';
require_once 'class.filter.php';

class Password {
	private $db;
	private $filter;
	private $errors = array();
	
	private $settings = array(
		//'min_timestamp'	:0,		// all password must be new then this unix_timestamp (sec)
		//'max_age'		:0,		// max number of days a password is allowed to be used (days)
		
		'min_length'			=> 10,		// OWASP:10
		'min_charset_subsets'	=> 3,		// OWASP:3
		'min_charset_upper'		=> 1,		// OWASP:1
		'min_charset_lower'		=> 1,		// OWASP:1
		'min_charset_number'	=> 1,		// OWASP:1
		'min_charset_special'	=> 1,		// OWASP:1 // common keybaord special chars
		'min_charset_other'		=> 0,		// OWASP:0
		'max_charset_identical'	=> 3,		// OWASP:3
	);
	
	private $user_ID = 0;
	private $user_email = '';

	function __construct($user_ID = 0, $user_email = '') {
		global $database, $filter;
		$this->db = $database;
		$this->filter = $filter;
		
		$this->user_ID = $user_ID;
		$this->user_email = $user_email;
		
		// Dev
		$this->log = FirePHP::getInstance(true);
		$this->timer = new Timers;
	}

	function __destruct() {
		
	}
	
	private function __log($var_dump) {
		$this->log->fb($var_dump, FirePHP::INFO);
	}
	
	private function getId() {
		return (USER_ID) ? USER_ID : $this->user_ID;
	}
	
	private function getEmail() {
		return (USER_EMAIL) ? USER_EMAIL : $this->user_email;
	}
	
	function get_errors($class = 'error') {
  		// array_walk($words, create_function('&$str', '$str = "<p>$str</p>";'));
	  	return implode("<br>", $this->errors);
  	}
	
	function update($password, $email) {
		$password_hash = $this->hash($password, $email);
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
				'user_ID' => $this->getId()
			)
		);
	}
	
	/**
	 *	Runs validation checks a password
	 */
	function validate($password) {
		$return = true;
		
		$this->timer->start('validate');
		if ($this->length($password) && $this->charset($password)) {
			$this->dictionary($password);
			//$this->black_list($password); // passwords on the black list don't meet the OWASP requ, thus not needed to be run
			
			if ($this->getId()) {
				$this->user_past_password($password);
				$this->user_input_data($password);
			}
		}
		$this->timer->stop('validate');
		return count($this->errors) ? true : false;
	}
	
	/**
	 *	Determine a password strength
	 */
	function entropy($password) {
		// https://tech.dropbox.com/2012/04/zxcvbn-realistic-password-strength-estimation/
		
	}
	
	/**
	 *	Checks if a password is long enough
	 */
	function length($password) {
		$error = array();
		$length = strlen($password);
		
		if ($length < $this->settings['min_length']) {
			$this->errors["min_length"] = "Password too short, must be {$this->settings['min_length']} or more";
			return false;
		}
		return true;
	}
	
	/**
	 *	Checks if a password has charset diversity
	 */
	function charset($password) {
		$return = true;
		$password_chars = str_split($password);
		
		$subsets = array(
			"lower" => 0,
			"upper" => 0,
			"number" => 0,
			"special" => 0,
			"other" => 0,
		);
		
		// count each charset subset
		
		for ($i = 0, $l = count($password_chars); $i < $l; $i++) {
			$char = $password_chars[$i];
			
			if 		(strpos("abcdefghijklmnopqrstuvwxyz", $char) !== false)				{ ++$subsets['lower'];	}
			else if (strpos("ABCDEFGHIJKLMNOPQRSTUVWXYZ", $char) !== false) 			{ ++$subsets['upper'];	}
			else if (strpos("0123456789", $char) !== false) 							{ ++$subsets['number'];	}
			else if (strpos("~!@#$%^&*()_+{}|:\"<>? `-=[]\;',./£", $char) !== false) 	{ ++$subsets['special'];}
			else 																		{ ++$subsets['other'];	}
			
			// max_charset_identical check
			if ($i >= $this->settings['max_charset_identical']-1) {
				$charset_identical = true;
				for ($j = $i-1, $k = $i - $this->settings['max_charset_identical']; $j > $k; $j--) {
					if ($password_chars[$j] != $char) {
						$charset_identical = false;
					}
				}
				if ($charset_identical) {
					$this->errors["max_charset_identical"] = "Password cannot have {$this->settings['max_charset_identical']} or more identical characters";
					$return = false;
				}
			}
		}
		
		// min_charset_subsets
		$subset_count = 0;
		foreach ($subsets as $subset) {
			if ($subset) $subset_count++;
		}
		
		if ($subset_count < $this->settings['min_charset_subsets']) {
			$this->errors["min_charset_subset"] = "Password needs different types of characters";
			if ($subsets['lower'] < $this->settings['min_charset_lower']) {
				$this->errors["min_charset_lower"] = "Password needs at least one lower case letter";
				$return = false;
			}
			if ($subsets['upper'] < $this->settings['min_charset_upper']) {
				$this->errors["min_charset_upper"] = "Password needs at least one upper case letter";
				$return = false;
			}
			if ($subsets['number'] < $this->settings['min_charset_number']) {
				$this->errors["min_charset_number"] = "Password needs at least one number";
				$return = false;
			}
			if ($subsets['special'] < $this->settings['min_charset_special']) {
				$this->errors["min_charset_special"] = "Password needs an special character (!\"£$%&...)";
				$return = false;
			}
			if ($subsets['other'] < $this->settings['min_charset_other']) {
				$this->errors["min_charset_other"] = true;
				$return = false;
			}
		}
		
		return $return;
	}
	
	/**
	 *	Checks if a password overlaps with a dictionary word
	 */
	function dictionary($password) {
		$words = preg_split("/[^a-z]/", strtolower($password));
		$words = array_filter($words); // clean
		array_walk($words, create_function('&$str', '$str = "\'$str\'";')); // add quotes
		
		$query = "SELECT word FROM password_dictionary"
				." WHERE word IN (".implode(",", $words).") AND length > 2";
		$r = $this->db->query($query);
		if (!$r) return true;
		return false;
	}
	
	/**
	 *	Checks if a password is on the black list - a list of most popular passwords
	 */
	function black_list($password) {
		$r = $this->db->select("password_blacklist", array("password" => $password));
		if (!$r) return true;
		return false;
	}
	
	/**
	 *	Checks if a password has been used in the past for a user
	 */
	function user_past_password($password) {
		if (!$this->getId() || !$this->getEmail()) return false;
		
		$r = $this->db->select("users", array("user_ID" => $this->getId()), array("password_history"));
		if (!$r) return false;
		
		$user = $this->db->fetch_assoc($r);
		$history = explode(",", $user['password_history']);
		
		foreach ($history as $hash) {
			if ($this->check($password, $hash, $this->getEmail())) {
				$this->errors['user_past_password'] = "You have already used this password.  Please choose a new unique password.";
				return false;
			}
		}
		
		return true;
	}
	
	/**
	 *	Checks if a password overlaps with a user inputed data
	 */
	function user_input_data($password) {
		if (!$this->getId()) return false;
		$return = true;
		$data = array("user_email", "user_name", "user_name_first", "user_name_last", "user_phone");
		
		
		
		$r = $this->db->select("users", array("user_ID" => $this->getId()), $data);
		if (!$r) return false;
		
		$user = $this->db->fetch_assoc($r);
		foreach ($user as $key => $value) {
			if (!strlen($value)) continue;
			
			if (!$this->password_similarity($password, $value)) {
				$error["user_input_data"][$key] = true;
				$return = false;
			}
			
		}
		
		return $return;
	}
	
	/**
	 *	Checks the similarity of a string to the password
	 */
	private function password_similarity($password, $text) {
		$str_array = preg_split("/[^a-z]/", strtolower($text));
		
		// string in password
		foreach ($str_array as $str) {
			if (strlen($str) > 2 && stripos($password, $str) === false) return false;
		}
		
		/*
		similar_text() — Calculate the similarity between two strings
		levenshtein() - Calculate Levenshtein distance between two strings
		soundex() - Calculate the soundex key of a string
		metaphone() - Similar to soundex, and possibly more effective for you. It's more accurate than soundex() as it knows the basic rules of English pronunciation. The metaphone generated keys are of variable length.
		*/
		
		/*$percent = 0;
			
		// levenshtein
		$max=max(strlen($password), strlen($value));
		
		$lev = levenshtein($password, $value);
		$percent = -100*$lev/$max+100;
		
		if ($percent > 20) {
			
		}*/
		return true;
	}
	
	/**
	 *	salting a password
	 */
	private function salt($password, $email = '') {
		return $password.$email.PASSWORD_SALT;
	}
	
	/**
	 *	hashing a password
	 */
	function hash($password, $email = '') {
		$this->timer->start('hash');

		$password = $this->salt($password,$email);

		if (PASSWORD_HASH == 'PBKDF2') {
			$return = $this->pbkdf2_hash($password, PBKDF2_SALT, PBKDF2_BINARY, PBKDF2_ITERATIONS, PBKDF2_KEY_LENGTH, PBKDF2_ALGORITHM);
		} else if (PASSWORD_HASH == 'bcrypt') {
			$return = $this->bcrypt_hash($password, BCRYPT_WORK_FACTOR);
		} else if (PASSWORD_HASH == 'scrypt') {
			$return = $this->scrypt_hash($password, SCRYPT_SALT, SCRYPT_PEPPER, SCRYPT_CPU, SCRYPT_MEMORY, SCRYPT_PARALLEL, SCRYPT_KEY_LENGTH);
	    }

	    $this->timer->stop('hash');
	    return $return;
	}
	
	/**
	 *	checking a password against a hash
	 */
	function check($password, $hash, $email = '') {
		$this->timer->start('hash_check');

		$password = $this->salt($password,$email);

		if (PASSWORD_HASH == 'PBKDF2') {
			$return = $this->pbkdf2_check($password, $hash, PBKDF2_SALT, PBKDF2_BINARY, PBKDF2_ITERATIONS, PBKDF2_KEY_LENGTH, PBKDF2_ALGORITHM);
		} else if (PASSWORD_HASH == 'bcrypt') {
		    $return = $this->bcrypt_check($password, $hash);
		} else if (PASSWORD_HASH == 'scrypt') {
			$return = $this->scrypt_check($password, $hash, SCRYPT_PEPPER, SCRYPT_KEY_LENGTH);
		}

		$this->timer->stop('hash_check');
	    return $return;
	}

	/**
	 * generate pbkdf2 hash
	 * @src https://github.com/P54l0m5h1k/PBKDF2-implementation-PHP/blob/master/crypt.php
	 * @static
	 * @param string $password   - defined password
	 * @param string $salt       - defined salt
	 * @param bool   $binary     - generate binary data, or base64 encoded string
	 * @param int    $iterations - how many iterations to perform
	 * @param int    $keylength  - key length
	 * @param string $algorithm  - hashing algorithm
	 * @return bool|string
	 */
	private static function pbkdf2_hash($password, $salt, $binary = true, $iterations = 10000, $keylength = 32, $algorithm = 'sha256') {
		if (!in_array($algorithm, hash_algos()))
			return false;
		$derivedkey = '';
		for ($block = 1; $block <= ceil($keylength / strlen(hash($algorithm, null, true))); $block++):
			$ib = $b = hash_hmac($algorithm, $salt.pack('N', $block), $password, true);
			for ($i = 1; $i < $iterations; $i++)
				$ib ^= ($b = hash_hmac($algorithm, $b, $password, true));
			$derivedkey .= $ib;
		endfor;
		return $binary ? substr($derivedkey, 0, $keylength) : base64_encode(substr($derivedkey, 0, $keylength));
	}

	private static function pbkdf2_check($password, $hash, $salt, $binary = true, $iterations = 10000, $keylength = 32, $algorithm = 'sha256') {
		$return = $this->pbkdf2_hash($password, $salt, $binary, $iterations, $keylength, $algorithm) == $hash;
	}

	private static function bcrypt_hash($password, $work_factor = 8) {
	    if (version_compare(PHP_VERSION, '5.3') < 0) throw new Exception('Bcrypt requires PHP 5.3 or above');

	    if (! function_exists('openssl_random_pseudo_bytes')) {
	        throw new Exception('Bcrypt requires openssl PHP extension');
	    }

	    if ($work_factor < 4 || $work_factor > 31) $work_factor = 8;
	    $salt =
	        '$2a$' . str_pad($work_factor, 2, '0', STR_PAD_LEFT) . '$' .
	        substr(
	            strtr(base64_encode(openssl_random_pseudo_bytes(16)), '+', '.'),
	            0, 22
	        );
	    return crypt($password, $salt);
	}

	private static function bcrypt_check($password, $hash) {
	    if (version_compare(PHP_VERSION, '5.3') < 0) throw new Exception('Bcrypt requires PHP 5.3 or above');

	    return crypt($password, $hash) == $hash;
	}

	/**
     * Create a password hash
     *
     * @src https://github.com/DomBlack/php-scrypt/blob/master/scrypt.php
     * @param string $password The clear text password
     * @param string $salt     The salt to use, or null to generate a random one
     * @param int    $N        The CPU difficultly (must be a power of 2,  > 1)
     * @param int    $r        The memory difficultly
     * @param int    $p        The parallel difficultly
     *
     * @return string The hashed password
     */
    private static function scrypt_hash($password, $salt = false, $pepper = '', $N = 16384, $r = 8, $p = 1, $key_length = 32, $salt_length = 8) {
        if ($salt === false) {
            $salt = '';
		        $possibleChars = '0123456789abcdefghijklmnopqrstuvwxyz';
		        $noOfChars = strlen($possibleChars) - 1;

		        for ($i = 0; $i < $salt_length; $i++) {
		            $salt .= $possibleChars[mt_rand(0, $noOfChars)];
		        }
        } else {
            //Remove dollar signs from the salt, as we use that as a separator.
            $salt = str_replace('$', '', $salt);
        }

        $hash = scrypt($password, $pepper.$salt, $N, $r, $p, $key_length);

        return $N.'$'.$r.'$'.$p.'$'.$salt.'$'.$hash;
    }

    /**
     * Check a clear text password against a hash
     *
     * @src https://github.com/DomBlack/php-scrypt/blob/master/scrypt.php
     * @param string $password The clear text password
     * @param string $hash     The hashed password
     *
     * @return boolean If the clear text matches
     */
    private static function scrypt_check($password, $hash, $pepper = '', $key_length = 32) {
        list($N, $r, $p, $salt, $hash) = explode('$', $hash);

        return scrypt(
            $password, $pepper.$salt,
            $N, $r, $p,
            self::$key_length
        ) == $hash;
    }

	/**
	 * encryption
	 * @src https://github.com/P54l0m5h1k/PBKDF2-implementation-PHP/blob/master/crypt.php
	 * @param mixed  $msg    - message/data
	 * @param string $k      - encryption key
	 * @param bool   $binary - base64 encode result
	 * @return bool|string   - iv+ciphertext+mac
	 */
	private static function encrypt($msg, $k, $binary = true)
	{
		if (!$td = mcrypt_module_open('rijndael-256', '', 'ctr', ''))
			return false;
		if (mcrypt_generic_init($td, $k, $iv = mcrypt_create_iv(32, MCRYPT_RAND)) !== 0)
			return false;
		$msg .= self::pbkdf2($msg = $iv.mcrypt_generic($td, serialize($msg)), $k, 1000, 32);
		mcrypt_generic_deinit($td);
		mcrypt_module_close($td);
		return $binary ? $msg : base64_encode($msg);
	}

	/**
	 * decryption
	 * @src https://github.com/P54l0m5h1k/PBKDF2-implementation-PHP/blob/master/crypt.php
	 * @param string $msg    - output from encrypt()
	 * @param string $k      - encryption key
	 * @param bool   $binary - base64 decode msg
	 * @return bool|string   - original data
	 */
	public static function decrypt($msg, $k, $binary = true)
	{
		if (!$binary)
			$msg = base64_decode($msg);
		if (!$td = mcrypt_module_open('rijndael-256', '', 'ctr', ''))
			return false;
		$iv = substr($msg, 0, 32);
		$mo = strlen($msg) - 32;
		$em = substr($msg, $mo);
		$msg = substr($msg, 32, strlen($msg) - 64);
		$mac = self::pbkdf2($iv.$msg, $k, 1000, 32);
		if ($em !== $mac)
			return false;
		if (mcrypt_generic_init($td, $k, $iv) !== 0)
			return false;
		$msg = unserialize(mdecrypt_generic($td, $msg));
		mcrypt_generic_deinit($td);
		mcrypt_module_close($td);
		return $msg;
	}

}
	
?>