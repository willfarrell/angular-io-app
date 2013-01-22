<?php

// Class Template

require_once 'class.db.php';
require_once 'class.session.php';
require_once 'class.filter.php';

class __template__ {
	private $db;
	private $filter;

	function __construct() {
		global $database, $filter;
		$this->db = $database;
		//$this->redis = new Redis('account:');
		$this->filter = $filter;
		
		// Dev
		$this->log = FirePHP::getInstance(true);
		$this->timer = new Timers;
	}

	function __destruct() {
		
	}
	
	private function __log($var_dump) {
		$this->log->fb($var_dump, FirePHP::INFO);
	}
	
	function post() {
		
	}
	
	function get() {
		
	}
	
	function put() {
		
	}
	
	function delete() {
		
	}
}
	
?>