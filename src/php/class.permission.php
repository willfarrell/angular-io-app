<?php

/**
 * Permissions Manager
 * AboutClass
 *
 * PHP Version 5.5
 *
 * @category  N/A
 * @package   N/A
 * @author    will Farrell <will.farrell@gmail.com>
 * @copyright 2000 - 2013 willFarrell.ca
 * @license   http://www.opensource.org/licenses/mit-license.html  MIT License
 * @version   GIT: <git_id>
 * @link      http://willFarrell.ca
 */

/**

Additional Notes:


 */

require_once 'class.db.php';
include_once "inc.permission.php";

/**
 * Permission
 * AboutClass
 *
 * @category  N/A
 * @package   N/A
 * @author    Original Author <author@example.com>
 * @author    Another Author <another@example.com>
 * @copyright 2000 - 2011 willFarrell.ca
 * @license   http://www.opensource.org/licenses/mit-license.html  MIT License
 * @version   Release: <package_version>
 * @link      http://willFarrell.ca
 */

class Permission
{
	private $tests = array();
    
    /**
     * Constructor
     */
    function __construct()
    {
        global $database, $permission_tests;
        $this->db = $database;
        
        if (!$permission_tests) $this->tests = array();
        else $this->tests = $permission_tests;
    }

    /**
     * Destructor
     */
    function __destruct()
    {
        
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
    
    /**
     * 
     * check
     *
     * @param array $args array of params to be used in tests
     *
     * @return true
     * @aceess puiblic
     */
    function check($args = NULL) {
    	$allowed = true;
    	
	    // trace source
		$trace = debug_backtrace();
		if (!isset($trace[1])) return $allowed;	// trace failed
		
		$source = strtolower("{$trace[1]['class']}_{$trace[1]['function']}");
		if ($args == NULL) {
			$args = $trace[1]['args'];
			// $args = func_get_args();
		}
		
		// add class_function to config file
		$this->add_function_array($source);
		
		$tests = explode("|", $this->tests[$source]);
		if ($tests[0]) {
			foreach($tests as $test_str) {
				preg_match("/([\w-]*)\[?([^\[\]]*)\]?/", $test_str, $matches);
				
				$test = $matches[1];
				$params = explode(",", $matches[2]);
				
				if (method_exists($this, $test)) {
					$allowed = ($allowed && $this->{$test}($args, $params));
				}
			}
		}
		
        return $allowed;
    }
    
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
    function connected() {
	    return (USER_ID && USER_LEVEL);
    }
    
    // user_level[1-3,5,9]
    function user_level($args, $params) {
    	return $this->in_param(USER_LEVEL, $params);
    }
}

?>