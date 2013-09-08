<?php

/**
 * Export - sample export API class
 *
 * PHP version 5.4
 *
 * @category  PHP
 * @package   Angular.io
 * @author    will Farrell <iam@willfarrell.ca>
 * @copyright 2000-2013 Farrell Labs
 * @license   http://angulario.com
 * @version   0.0.1
 * @link      http://angulario.com
 */


class Export extends Core {
	
	/**
	 * Constructs a Account object.
	 */
	function __construct() {
		parent::__construct();
		
	}
	
	/**
	 * Destructs a Account object.
	 *
	 * @return void
	 */
	function __destruct() {
		parent::__destruct();
	}
		
	/**
	 * export all data to zip file
	 *
	 * @param string $format
	 * @return string
	 *
	 * @url GET
	 * @url GET {format}
	 * @access protected
	 */
	function makeExportDataFile($format = "json") {
		
	}
	
	/**
	 * download export data file
	 *
	 * @param string $format
	 * @return string
	 *
	 * @url GET download
	 * @url GET download/{format}
	 * @access protected
	 */
	function downloadExportDataFile($format = "json") {
		
	}
}

?>
