<?php

/**
 * Contact - contact form for support
 * all messages get sent to one address
 *
 * PHP version 5.4
 *
 * @category  PHP
 * @package   PHP_CodeSniffer
 * @author    will Farrell <iam@willfarrell.ca>
 * @copyright 2000-2013 Farrell Labs
 * @license   http://angulario.com
 * @version   0.0.1
 * @link      http://angulario.com
 */
 
require_once 'class.filter.php';
require_once 'class.notify.php';

if(!defined("EMAIL_ADMIN_EMAIL")) define("EMAIL_ADMIN_EMAIL", '');

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
	 *
	 * @return array
	 *
	 * @access public
	 */
	function post($request_data=NULL) {
		$return = array();

		// validate and sanitize
		$this->filter->set_request_data($request_data);
		$this->filter->set_group_rules('contact');
		$this->filter->set_key_rules(array('email', 'message'), 'required');
		if(!$this->filter->run()) {
			$return["errors"] = $this->filter->get_errors('error');
			return $return;
		}
		$request_data = $this->filter->get_request_data();

		$request_data['name'] = isset($request_data['name']) ? $request_data['name'] : '';
		
		//$notify = new Notify;
		
		$this->email(EMAIL_ADMIN_EMAIL, 'Contact', 'Name:'.$request_data['name'].'\n'.'From:'.$request_data['email'].'\n'.$request_data['message']);

		return TRUE;
	}
	
	/**
	 * This is a copy of Email from class.notify.php
	 *
	 * @param string $email Email of recipient
	 * @param string $subject Email subject
	 * @param string $message Email body
	 *
	 * @return bool
	 */
	private function email($email, $subject, $message) {
		$sent = false;
		
		if (!$sent && EMAIL_MAILGUN_APIKEY) {
			exec("curl -s --user api:".EMAIL_MAILGUN_APIKEY." \
					https://api.mailgun.net/v2/".EMAIL_MAILGUN_DOMAIN."/messages \
					-F from=".escapeshellarg(NOTIFY_FROM_NAME." <".NOTIFY_FROM_EMAIL.">")." \
					-F to=$email\
					-F subject=".escapeshellarg($subject)." \
					-F text=".escapeshellarg($message)."",
					$output, $return
			);
			
			// confirm sent
			$output = json_decode(implode("", $output), true);
			if ($output['message'] == 'Queued. Thank you.') {
				$sent = true;
			}
		}
		
		if (!$sent && EMAIL_AWS_APIKEY) {
			
		} 
		
		if (!$sent) {
			$headers = 	"From: ".NOTIFY_FROM_NAME." <".NOTIFY_FROM_EMAIL.">\r\n" .
						"Reply-To: ".NOTIFY_FROM_EMAIL."\r\n";
			$sent = mail($email, $subject, $message, $headers);
		}
		
		return $sent;
	}
}

?>
