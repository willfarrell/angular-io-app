<?php

require_once 'class.filter.php';

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

		mail(EMAIL_ADMIN_EMAIL, 'Contact', 'Name:'.$request_data['name'].'\n'.'From:'.$request_data['email'].'\n'.$request_data['message']);

		return $return;
	}
}

?>
