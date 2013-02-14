<?php

require_once 'class.db.php';
require_once 'class.filter.php';
require_once 'class.permission.php';
require_once 'class.notify.php';

require_once 'class.timer.php';
require_once 'php/FirePHPCore/FirePHP.class.php';	// FirePHP debugging tool

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
		$this->log 			= FirePHP::getInstance(true);
		
		// Time sections of code and save to log
		$this->timer 		= new Timers;
	}

	function __destruct()
	{
		
	}
	
	function __log($var_dump)
	{
		$this->log->fb($var_dump, FirePHP::INFO);
	}
}

?>