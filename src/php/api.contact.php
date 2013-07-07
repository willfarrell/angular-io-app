<?php

require_once 'class.filter.php';
require_once 'class.notify.php';

class Contact extends Core {

	function __construct() {
		parent::__construct();
	}

	function __destruct() {
		parent::__destruct();
	}


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

		return $return;
	}
	
	// from class.notify.php
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
