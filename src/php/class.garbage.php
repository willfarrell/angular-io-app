<?php

/*

The class that gets it's hands dirty
Add this to your crontab to clean up 
DB remains from deleted accounts or
objects

*/

class Garbage extends Core {

	function __construct() {
		parent::__construct();
	}

	function __destruct() {
		parent::__destruct();
	}
	
	function clean() {
		
		$this->session();
		
		$this->missing('company', 'companies', 'company_ID');
		$this->missing('user', 'users', 'user_ID');
		
		$this->companies();
	}
	
	function missing($fct, $table, $table_id) {
		// will not catch a start = 1
		$missing_query = "SELECT start, stop FROM (
				SELECT m.$table_id + 1 AS start,
					(SELECT min($table_id) - 1 FROM $table AS x WHERE x.$table_id > m.$table_id) AS stop
				FROM $table AS m
					LEFT OUTER JOIN $table AS r ON m.$table_id = r.$table_id - 1
				WHERE r.$table_id IS NULL
			) AS x
			WHERE stop IS NOT NULL;";
		$missing = $this->db->query($missing_query);
		
		while($missing && $item = $this->db->fetch_array($missing)) {
			for($i = $item[0]; $i <= $item[1]; $i++) {
				$this->{$fct}($i);
			}
			
		}
	}
	
	// clean sessions table
	function session() {
		echo "DELETING SESSIONS\n";
		$this->db->query("DELETE FROM sessions WHERE (user_ID = 0 OR user_level = 0) AND timestamp < ".($_SERVER['REQUEST_TIME'] - 86400));
	}
	
	// remove user data
	function user($user_ID = 0) {
		echo "DELETING USER $user_ID\n";
		
		$where = array('user_ID' => $user_ID);
		$this->db->delete('users', $where);
		$this->db->delete('sessions', $where);
		$this->db->delete('user_confirm', $where);
		$this->db->delete('user_reset', $where);
	}
	
	function companies() {
		$this->company(0);
		
		$companies = $this->db->query("SELECT C.company_ID FROM companies C LEFT JOIN users U ON C.company_ID = U.company_ID WHERE U.user_ID IS NULL");
		while($companies && $item = $this->db->fetch_array($companies)) {
			$this->company($item[0]);
		}
	}
	// clean delete company data
	function company($company_ID) {
		echo "DELETING COMPANY $company_ID\n";
		
		$where = array('company_ID' => $company_ID);
		$this->db->delete('companies', $where);
		$this->db->delete('locations', $where);
		$this->db->delete('users', $where);
		
	}
}

?>
