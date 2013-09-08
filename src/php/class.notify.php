<?php

/**
 * Notify - Handle all external notifications
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
 
require_once 'class.pgp.php';

/*

//-- Notify Class --//
// move to config.notify.json
define("NOTIFY_FROM_NAME", 	"");
define("NOTIFY_FROM_EMAIL", "");
define("NOTIFY_FROM_NUMBER","");	// assigned by SMS service
define("NOTIFY_FROM_URL", 	"http://app.angulario.com/");

//-- Email --//
define("EMAIL_ADMIN_EMAIL",	"");
define("EMAIL_ADDRESS",		""); // Address is required to help keep stay out of the spam folder
define("EMAIL_SIGNATURE",	"\n\nKind Regards,\n\nNAME\nEMAIL\nURL");
define("EMAIL_FOOTER",		"\n\n".EMAIL_ADDRESS."\nUpdate preferences at: {{global:site_url}}#/settings/notifications\n\nThis action was requested from {{_SERVER:REMOTE_ADDR}}.");
// AWS SES
define("EMAIL_AWS_APIKEY", 	"");
// mailgun
//define("EMAIL_MAILGUN_APIKEY", "");
//define("EMAIL_MAILGUN_DOMAIN", "");


//-- SMS --//
// AWS SNS
define("SMS_AWS_APIKEY", 	"");
// nexmo
define("SMS_NEXMO_APIKEY", 	"");
define("SMS_NEXMO_APISECRET", "");
// twilio
define("SMS_TWILIO_APIKEY", "");

*/

class Notify {
	
	// refactor into json settings
	public $admin_email = EMAIL_ADMIN_EMAIL;
	private $_signature = EMAIL_SIGNATURE;
	private $_footer = EMAIL_FOOTER;
	
	private $_vars = array(
		"global" => array(	// order is important for nested vars
			"signature"	=> EMAIL_SIGNATURE,
			"footer"	=> EMAIL_FOOTER,
			
			"site_name" => NOTIFY_FROM_NAME,
			"site_url"	=> NOTIFY_FROM_URL,
		),
		"_SERVER" => array(
			"REMOTE_ADDR" => ""
		),
		"from" => array(),
		"to" => array()
	);

	public $templates = array();
	public $defaults = array();
	
	/**
	 * Constructs a Notify object.
	 */
	function __construct() {
		global $database;
		$this->db = $database;
		
		// Do not place $this->_vars["_SERVER"] = $_SERVER; // Open secuirty issues
		$this->_vars["_SERVER"]["REMOTE_ADDR"] = $_SERVER['REMOTE_ADDR'];
		
		// include messages
		$templates = file_get_contents(dirname(__FILE__).'/../json/notify.templates.en.json');
		$this->templates = json_decode($templates, true);
		
		// default notification types
		$defaults = file_get_contents(dirname(__FILE__).'/../json/config.notify.client.json');
		$this->defaults = json_decode($defaults, true);
		
		// these defaults should overwrite any user set ones. (todo)**
		$defaults = file_get_contents(dirname(__FILE__).'/../json/config.notify.server.json');
		$this->defaults = array_merge($this->defaults, json_decode($defaults, true));
	}
	
	/**
	 * Destructs a Notify object.
	 *
	 * @return void
	 */
	function __destruct() {
		
	}
	
	/**
	 * Send a notification
	 *
	 * @param int $user_ID
	 * @param string $message_ID Template ID
	 * @param array $args Params in inject into template
	 * @param string $types Methods of notifying
	 * @return bool
	 */
	public function send($user_ID, $message_ID, $args = array(), $types = "email") {
		//if (!is_array($args)) { $types = $args; }
		$types = explode(",", $types);
		
		// from user details
		$select = array("user_ID", "user_username", "user_name_first", "user_name_last","user_email", "user_phone");
		$from = $this->db->select("users", array("user_ID" => USER_ID), $select);
		if ($from) {
			$from = $this->db->fetch_assoc($from);
			$this->_vars['from'] = $from;
		} else {
			$from = array();
		}
		
		// to user details
		$select[] = "notify_json";
		$select[] = "security_json";
		$to = $this->db->select("users", array("user_ID" => $user_ID), $select);
		if (!$to) return FALSE;
		$to = $this->db->fetch_assoc($to);
		$this->_vars['to'] = $to;
		
		// privacy defaults
		$notify = (isset($this->defaults[$message_ID])) ? $this->defaults[$message_ID] : array();
		foreach ($types as $type) {
			if (!isset($notify[$type])) $notify[$type] = false;
		}
			
		// get user privacy settings
		// {message_ID:{"email":true,"sms":false}
		$notify_json = json_decode($to['notify_json'], true);
		if (!is_array($notify_json)) $notify_json = array();
		
		if (array_key_exists($message_ID, $notify_json)) {
			foreach ($notify_json[$message_ID] as $key => $value) {
				$notify[$key] = $value;
			}
		}
		
		// get user security settings
		$security_json = json_decode($to['security_json'], true);
		if (!is_array($security_json)) $security_json = array();
		
		//print_r($notify_json);
		//print_r($security_json);
		//print_r($notify);
		
		// compile message
		//print_r($args);
		list($message, $subject) = $this->compile($message_ID, $args); // support legacy
		//echo $message;
		
		// send via types
		$sent = true;
		
		if (in_array("web", $types) && $notify['web']) {
			$sent = $sent && $this->web($to['user_ID'], $message);
		}
		
		if (in_array("social", $types) && $notify['social']) {
			$sent = $sent && $this->social($to['user_email'], $message);
		}
		
		if (in_array("email", $types) && $notify['email']) {
			if (array_key_exists('email', $security_json) && $security_json['email']['enable'] && $security_json['email']['public_key']) {
				//$this->email->encrypt($security_json['email']['key'], $to['user_email'], $subject, $message);
				$pgp = new PGP;
				//$message = $pgp->encryptString($security_json['email']['public_key'], $message);
			}
			$sent = $sent && $this->email($to['user_email'], $subject, $message);
			
		}
		
		if (in_array("sms", $types) && $notify['sms']) {
			$sent = $sent && $this->sms($to['user_phone'], $message);
		}
		if (in_array("push", $types) && $notify['push']) {
			$sent = $sent && $this->push($to['user_phone'], $message);
		}
		if (in_array("fax", $types) && $notify['fax']) {
			$sent = $sent && $this->fax($to['user_phone'], $message);
		}
		
		return $sent;
	}
	
	/**
	 * Compile a message for sending
	 *
	 * @param string $message_ID Template ID
	 * @param array $args Params in inject into template
	 * @return string
	 */
	public function compile($message_ID, $args = array()) {
		if (!isset($this->templates[$message_ID])) return array("", "");
		
		
		$subject = $this->templates[$message_ID]['subject'];
		$message = $this->templates[$message_ID]['message'];
		
		foreach ($this->_vars as $key => $value) {
			$message = $this->replace_tags($message, $key, 	$value);
		}
		$message = $this->replace_tags($message, 'args', 	$args);

		$message = wordwrap($message, 70); // support legacy

		return array($message, $subject);
	}
	
	/**
	 * Helper function for compiling a message
	 * replaces key-value pairs in a template
	 *
	 * @param string $str Source string
	 * @param string $group Collention of args name
	 * @param array $tags Params in inject into template
	 * @return string
	 */
	public function replace_tags($str, $group = '', $tags = array()) {
		foreach ($tags as $key => $value) {
			if ($group) $key = $group.":".$key;
			//echo $key."\n";
			if (is_array($value)) continue;
			$str = str_ireplace("{{".$key."}}", $value, $str);
			//$str = preg_replace("/{{".$key."}}/i", $value, $str);
		}
		return $str;
	}
	
	
	//-- Services --//
	/**
	 * Send an email
	 *
	 * @param string $email
	 * @param string $subject
	 * @param string $message
	 * @return bool
	 */
	public function email($email, $subject, $message) {
		$sent = false;
		
		if (!$sent && defined("EMAIL_MAILGUN_APIKEY")) {
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
		
		if (!$sent && defined("EMAIL_AWS_APIKEY")) {
			
		} 
		
		if (!$sent) {
			$headers = 	"From: ".NOTIFY_FROM_NAME." <".NOTIFY_FROM_EMAIL.">\r\n" .
						"Reply-To: ".NOTIFY_FROM_EMAIL."\r\n";
			$sent = mail($email, $subject, $message, $headers);
		}
		
		return $sent;
	}
	
	// for non-regestered users
	/**
	 * Send a message to a non-registered user
	 * ie, newsletter
	 *
	 * @param string $email
	 * @param int $message_ID Message template ID
	 * @param array $args Params to inject into message
	 * @return bool
	 */
	public function emailNonUser($user_email, $message_ID, $args = array()) {
		list($message, $subject) = $this->compile($message_ID, $args);
		return $this->email($user_email, $subject, $message);
	}
	
	/**
	 * Send an email to site admin
	 * use for debug or contact page
	 *
	 * @param string $subject
	 * @param string $message
	 * @return bool
	 */
	public function emailHome($subject, $message) {
		return $this->email($this->admin_email, $subject, $message);
	}
		
	/*
	- AWS SNS-SMS
	- http://www.twilio.com/sms
	- https://www.nexmo.com/
	- http://www.smushbox.com/
	*/
	public function sms($to, $message) {
		$sent = false;
		
		if (!$sent && defined("SMS_NEXMO_APIKEY")) {
			// https://www.nexmo.com/documentation/index.html#txt
			exec("curl -s \
					http://rest.nexmo.com/sms/json \
					-F api_key=".SMS_NEXMO_APIKEY." \
					-F api_secret=".SMS_NEXMO_APISECRET." \
					-F from=".escapeshellarg(NOTIFY_FROM_NAME)." \
					-F to=$to \
					-F text=".escapeshellarg($message)."",
					$output, $return
			);
			
			// confirm sent
			/*$output = json_decode(implode("", $output), true);
			if ($output['message'] == 'Queued. Thank you.') {
				$sent = true;
			}*/
		}
		
		if (!$sent && defined("SMS_TWILIO_APIKEY")) {
			// http://www.twilio.com/docs/api/rest/sending-sms
			exec("curl -s\
					https://api.twilio.com/2010-04-01/Accounts/".SMS_TWILIO_APIKEY."/SMS/Messages \
					-F from=".NOTIFY_FROM_NUMBER." \
					-F to=$to\
					-F text=".escapeshellarg($message)."",
					$output, $return
			);
			
			// confirm sent
			/*$output = json_decode(implode("", $output), true);
			if ($output['message'] == 'Queued. Thank you.') {
				$sent = true;
			}*/
		}
		
		if (!$sent && defined("SMS_AWS_APIKEY")) {
			// http://aws.amazon.com/sns/
		}
		
		return true;
		return $sent;
	}
	
	/*
	- http://urbanairship.com/
	*/
	public function push($to, $message) {
		// https://docs.urbanairship.com/display/DOCS/Getting+Started
		return true;
	}
	
	/*
	facebook, twiter, linkedin
	*/
	public function social($to, $message) {
		return true;
	}
	
	public function web($user_ID, $message) {
		/*$this->db->insert('notifications', array(
			"user_ID" => $user_ID,
			"message" => $message,
			"timestamp" => $_SERVER['REQUEST_TIME'],
			"read" => 0
		));*/
		
		return true;
	}
	
	/*
	- http://www.efaxdeveloper.com/developer/faq
	*/
	public function fax($to, $message) {
		return true;
	}
}

?>
