<?php


class Notify {
	
	// refactor into json settings
	public $admin_email = EMAIL_ADMIN_EMAIL;
	private $signature = EMAIL_SIGNATURE;
	private $footer = EMAIL_FOOTER;
	
	private $vars = array(
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

	function __construct() {
		global $database;
		$this->db = $database;
		
		$this->vars["_SERVER"]["REMOTE_ADDR"] = $_SERVER['REMOTE_ADDR'];
		
		// include messages
		$templates = file_get_contents('json/notify.templates.en.json');
		$this->templates = json_decode($templates, true);
		
		// default notification types
		$defaults = file_get_contents('json/config.notify.client.json');
		$this->defaults = json_decode($defaults, true);
		
		// these defaults should overwrite any user set ones. (todo)**
		$defaults = file_get_contents('json/config.notify.server.json');
		$this->defaults = array_merge($this->defaults, json_decode($defaults, true));
	}

	function __destruct() {
		
	}
	
	public function send($user_ID, $message_ID, $args = array(), $types = "email") {
		$types = explode(",", $types);
		
		// from user details
		$select = array("user_ID", "user_name", "user_name_first", "user_name_last","user_email", "user_phone");
		$from = $this->db->select("users", array("user_ID" => USER_ID), $select);
		if ($from) {
			$from = $this->db->fetch_assoc($from);
			$this->vars['from'] = $from;
		} else {
			$from = array();
		}
		
		// to user details
		$select[] = "notify_json";
		$select[] = "security_json";
		$to = $this->db->select("users", array("user_ID" => $user_ID), $select);
		if (!$to) return;
		$to = $this->db->fetch_assoc($to);
		$this->vars['to'] = $to;
		
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
			if (array_key_exists('email', $security_json) && $security_json['email']['key']) {
				//$this->email->encrypt($security_json['email']['key'], $to['user_email'], $subject, $message);
				$sent = $sent && $this->pgp($security_json['email']['key'], $to['user_email'], $subject, $message);
			} else {
				$sent = $sent && $this->email($to['user_email'], $subject, $message);
			}
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
	
	// for non-regestered users
	public function sendEmail($user_email, $message_ID, $args = array()) {
		list($message, $subject) = $this->compile($message_ID, $args);
		$this->email($user_email, $subject, $message);
	}
	
	public function compile($message_ID, $args = array()) {
		if (!isset($this->templates[$message_ID])) return array("", "");
		
		
		$subject = $this->templates[$message_ID]['subject'];
		$message = $this->templates[$message_ID]['message'];
		
		foreach ($this->vars as $key => $value) {
			$message = $this->replace_tags($message, $key, 	$value);
		}
		$message = $this->replace_tags($message, 'args', 	$args);

		$message = wordwrap($message, 70); // support legacy

		return array($message, $subject);
	}
	
	private function replace_tags($str, $group = '', $tags = array()) {
		foreach ($tags as $key => $value) {
			if ($group) $key = $group.":".$key;
			//echo $key."\n";
			if (is_array($value)) continue;
			$str = preg_replace("/{{".$key."}}/i", $value, $str);
		}
		return $str;
	}
	
	
	// Services
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
	
	private function pgp($pubkey, $email, $subject, $message) {
		putenv("GNUPGHOME=/var/www/.gnupg");
		
		$pgp_message = (null);
		//$gpg = new gnupg();
		$res = gnupg_init();
		$rtv = gnupg_import($res, $pubkey);
		gnupg_addencryptkey($res,$rtv['fingerprint']);
		$pgp_message = gnupg_encrypt($res, $message);
		if ($pgp_message) {
			return $this->email($email, $subject, $pgp_message);
		} else {
			return $this->email($email, $subject, $message);
		}
	}
	
	// PGP encrypt message
	// import key - http://www.centos.org/docs/4/html/rhel-sbs-en-4/s1-gnupg-import.html - gpg --import public.key
	// rename key user_ID
	
	/*function encrypt($pubkey, $recipient, $email, $subject, $message) {
		// http://www.pantz.org/software/php/pgpemailwithphp.html
		$dir = "files/pgp";
		
		//Tell gnupg where the key ring is. Home dir of user web server is running as.
		putenv("GNUPGHOME=/var/www/.gnupg");
		
		// make temp key
		//$tempkey = tempnam("files/pgp", "newkey-");
		$tempkey = "newkey-".md5(time().rand());
		
		$fp = fopen($dir.'/'.$tempkey, "w");
		fwrite($fp, $pubkey);
		fclose($fp);
		
		system("gpg --import $dir/$tempkey && ", $result);
		unlink($dir.'/'.$tempkey);
		
		//create a unique file name
		//$infile = tempnam("/tmp", "message-");
		$infile = "message-".md5(time().rand());
		$outfile = $infile.".asc";
		
		//write form variables to email
		$fp = fopen($dir.'/'.$infile, "w");
		fwrite($fp, $message);
		fclose($fp);
		
		//set up the gnupg command. Note: Remember to put E-mail address on the gpg keyring. --pgp2 --pgp6 --pgp7 
		//$command = "gpg --no-default-keyring --keyring $tempkey --armor --local-user '' --recipient 'willfarrell <will.farrell@gmail.com>' --output $outfile --trust-model always --verbose --encrypt $infile";
		$command = "gpg --armor --recipient '$recipient <$email>' --armor --output $dir/$outfile --yes --always-trust --verbose --encrypt $dir/$infile";
		echo "$command\n\n";
		
		//execute the gnupg command
		exec($command, $result);
		var_dump($result);
		//delete the unencrypted temp file
		//unlink($dir.'/'.$infile);
		
		if (file_exists($dir.'/'.$outfile)) {
			$fp = fopen($dir.'/'.$outfile, "r");
			
			if($fp && filesize($dir.'/'.$outfile) != 0) {
				//read the encrypted file
				$pgp_message = fread ($fp, filesize ($dir.'/'.$outfile));
				//delete the encrypted file
				unlink($dir.'/'.$outfile);
			
				//send the email
				$this->send($email, $subject, $pgp_message);
			}
		} else {
			//$this->send($email, $subject, $message);
		}
		
	}*/
	
	/*
	- AWS SNS-SMS
	- http://www.twilio.com/sms
	- https://www.nexmo.com/
	- http://www.smushbox.com/
	*/
	private function sms($to, $message) {
		$sent = false;
		
		if (!$sent && SMS_NEXMO_APIKEY) {
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
		
		if (!$sent && SMS_TWILIO_APIKEY) {
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
		
		if (!$sent && SMS_AWS_APIKEY) {
			// http://aws.amazon.com/sns/
		}
		
		return true;
		return $sent;
	}
	
	/*
	- http://urbanairship.com/
	*/
	private function push($to, $message) {
		// https://docs.urbanairship.com/display/DOCS/Getting+Started
		return true;
	}
	
	/*
	facebook, twiter, linkedin
	*/
	private function social($to, $message) {
		return true;
	}
	
	private function web($user_ID, $message) {
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
	private function fax($to, $message) {
		return true;
	}
}

?>
