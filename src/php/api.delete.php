<?php

/**
 * Export - sample delete account API class
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


class Delete extends Core {
	
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
	 * Delete own account
	 *
	 * @return bool
	 *
	 * @url DELETE
	 * @url GET
	 * @access protected
	 */
	function deleteUserAccount() {
		
		$this->db->delete('users',
			array('user_ID' => USER_ID)
		);
		
		//** add in hooks to delete entire footprint
		
		return TRUE;
	}
}

?>
