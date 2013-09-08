<?php

/**
 * Console - Debugging class
 *
 * FirePHP: http://www.firephp.org/
 * - Chrome Extension: https://chrome.google.com/webstore/detail/firephp4chrome/gpgbmonepdpnacijbbdijfbecmgoojma
 *
 * ChromeLogger: chromelogger.com
 * - Chrome Extension: https://chrome.google.com/webstore/detail/chrome-logger/noaneddfkdjfnfdakjjmocngnfkfehhd
 *
 * Use Case:
 * Console::log("data");
 * Console::info("data", 34);
 * Console::warn("data", 34, [1,2,3,4]);
 * Console::error("data");
 *
 * @category  PHP
 * @package   Angular.io
 * @author    will Farrell <iam@willfarrell.ca>
 * @copyright 2000-2013 Farrell Labs
 * @license   http://angulario.com
 * @version   0.0.1
 * @link      http://angulario.com
 */

require_once dirname(__FILE__).'/vendor/firephp/firephp-core/lib/FirePHPCore/FirePHP.class.php';
require_once dirname(__FILE__).'/vendor/ccampbell/chromephp/ChromePhp.php';

if(!defined("CONSOLE_DB"))			define("CONSOLE_DB", FALSE);
if(!defined("CONSOLE_DBTABLE"))		define("CONSOLE_DBTABLE", "console_log");
if(!defined("CONSOLE_FILE"))		define("CONSOLE_FILE", FALSE);
if(!defined("CONSOLE_FILENAME"))	define("CONSOLE_FILENAME", "console.txt");
if(!defined("CONSOLE_FIREPHP"))		define("CONSOLE_FIREPHP", FALSE);
if(!defined("CONSOLE_CHROMELOGGER"))define("CONSOLE_CHROMELOGGER", FALSE);

class Console
{
	/**
	 * Collenction of console outputs
	 *
	 * @var array()
	 */
	//private static $_items = array();
	
	/**
	 * FirePHP Object from returning debugging to the browser
	 *
	 * @var object
	 */
	//private static $FirePHP;
	
	/**
	 * ChromeLogger Object from returning debugging to the browser
	 * NOT USED
	 *
	 * @var object
	 */
	//private $ChromeLogger;
	
	function __construct() {
		// FirePHP - chrome plugin
		if (CONSOLE_FIREPHP) FirePHP::getInstance(true);
	}

	function __destruct() {
		
	}
	
	
	/*public function __call($method,$arguments) {
		$this->add($method, $arguments);
	}*/
	
	public static function log() { self::add('log', func_get_args()); }
	public static function info() { self::add('info', func_get_args()); }
	public static function warn() { self::add('warn', func_get_args()); }
	public static function error() { self::add('error', func_get_args()); }
	
	public static function group() { self::add('group', func_get_args()); }
	public static function groupCollapsed() { self::add('groupCollapsed', func_get_args()); }
	public static function groupEnd() { self::add('groupEnd', func_get_args()); }
	
	public static function add($type, $args) {
		if (!is_array($args)) { $args = array($args); }
		/*$this->_items[] = array(
			"source" => self::getSource(),
			"type" => $type,
			"data" => array()
		);*/
		foreach ($args as $item) {
			$data = is_array($item) ? json_encode($item): (string)$item;
			//$this->_items[count($this->_items)-1]['data'][] = $data;
			if ($data) {
				self::outputBrowser($type, $data);
				self::outputDb($type, $data);
				self::outputFile($type, $data);
			}
			
		}
	}
	
	static function outputBrowser($type, $data) {
		// Browser Extensions
		if (CONSOLE_FIREPHP) {
			try {
				//if (!in_array($type, array("log", "info", "warn", "error"))) { $type = "log"; }
				//FirePHP::{$type}($data);
				switch($type) {
					case "log":
						FirePHP::log($data);
						break;
					case "info":
						FirePHP::info($data);
						break;
					case "warn":
						FirePHP::warn($data);
						break;
					case "error":
						FirePHP::error($data);
						break;
					default:
						FirePHP::log($data);
						break;
				}
			} catch (Exception $e) {}
		}
		if (CONSOLE_CHROMELOGGER) {
			try {
				//if (!in_array($type, array("log", "info", "warn", "error", "group", , "groupCollapsed", "groupEnd"))) { $type = "log"; }
				//ChromePhp::{$type}($data);
				switch($type) {
					case "log":
						ChromePhp::log($data);
						break;
					case "info":
						ChromePhp::info($data);
						break;
					case "warn":
						ChromePhp::warn($data);
						break;
					case "error":
						ChromePhp::error($data);
						break;
					case "group":
						ChromePhp::group($data);
						break;
					case "groupCollapsed":
						ChromePhp::groupCollapsed($data);
						break;
					case "groupEnd":
						ChromePhp::groupEnd($data);
						break;
					default:
						ChromePhp::log($data);
						break;
				}
			} catch (Exception $e) {}
		}
	}
	
	static function outputFile($type, $data) {
		if (CONSOLE_FILE) {
			try {
				//$data = $this->format();
				// print to log files				
				$data = "\n".date('r', $_SERVER['REQUEST_TIME'])." ---------------------------------\n".$data;
				$file = $_SERVER['DOCUMENT_ROOT'].'/'.CONSOLE_FILENAME;
				file_put_contents($file, $data, FILE_APPEND);
			} catch (Exception $e) {}
		}
	}
	
	static function outputDb($type, $data) {
		global $database;
		if (CONSOLE_DB) {
			try {
				// insert log
				$query = "INSERT INTO ".CONSOLE_DBTABLE." VALUES type = `{{type}}`, source = `{{source}}`, data = `{{data}}`, timestamp = `{{timestamp}}`";
				$database->query($query, array("type" => $type, "source" => self::getSource(), "data" => $data, "timestamp" => $_SERVER["REQUEST_TIME"]));
			} catch (Exception $e) {
				// make table
				$query = "CREATE TABLE IF NOT EXISTS `".CONSOLE_DBTABLE."` (`type` VARCHAR(16) NULL ,`source` TEXT NULL ,`data` TEXT NULL ,`timestamp` INT NULL ) ENGINE = MyISAM";
				$database->query($query);
				self::outputDb($data);
			}
			
		}
	}
	
	private static function getSource() {
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
	
	/*private static function format() {
		$str = "";
		$count = 1;
		foreach ($this->_items as $item) {
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
	}*/
}

//$console = new Console;

?>
