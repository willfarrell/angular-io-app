<?php

/*

$this->console->log("data");
$this->console->warn("data", 34, [1,2,3,4]);
$this->console->error("data");
*/

require_once 'php/FirePHPCore/FirePHP.class.php';	// FirePHP debugging tool
//require_once 'ChromePhp/ChromePhp.php';	// ChromeLogger Extension Required

if(!defined("CONSOLE_FILE"))		define("CONSOLE_FILE", FALSE);
if(!defined("CONSOLE_FIREPHP"))		define("CONSOLE_FIREPHP", FALSE);
if(!defined("CONSOLE_CHROMEPHP"))	define("CONSOLE_CHROMEPHP", FALSE);

class Console {
	
	var $items = array();
	var $FirePHP;
	var $ChromePHP;
	
	function __construct() {
		// FirePHP - chrome plugin
		if (CONSOLE_FIREPHP) $this->FirePHP = FirePHP::getInstance(true);
		//if (CONSOLE_CHROMEPHP) $this->ChromePHP = ChromePHP::getInstance(true); // todo
	}

	function __destruct() {
		if (CONSOLE_FILE) {
			$data = $this->format();
			// print to log files
			if ($data != "") {
				$data = "\n".date('r', $_SERVER['REQUEST_TIME'])." ---------------------------------\n".$data;
				$file = $_SERVER['DOCUMENT_ROOT'].'/console.txt';
				file_put_contents($file, $data, FILE_APPEND);
			}
		}
	}
	
	
	function __call($method,$arguments) {
		$this->add($method, $arguments);
	}
	
	private function add($type, $args) {
		$this->items[] = array(
			"source" => $this->getSource(),
			"type" => $type,
			"data" => array()
		);
		foreach ($args as $item) {
			$data = is_array($item) ? json_encode($item): (string)$item;
			$this->items[count($this->items)-1]['data'][] = $data;
			
			// Browser Extensions
			if (CONSOLE_FIREPHP) {
				try {
					$this->FirePHP->fb($data, FirePHP::INFO);
				} catch (Exception $e) {}
			}
			if (CONSOLE_CHROMEPHP) {
				try {
					//$this->ChromePHP->fb($data, FirePHP::INFO); // todo
				} catch (Exception $e) {}
			}
		}
	}
	
	private function getSource() {
		$source = "";
		// trace source
		$trace = debug_backtrace();
		foreach ($trace as $call) {
			//print_r($call);
			
			if (isset($call['class'])) {
				if ($call['class'] == 'Console') { continue; }
				//if ($source != "") $source .= "\n-> ";
				if (isset($call['line']) && isset($call['file'])) {
					$source .= "{$call['line']}\t{$call['file']}\n";
				}
				$source .= "{$call['class']}::{$call['function']}";
			}
		}
		
		return $source;
	}
	
	private function format() {
		$str = "";
		$count = 1;
		foreach ($this->items as $item) {
			$str .= ($count++).". ";
			
			switch ($item['type']) {
				case 'info':
					$str .= implode("\t", $item['data']);
					break;
				case 'log':
					$str .= implode("\t", $item['data']);
					break;
				case 'warn':
					$str .= strtoupper($item['type'])." ";
					break;
				case 'error':
					$str .= strtoupper($item['type'])." ";
					break;
				default:
					$str .= strtoupper($item['type'])." ";
					break;
			}
			$str .= "\n";
		}
		return $str;
	}
}

//$console = new Console;

?>