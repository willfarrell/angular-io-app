<?php


class Notify {
	
	// factor into json settings
	public $admin_email = MAIL_ADMIN_EMAIL;
	private $signature = MAIL_SIGNATURE;
	
	
	private $vars = array(
		"global" => array(
			"site_name" => MAIL_SITE_NAME,
			"site_url"	=> MAIL_SITE_URL
		),
		"_SERVER" => array(
			"REMOTE_ADDR" => ""
		),
		"from" => array(),
		"to" => array()
	);

	private $templates = array();

	function __construct() {
		global $database;
		$this->db = $database;
		
		
		
		$this->vars["_SERVER"]["REMOTE_ADDR"] = $_SERVER['REMOTE_ADDR'];
		
		// include messages
		$templates = file_get_contents('json/messages.json');
		$this->templates = json_decode($templates, true);
		
		$this->email = new Email;
		$this->sms = new SMS;
		/*
		$this->mobilepush = new PushNotification;
		$this->social = new SocialPush; // send to twitter, fb, etc
		//$this->fax = new Fax;
		
		//$this->snail = new SnailMail; // print and mail
		//$this->phonecall = new PhoneCall; // recorded message
		*/
    }

	function __destruct() {
		
  	}
	
	public function send($user_ID, $message_ID, $args = array(), $types = "email") {
		$types = explode(",", $types);
		
		// from user details
		$select = array("user_ID", "user_name", "user_name_first", "user_name_last","user_email", "user_phone");
		$from = $this->db->select("users", array("user_ID" => USER_ID), $select);
		if (!$from) return;
		$from = $this->db->fetch_assoc($from);
		$this->vars['from'] = $from;
		
		// get user details
		$select[] = "notify_json";
		$to = $this->db->select("users", array("user_ID" => $user_ID), $select);
		if (!$to) return;
		$to = $this->db->fetch_assoc($to);
		$this->vars['to'] = $to;
		
		// privacy defaults
		$notify = array(
			"email" => true,
			"sms" => false
		);
		
		// get user privacy settings
		// {message_ID:{"email":true,"sms":false}
		$notify_all = json_decode($to['notify_json']);
		if (!is_array($notify_all)) $notify_all = array();
		
		if (in_array($message_ID, $notify_all)) {
			foreach ($notify_all[$message_ID] as $key => $value) {
				$notify[$key] = $value;
			}
		}
		
		list($message, $subject) = $this->compile($message_ID, $args); // support legacy
		
		// send via types
		if (in_array("email", $types) && isset($notify['email']) && $notify['email'])
			$this->email->send($to['user_email'], $subject, $message);
		//if (in_array("sms", $types) && isset($notify['sms']) && $notify['sms'])
		//	$this->sms->send($to['user_phone'], $message);
		//if (in_array("push", $types) && isset($notify['push']) && $notify['push'])
		//	$this->mobilepush->send($user_phone, $message);
	}
	
	// for non-regestered users
	public function sendEmail($user_email, $message_ID, $args = array()) {
		list($message, $subject) = $this->compile($message_ID, $args);
		$this->email->send($user_email, $subject, $message);
	}
	
	private function compile($message_ID, $args = array()) {
		if (!isset($this->templates[$message_ID])) return array("", "");
		
		
		$subject = $this->templates[$message_ID]['subject'];
		$message = $this->templates[$message_ID]['message'];
		
		foreach ($this->vars as $key => $value) {
			$message = $this->replace_tags($message, $key, 	$value);
		}
		$message = $this->replace_tags($message, 'args', 	$args);

		$message .= $this->signature;

		$message = wordwrap($message, 70); // support legacy

		return array($message, $subject);
	}
	
	private function replace_tags($str, $group = '', $tags = array()) {
	    foreach ($tags as $key => $value) {
	    	if ($group) $key = $group.":".$key;
	      	$str = preg_replace("/{{".$key."}}/i", $value, $str);
	    }
	    return $str;
	}
}

/*
- localhost
- mailgun
- AWS SES
*/
class Email {
	function __construct() {
		//parent::__construct();
    }

	function __destruct() {
		//parent::__destruct();
  	}
  	
  	function send($to, $subject, $message) {
  		
  		if (MAILGUN_APIKEY) {
	  		exec("curl -s --user api:".MAILGUN_APIKEY." \
				    https://api.mailgun.net/v2/".MAILGUN_DOMAIN."/messages \
				    -F from='".MAIL_SITE_NAME." <".MAIL_SITE_EMAIL.">' \
				    -F to=$to\
				    -F subject='$subject' \
				    -F text='$message'",
				    $output, $return
			);
  		} else {
	  		mail($to, $subject, $message);
  		}
	  	
  	}
  	
  	// PGP encrypt message
  	function encrypt() {
	  	
  	}
}

/*
- AWS SNS-SMS
- http://www.twilio.com/sms
- https://www.nexmo.com/
*/
class SMS {
	function __construct() {
		//parent::__construct();
    }

	function __destruct() {
		//parent::__destruct();
  	}
  	
  	function send($to, $message) {
	  	//mail($to, $subject, $message);
  	}
}

/*
- http://urbanairship.com/
*/
class PushNotification {
	function __construct() {
		//parent::__construct();
    }

	function __destruct() {
		//parent::__destruct();
  	}
  	
  	function send($to, $message) {
	  	//mail($to, $subject, $message);
  	}
}


?>