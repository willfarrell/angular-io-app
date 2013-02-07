<?php

require_once 'class.db.php';
require_once 'class.session.php';
require_once 'class.filter.php';
require_once 'class.timer.php';

class Core {
	var $db;
	var $filter;
	var $timer;

	function __construct() {
		global $database, $filter;
		$this->db = $database;
		$this->filter = $filter;
		
		
		//-- Development classes --//
		
		// FirePHP - chrome plugin
		$this->log = FirePHP::getInstance(true);
		
		// Time sections of code and save to log
		$this->timer = new Timers;
	}

	function __destruct() {
		
	}
	
	function __log($var_dump) {
		$this->log->fb($var_dump, FirePHP::INFO);
	}
}

?>