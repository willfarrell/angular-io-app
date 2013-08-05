<?php

/**
 * Contact - contact form for support
 * all messages get sent to one address
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
 
require_once 'class.filter.php';
require_once 'class.notify.php';

class Contact extends Core {
	
	/**
	 * Constructs a Contact object.
	 */
	function __construct() {
		parent::__construct();
	}
	
	/**
	 * Destructs a Contact object.
	 *
	 * @return void
	 */
	function __destruct() {
		parent::__destruct();
	}

	/**
	 * check if still signned in
	 *
	 * @param array $request_data POST array
	 * @return bool
	 *
	 * @url POST
	 * @access public
	 */
	function post($request_data=NULL) {
		$return = array();

		// validate and sanitize
		/*$this->filter->set_request_data($request_data);
		$this->filter->set_group_rules('contact');
		$this->filter->set_key_rules(array('email', 'message'), 'required');
		if(!$this->filter->run()) {
			$return["errors"] = $this->filter->get_errors('error');
			return $return;
		}
		$request_data = $this->filter->get_request_data();*/
		$request_data = $this->filter->run($request_data);
		if ($this->filter->hasErrors()) { return $this->filter->getErrorsReturn(); }

		$request_data['name'] = isset($request_data['name']) ? $request_data['name'] : '';
		
		$notify = new Notify;
		$notify->emailHome('Support/Contact', 'Name:'.$request_data['name'].'\n'.'From:'.$request_data['email'].'\n'.$request_data['message']);

		return TRUE;
	}
}

?>
