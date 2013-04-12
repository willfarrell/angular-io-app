<?php

require_once 'class.db.php';
require_once 'class.filter.php';
require_once 'class.permission.php';
require_once 'class.notify.php';

require_once 'class.timer.php';
//require_once 'php/FirePHPCore/FirePHP.class.php';	// FirePHP debugging tool
//require_once 'ChromePhp/ChromePhp.php';	// ChromeLogger Extension Required

class Core {

	function __construct()
	{
		global $database, $filter;
		$this->db 			= $database;
		$this->filter 		= $filter;
		$this->permission 	= new Permission;
		$this->notify 		= new Notify;
		
		//-- Development classes --//
		
		// FirePHP - chrome plugin
		//$this->log 			= FirePHP::getInstance(true);
		
		// Time sections of code and save to log
		$this->timer 		= new Timers;
	}

	function __destruct()
	{
		
	}
	
	/*function __log($var_dump)
	{
		$this->log->fb($var_dump, FirePHP::INFO);
	}*/
	
	/**
     * Fetch next row as Key-Value Array
     * cast number strings to number objects
     *
     * @param object $results       MySQL Results Object
     * @param array $ignore       Array of fields to ignore, or false to not cast
     *
     * @return object $result Array
     * @aceess    public
     */
	function __cleanArrayTypes($array, $ignore = array())
    {
	    // cast numbers
	    if (is_array($ignore) && is_array($array)) {
		    foreach ($array as $key => $value) {
			    if (!in_array($key, $ignore) && is_numeric($value)) $array[$key] += 0;
		    }
	    }
	    
	    return $array;
    }
}

?>
