<?php


class Search {
	
	function __construct() {
		global $database, $session, $filter;
		$this->db = $database;
		$this->filter = $filter;
		$this->session = $session;
		
		// Dev
		$this->log = FirePHP::getInstance(true);
		$this->timer = new Timers;
	}

	function __destruct() {
		
	}
	
	private function __log($var_dump) {
		$this->log->fb($var_dump, FirePHP::INFO);
	}
	
	
	function user($keyword=NULL, $limit=NULL) {
		if ($limit && !is_int($limit)) return;
		if (!$limit) $limit = 10;
		$return = array();
		
		$query = "SELECT user_ID, user_name, user_name_first, user_name_last, user_phone, user_function" //
				." FROM users U"
				." WHERE"
				." (user_name LIKE '%{{keyword}}%' OR user_name_first LIKE '%{{keyword}}%' OR user_name_last LIKE '%{{keyword}}%' OR user_email LIKE '%{{keyword}}%@' OR user_details LIKE '%{{keyword}}%' OR user_url LIKE '%{{keyword}}%')"
				." LIMIT 0,{{limit}}";
		$users = $this->db->query($query, array('keyword' => $keyword, 'limit' => $limit));
		while ($users && $user = $this->db->fetch_assoc($users)) {
			$return[] = $user;
		}

		return $return;
	}
	
	// same as above
	function company($keyword=NULL, $limit=NULL) {
		if ($limit && !is_int($limit)) return;
		if (!$limit) $limit = 10;
		$return = array();
		
		$query = "SELECT company_ID, company_name, company_url, company_phone" //
				." FROM companies C"
				." WHERE"
				." (company_name LIKE '%{{keyword}}%' OR company_details LIKE '%{{keyword}}%' OR company_url LIKE '%{{keyword}}%')"
				." LIMIT 0,{{limit}}";
		$companies = $this->db->query($query, array('keyword' => $keyword, 'limit' => $limit));
		while ($companies && $company = $this->db->fetch_assoc($companies)) {
			$return[] = $company;
		}

		return $return;
	}
}

?>