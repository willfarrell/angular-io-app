<?php

/*

GET 	/follow/user/1/__groups__ // make post?
DELETE 	/follow/user/1

GET 	/follow/ers/user
GET 	/follow/ing/user

*/

class Follow extends Core {
	private $table = "follows";

	function __construct() {
		parent::__construct();
    }

    function __destruct() {
	    parent::__destruct();
    }

    // self only
    function get_suggestions($ref_bool = NULL) {
		$return = array();
		
		$limit = 10;
		
		if ($ref_bool) {
			$referral = $this->get_referral();
			$referrals = $this->get_referrals();
			$return = $referral + $referrals;
			$limit -= count($return);
		}
		
		if ($limit > 0) {
			if (COMPANY_ID) {
				$query = "SELECT C.company_ID, C.company_name" // , GROUP_CONCAT(UF.group_ID) AS groups
					." FROM companies C"
					." LEFT JOIN ".$this->table." CF ON CF.follow_company_ID = C.company_ID AND CF.company_ID = '{{company_ID}}'"
					." WHERE C.company_ID != '{{company_ID}}' AND CF.follow_company_ID IS NULL"
					." ORDER BY RAND()"
					." LIMIT 0,$limit";

				$suggestions = $this->db->query($query, array('company_ID' => COMPANY_ID));
			} else {
				$query = "SELECT U.user_ID, U.company_ID, U.user_name, CONCAT(U.user_name_first, ' ', U.user_name_last) AS name" // , GROUP_CONCAT(UF.group_ID) AS groups
					." FROM users U"
					." LEFT JOIN ".$this->table." UF ON UF.follow_user_ID = U.user_ID AND UF.user_ID = '{{user_ID}}'"
					." WHERE U.user_ID != '{{user_ID}}' AND U.timestamp_create != 0 AND UF.follow_user_ID IS NULL"
					." ORDER BY RAND()"
					." LIMIT 0,$limit";

					$suggestions = $this->db->query($query, array('user_ID' => USER_ID));
			}
			
			while ($suggestions && $suggestion = $this->db->fetch_assoc($suggestions)) {
				//$suggestion['groups'] = explode(',', $suggestion['groups']);
				$return[] = $suggestion;
			}
		}
		

		return $return;
	}
	
	function get_referral() {
		$return = array();
		
		$query = "SELECT RU.company_ID, RU.user_ID, RU.user_name, CONCAT(RU.user_name_first, ' ', RU.user_name_last) AS name" // , GROUP_CONCAT(UF.group_ID) AS groups
			." FROM users U"
			." LEFT JOIN users RU ON U.referral_user_ID = RU.user_ID"
			." LEFT JOIN ".$this->table." UF ON UF.follow_user_ID = U.user_ID AND UF.user_ID = '{{user_ID}}'"
			." WHERE U.user_ID = '{{user_ID}}' AND U.referral_user_ID != 0 AND UF.follow_user_ID IS NULL"
			." LIMIT 0,1";

		$suggestions = $this->db->query($query, array('user_ID' => USER_ID));
		if ($suggestions) {
			while ($suggestion = $this->db->fetch_assoc($suggestions)) {
				//$suggestion['groups'] = explode(',', $suggestion['groups']);
				$return[] = $suggestion;
			}
		}
		
		return $return;
	}
	
	function get_referrals() {
		$return = array();
		
		$query = "SELECT U.company_ID, U.user_ID, U.user_name, CONCAT(U.user_name_first, ' ', U.user_name_last) AS name" // , GROUP_CONCAT(UF.group_ID) AS groups
			." FROM users U"
			." LEFT JOIN ".$this->table." UF ON UF.follow_user_ID = U.user_ID AND UF.user_ID = '{{user_ID}}'"
			." WHERE U.user_ID != '{{user_ID}}' AND U.timestamp_create != 0 AND  UF.follow_user_ID IS NULL"
			." AND U.referral_user_ID = '{{user_ID}}'"
			." ORDER BY RAND()"
			." LIMIT 0,10";

		$suggestions = $this->db->query($query, array('user_ID' => USER_ID));
		while ($suggestions && $suggestion = $this->db->fetch_assoc($suggestions)) {
			//$suggestion['groups'] = explode(',', $suggestion['groups']);
			$return[] = $suggestion;
		}
		
		return $return;
	}

	//Followers lists (who is following you)
	function get_ers($company_ID = 0, $user_ID = 0, $keyword = '') { // $type='user'
		$company_ID = preg_replace( '/[^0-9]+/', '', $company_ID);
		$user_ID = preg_replace( '/[^0-9]+/', '', $user_ID);
		if (!$company_ID) $company_ID = COMPANY_ID;
		if (!$user_ID) $user_ID = USER_ID;
		$return = array();

		$query = "SELECT U.user_ID, U.company_ID, user_name, CONCAT(user_name_first, ' ', user_name_last) AS name, UF.timestamp as following, GROUP_CONCAT(UF.group_ID) AS groups" // , UF.group_ID
				." FROM ".$this->table." FU"
				." LEFT JOIN ".$this->table." UF ON UF.user_ID = FU.follow_user_ID AND UF.follow_user_ID = FU.user_ID"
				." LEFT JOIN users U ON U.user_ID = FU.user_ID"
				." WHERE FU.follow_user_ID = '{{follow_user_ID}}'"
				." AND (user_name LIKE '%{{keyword}}%' OR user_name_first LIKE '%{{keyword}}%' OR user_name_last LIKE '%{{keyword}}%' OR user_email LIKE '%{{keyword}}%')"
				." GROUP BY FU.user_ID, FU.follow_user_ID";
		$followers = $this->db->query($query, array('follow_user_ID' => $user_ID, 'keyword' => $keyword));
		if ($followers) {
			while ($follower = $this->db->fetch_assoc($followers)) {
				if ($id == USER_ID) $follower['groups'] = explode(',', $follower['groups']);
				else unset ($follower['groups']);
				$follower['follower'] = true;
				$return[$follower['ID']] = $follower;
			}
		}

		return $return;
	}

	// Following list (who you're following)
	function get_ing($company_ID = 0, $user_ID = 0, $keyword = '') { // $type='user'
		$company_ID = preg_replace( '/[^0-9]+/', '', $company_ID);
		$user_ID = preg_replace( '/[^0-9]+/', '', $user_ID);
		if (!$company_ID) $company_ID = COMPANY_ID;
		if (!$user_ID) $user_ID = USER_ID;
		$return = array();
		
		$query = "SELECT U.user_ID, U.company_ID, user_name, CONCAT(user_name_first, ' ', user_name_last) AS name, GROUP_CONCAT(group_ID) AS groups" //
				." FROM ".$this->table." FU"
				." LEFT JOIN users U ON U.user_ID = FU.follow_user_ID"
				." WHERE FU.user_ID = '{{user_ID}}'"
				." AND (user_name LIKE '%{{keyword}}%' OR user_name_first LIKE '%{{keyword}}%' OR user_name_last LIKE '%{{keyword}}%' OR user_email LIKE '%{{keyword}}%@')"
				." GROUP BY FU.user_ID, FU.follow_user_ID";
		$followings = $this->db->query($query, array('user_ID' => $user_ID, 'keyword' => $keyword));
		if ($followings) {
			while ($following = $this->db->fetch_assoc($followings)) {
				if ($user_ID == USER_ID) $following['groups'] = explode(',', $following['groups']);
				else unset ($following['groups']);
				$following['following'] = true;
				$return[] = $following;
			}
		}

		return $return;
	}

	//-- Group Management --//
	function get_group($group_ID=NULL) { // $type='user'
		$group_ID = preg_replace( '/[^0-9]+/', '', $group_ID);
		$return = array();

		$db_where = array('user_ID' => USER_ID);
		if ($group_ID != '') {
			$db_where['group_ID'] = $group_ID;
		}

		$results = $this->db->select('follow_groups', $db_where);
		if ($results) {
			while($group = $this->db->fetch_assoc($results)) {
				$return[$group['group_ID']] = $group;
			}
			if ($group_ID != '') {
				$return = $return[$group_ID];
			}
		}

		return $return;
	}

	// make group
	function post_group($request_data=NULL) { // $type='user'
		$insert = array(
			'user_ID' => USER_ID,
			'group_name' => $request_data['group_name'],
			'group_color' => $request_data['color'],
		);
		$group_ID = $this->db->insert('follow_groups', $insert, $insert);

		return $group_ID;
	}

	// remove group
	function delete_group($group_ID=NULL) {
		$group_ID = preg_replace( '/[^0-9]+/', '', $group_ID);
		if (!$group_ID || $group_ID < 0) return;

		$this->db->delete('follow_groups', array('group_ID' => $group_ID));
		$this->db->delete($this->table, array('group_ID' => $group_ID));

		return;
	}
	
	//-- Follow Functions --//
	function get($company_ID = 0, $user_ID = 0) {
		$company_ID = preg_replace( '/[^0-9]+/', '', $company_ID);
		$user_ID = preg_replace( '/[^0-9]+/', '', $user_ID);
		if (!$company_ID && !$user_ID) return;
		

		$return = array(
			'user_ID' => (int) $user_ID,
			'company_ID' => (int) $company_ID,
			"following" => false,
		);
		
		$select = array(
			'user_ID' => USER_ID,
			'company_ID' => COMPANY_ID,
		);
		if ($user_ID) $select['follow_user_ID'] = $user_ID;
		if ($company_ID) $select['follow_company_ID'] = $company_ID;
		
		$where = array("user_ID = '{{user_ID}}'");
		if ($user_ID) $where[] = "follow_user_ID = '{{follow_user_ID}}'";
		if ($company_ID) $where[] = "follow_company_ID = '{{follow_company_ID}}'";
		
		$group_by = array("user_ID");
		if ($user_ID) $group_by[] = 'follow_user_ID';
		if ($company_ID) $group_by[] = 'follow_company_ID';
		
		$query = "SELECT follow_user_ID AS user_ID, follow_company_ID AS company_ID, timestamp as following, GROUP_CONCAT(group_ID) AS groups" //
				." FROM ".$this->table.""
				." WHERE ".implode(" && ", $where).""
				." GROUP BY ".implode(",", $group_by).""
				." LIMIT 0,1";
		
		$follows = $this->db->query($query, $select);
		if ($follows) {
			$follow = $this->db->fetch_assoc($follows);
			if ($user_ID != USER_ID) $follow['groups'] = explode(',', $follow['groups']);
			else unset ($follow['groups']);
			
			$return = array(
				'user_ID' => $follow['user_ID'],
				'company_ID' => $follow['company_ID'],
				"following" => ($follow['following']),
			);
		}

		return $return;
	}
	
	function put($company_ID = 0, $user_ID = 0, $group_ID=0) {
		$company_ID = preg_replace( '/[^0-9]+/', '', $company_ID);
		$user_ID = preg_replace( '/[^0-9]+/', '', $user_ID);
		$group_ID = preg_replace( '/[^0-9]+/', '', $group_ID);
		if (!$company_ID && !$user_ID) return;

		$insert = array(
			'user_ID' => USER_ID,
			'company_ID' => COMPANY_ID,
			'follow_user_ID' => $user_ID,
			'follow_company_ID' => $company_ID,
			'group_ID' => $group_ID,
			'timestamp' => $_SERVER['REQUEST_TIME']
		);
		
		$this->db->insert_update($this->table, $insert, $insert);
		
		
		$this->notify->send($user_ID, 'new_follow', array(), "email,sms,push");
		
		return;
	}
	
	function delete($company_ID = 0, $user_ID = 0, $group_ID=0) {
		$company_ID = preg_replace( '/[^0-9]+/', '', $company_ID);
		$user_ID = preg_replace( '/[^0-9]+/', '', $user_ID);
		$group_ID = preg_replace( '/[^0-9]+/', '', $group_ID);
		if (!$company_ID && !$user_ID) return;

		if ($group_ID) {
			$this->db->delete($this->table, array(
				'user_ID' => USER_ID,
				'company_ID' => COMPANY_ID,
				'follow_user_ID' => $user_ID,
				'follow_company_ID' => $company_ID,
				'group_ID' => $group_ID,
			));
		} else {
			$this->db->delete($this->table, array(
				'user_ID' => USER_ID,
				'company_ID' => COMPANY_ID,
				'follow_user_ID' => $user_ID,
				'follow_company_ID' => $company_ID,
			));
		}
		//echo $this->db->last_query;
		return;
	}
}

?>
