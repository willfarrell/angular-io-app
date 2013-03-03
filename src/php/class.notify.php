<?php


class Notify {
	
	// refactor into json settings
	public $admin_email = EMAIL_ADMIN_EMAIL;
	private $signature = EMAIL_SIGNATURE;
	
	
	private $vars = array(
		"global" => array(
			"site_name" => NOTIFY_FROM_NAME,
			"site_url"	=> NOTIFY_FROM_URL
		),
		"_SERVER" => array(
			"REMOTE_ADDR" => ""
		),
		"from" => array(),
		"to" => array()
	);

	public $templates = array();

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
		$this->fax = new Fax;
		
		$this->snail = new SnailMail; // print and mail
		$this->phonecall = new PhoneCall; // recorded message
		*/
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
		}
		
		// get user details
		$select[] = "notify_json";
		$select[] = "security_json";
		$to = $this->db->select("users", array("user_ID" => $user_ID), $select);
		if (!$to) return;
		$to = $this->db->fetch_assoc($to);
		$this->vars['to'] = $to;
		
		// privacy defaults
		$notify = (isset($this->templates[$message_ID]['default'])) ? $this->templates[$message_ID]['default'] : array();
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
		
		list($message, $subject) = $this->compile($message_ID, $args); // support legacy
		
		$security_json = json_decode($to['security_json'], true);
		if (!is_array($security_json)) $security_json = array();
		
		//print_r($notify_json);
		//print_r($security_json);
		//print_r($notify);
		
		// send via types
		if (in_array("email", $types) && $notify['email']) {
			if (array_key_exists('email', $security_json) && $security_json['email']['key']) {
				//$this->email->encrypt($security_json['email']['key'], $to['user_email'], $subject, $message);
				$this->email->encrypt($security_json['email']['key'], $to['user_email'], $subject, $message);
			} else {
				$this->email->send($to['user_email'], $subject, $message);
			}
		}
		if (in_array("sms", $types) && $notify['sms'])
			$this->sms->send($to['user_phone'], $message);
		/*
		if (in_array("mobilepush", $types) && isset($notify['mobilepush']) && $notify['mobilepush'])
			$this->mobilepush->send($user_phone, $message);
		*/
	}
	
	// for non-regestered users
	public function sendEmail($user_email, $message_ID, $args = array()) {
		list($message, $subject) = $this->compile($message_ID, $args);
		$this->email->send($user_email, $subject, $message);
	}
	
	public function compile($message_ID, $args = array()) {
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
  	
  	function send($email, $subject, $message) {
  		//echo "$to, $subject, $message";
  		
  		if (EMAIL_MAILGUN_APIKEY) {
	  		exec("curl -s --user api:".EMAIL_MAILGUN_APIKEY." \
				    https://api.mailgun.net/v2/".EMAIL_MAILGUN_DOMAIN."/messages \
				    -F from='".NOTIFY_FROM_NAME." <".NOTIFY_FROM_EMAIL.">' \
				    -F to=$email\
				    -F subject='$subject' \
				    -F text='$message'",
				    $output, $return
			);
  		} else if (EMAIL_AWS_APIKEY) {
	  		
	  	} else {
	  		$headers = 	"From: ".NOTIFY_FROM_NAME." <".NOTIFY_FROM_EMAIL.">\r\n" .
					    "Reply-To: ".NOTIFY_FROM_EMAIL."\r\n";
	  		mail($to, $subject, $message, $headers);
  		}
	  	
  	}
  	
  	function encrypt($pubkey, $email, $subject, $message) {
	  	putenv("GNUPGHOME=/var/www/.gnupg");
	  	
	  	$pgp_message = (null);
	  	//$gpg = new gnupg();
	  	$res = gnupg_init();
		$rtv = gnupg_import($res, $pubkey);
		gnupg_addencryptkey($res,$rtv['fingerprint']);
		$pgp_message = gnupg_encrypt($res, $message);
		if ($pgp_message) {
			$this->send($email, $subject, $pgp_message);
		} else {
			$this->send($email, $subject, $message);
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
		//$command = "gpg --no-default-keyring --keyring $tempkey --armor --local-user '' --recipient 'willfarrell <will.farrell@gmail.com>'  --output $outfile --trust-model always --verbose --encrypt $infile";
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
	  	if (SMS_NEXMO_APIKEY) {
	  		// https://www.nexmo.com/documentation/index.html#txt
		  	exec("curl -s  \
				    http://rest.nexmo.com/sms/json \
				    -F api_key=".SMS_NEXMO_APIKEY." \
				    -F api_secret=".SMS_NEXMO_APISECRET." \
				    -F from=".NOTIFY_FROM_NAME." \
				    -F to=$to\
				    -F text=$message",
				    $output, $return
			);
		} else if (SMS_TWILIO_APIKEY) {
			// http://www.twilio.com/docs/api/rest/sending-sms
			exec("curl -s  \
				    https://api.twilio.com/2010-04-01/Accounts/".SMS_TWILIO_APIKEY."/SMS/Messages \
				    -F from=".NOTIFY_FROM_NUMBER." \
				    -F to=$to\
				    -F text=$message",
				    $output, $return
			);
		} else if (SMS_AWS_APIKEY) {
			// http://aws.amazon.com/sns/
	  	} else {
		  	
	  	}
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
	  	// https://docs.urbanairship.com/display/DOCS/Getting+Started
  	}
}

/*
- http://www.efaxdeveloper.com/developer/faq
*/
class Fax {
	function __construct() {
		//parent::__construct();
    }

	function __destruct() {
		//parent::__destruct();
  	}
  	
  	function send($to, $message) {
	  	// http://www.efaxdeveloper.com/developer/faq
  	}
}


?>
