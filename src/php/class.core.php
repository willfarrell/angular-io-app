<?php

require_once 'class.db.php';
require_once 'class.filter.php';
require_once 'class.permission.php';
require_once 'class.notify.php';

require_once 'class.console.php';	// debugging
require_once 'class.timer.php';		// benchmarking

class Core {
	
	/**
	 * Constructs a Core object.
	 */
	function __construct() {
		global $database;
		$this->db			= $database; //new MySQL;
		//$this->cache		= new Cache;
		
		$this->filter		= new Filter;
		//$this->filter		= new Filter;
		$this->permission	= new Permission;
		$this->notify		= new Notify;
		
		//-- Development classes --//
		$this->console		= new Console;
		$this->timer		= new Timers;
	}
	
	/**
	 * Destructs a Core object.
	 *
	 * @return void
	 */
	function __destruct() {
		
	}
	
	/**
	 * Fetch next row as Key-Value Array
	 * cast number strings to number objects
	 *
	 * @param object $results	   MySQL Results Object
	 * @param array $ignore	   Array of fields to ignore, or false to not cast
	 * @return object $result Array
	 */
	function __cleanArrayTypes($array, $ignore = array()) {
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
