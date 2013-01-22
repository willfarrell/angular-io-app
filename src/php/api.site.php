<?php


class Site {
	private $table = "sites";

	function __construct() {
		global $database, $filter;
		$this->db = $database;
		$this->filter = $filter;
		
		// Dev
		$this->log = FirePHP::getInstance(true);
		$this->timer = new Timers;
	}

	function __destruct() {
		
	}
	
	private function __log($var_dump) {
		$this->log->fb($var_dump, FirePHP::INFO);
	}

    function get() {
		$return = array();
		
		$sites = $this->db->select($this->table, array('company_ID' => COMPANY_ID));
		while ($sites && $site = $this->db->fetch_assoc($sites)) {
			$return[$site['site_ID']] = $site['site'];
		}

		return $return;
	}

    function post($request_data=NULL) {
    	if($request_data == NULL || !$request_data['site']) return;
		
		$insert = array('company_ID' => COMPANY_ID, 'site' => $request_data['site']);
    	$site_ID = $this->db->insert_update($this->table, $insert, $insert);

    	return $site_ID;
    }

    function delete($site_ID=NULL) {
    	if($site_ID == NULL) return;

    	$this->db->delete($this->table, array('company_ID' => COMPANY_ID, 'site_ID' => $site_ID));
    }
}

?>