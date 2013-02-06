<?php

require_once 'class.db.php';

class Mail {

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
	);

	private $messages = array();

	function __construct() {
		global $database, $filter;
        $this->db = $database;
		$this->filter = $filter;

		$this->vars["_SERVER"]["REMOTE_ADDR"] = $_SERVER['REMOTE_ADDR'];
		
		// include messages
		$messages = file_get_contents('json/messages.json');
		$this->messages = json_decode($messages, true);
		
		// Dev
		$this->log = FirePHP::getInstance(true);
		$this->timer = new Timers;
		
		$this->__log($this->messages);
    }

	function __destruct() {

  	}
  	
  	private function __log($var_dump) {
		$this->log->fb($var_dump, FirePHP::INFO);
	}
	
	public function send($to, $message_ID, $args = array()) {

		$subject = $this->messages[$message_ID]['subject'];
		$message = $this->messages[$message_ID]['message'];

		$message = $this->replace_tags($message, 'global', 	$this->vars['global']);
		$message = $this->replace_tags($message, '_SERVER', $this->vars['_SERVER']);
		$message = $this->replace_tags($message, 'args', 	$args);

		$message .= $this->signature;

		$message = wordwrap($message, 70); // support legacy

		mail($to, $subject, $message);
	}

	private function replace_tags($str, $group = '', $tags = array()) {
	    foreach ($tags as $key => $value) {
	    	if ($group) $key = $group.":".$key;
	      	$str = preg_replace("/{{".$key."}}/i", $value, $str);
	    }
	    return $str;
	}
}

?>