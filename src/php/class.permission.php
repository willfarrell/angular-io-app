<?php

/**
 * Permissions Manager
 *
 * PHP Version 5.4
 *
 * @category  N/A
 * @package   N/A
 * @author	will Farrell <will.farrell@gmail.com>
 * @copyright 2000 - 2013 willFarrell.ca
 * @license   http://www.opensource.org/licenses/mit-license.html  MIT License
 * @version   GIT: <git_id>
 * @link	  http://willFarrell.ca
 */

/**

Additional Notes:

Use Case:
Place before filter
if(!$this->permission->check($request_data)) {
	return $this->permission->errorMessage();
};

*/


/*

# Permission Tests
A `!` can be place infrom of a rule to inverse it. ie !required

Test		Details
user_ID		
user_level	
company_ID	

*/

require_once 'class.db.php';
include_once "inc.permission.php";

/**
 * Permission
 * AboutClass
 *
 * @category  N/A
 * @package   N/A
 * @author	Original Author <author@example.com>
 * @author	Another Author <another@example.com>
 * @copyright 2000 - 2011 willFarrell.ca
 * @license   http://www.opensource.org/licenses/mit-license.html  MIT License
 * @version   Release: <package_version>
 * @link	  http://willFarrell.ca
 */

class Permission
{
	private $tests = array();
	private $signout = false;	// signout flag set by test that that check session
	//private $access = false;	// access flag set by test that that check a users access
	private $_inputs = array();
	/**
	 * Constructor
	 */
	function __construct($args = array()) {
		global $database, $permission_tests;
		$this->db = $database;
		
		$this->_inputs = $args;
		
		if (!$permission_tests) $this->tests = array();
		else $this->tests = $permission_tests;
	}

	/**
	 * Destructor
	 */
	function __destruct() {
		
	}
	
	
	
	// DELETE replced with 400 Error code via Auth
	function getSignout() {
		return $this->signout;
	}
	function getErrors() {
		
		if ($this->signout) {
			$return["session"] = "signout";
			//throw new RestException(400, 'Session Expired');
		} else {
			$return = array(
				"alerts" => array(
					array(
						"class" => "error",
						"message" => "You don't have permission to make that request."
					)
				)
			);
		}
		
		return $return;
	}
	
	/**
	 * 
	 * check - from in called function
	 *
	 * @param array $args array of params to be used in tests
	 *
	 * @return true
	 * @aceess puiblic
	 */
	function check($args, $className = '', $methodName = '') {
		$allowed = TRUE;
		
		if (!$className || !$methodName) {
			// trace source
			$trace = debug_backtrace();
			if (!isset($trace[1])) return FALSE;	// trace failed
			
			$source = "{$trace[1]['class']}::{$trace[1]['function']}";
		} else {
			$source = "{$className}::{$methodName}";
		}
		
		if ($args == NULL) {
			$args = array();
			if (isset($trace)) $args = $trace[1]['args'];
			// $args = func_get_args();
		}
		
		// add class_function to config file
		$this->add_function_array($source);
		
		$tests = explode("|", $this->tests[$source]);
		if ($tests[0]) {
			foreach($tests as $test_str) {
				preg_match("/(!?)([\w-]*)\[?([^\[\]]*)\]?/", $test_str, $matches);
				
				$test = $matches[2];
				$params = explode(",", $matches[2]);
				
				if (method_exists($this, $test)) {
					$test_return = $this->{$test}($args, $params);
					if ($matches[1] == '!') {
						$test_return != $test_return;
					}
					$allowed = ($allowed && $test_return);
				}
			}
		}
		
		return $allowed;
	}
	
	// mailtain inc.permission.php
	private function add_function_array($name = "") {
		$regenerate = false;
		if ($name) {
			if (!isset($this->tests[$name])) {
				$this->tests[$name] = "";
				$regenerate = true;
			}
		}
		
		if ($regenerate) $this->build_function_array();
	}
	
	private function build_function_array($file = 'php/inc.permission.php') {
		
		ob_start();
		ksort($this->tests); // reorder list
		var_export($this->tests);
		$result = ob_get_clean();
		
		file_put_contents($file, "<?php\n/*\nThis file is updated automatically as your applications is run.\n*/\n\$permission_tests = ".$result.";\n?>");
		return $this->tests;
	}
	
	private function build_label($field) {
		$label = str_replace("_", " ", $field);
		$label = ucwords($label);
		return $label;
	}
	
	//-- functions to assist tests --//
	private function in_param($value, $params) {
		$allowed = false;
		foreach($params as $param) {
			$bounds = explode("-", $param);
			
			if (count($bounds) == 1 && $bounds[0] == $value) {
				$allowed = true;
			} else if (count($bounds) == 2 && $bounds[0] <= $value && $value <= $bounds[1]) {
				$allowed = true;
			}
		}
		return $allowed;
	}
	
	//-- tests that are commonly used --//
	
	// is user connected
	function user_ID() {
		if (!defined('USER_ID') || !USER_ID) {
			$this->signout = true;
			return false;
		}
		return true;
	}
	
	// user_level[1-3,5,9]
	function user_level($args, $params) {
		return defined('USER_LEVEL') && $this->in_param(USER_LEVEL, $params);
	}
	
	function company_ID() {
		if (!defined('COMPANY_ID') || !COMPANY_ID) {
			return false;
		}
		return true;
	}
}

?>
