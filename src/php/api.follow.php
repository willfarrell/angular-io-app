<?php

require_once 'class.db.php';

/*

GET 	/follow/user/1/__groups__ // make post?
DELETE 	/follow/user/1

GET 	/follow/ers/user
GET 	/follow/ing/user

*/

class Follow {
	private $db;
	private $table = "follow_user";

	function __construct() {
		global $database;
        $this->db = $database;
    }

    function __destruct() {

    }

    // self only
    function get_suggestions($type='user', $ref = NULL) {
		$return = array();
		
		$limit = 10;
		
		if ($ref) {
			$referral = $this->get_referral($type);
			$referrals = $this->get_referrals($type);
			$return = $referral + $referrals;
			$limit -= count($return);
		}
		
		if ($limit > 0) {
			$query = "SELECT U.user_ID AS ID, U.user_name AS name" // , GROUP_CONCAT(UF.group_ID) AS groups
				." FROM users U"
				." LEFT JOIN ".$this->table." UF ON UF.follow_ID = U.user_ID AND UF.user_ID = '{{user_ID}}'"
				." WHERE U.user_ID != '{{user_ID}}' AND UF.follow_ID IS NULL"
				." ORDER BY RAND()"
				." LIMIT 0,$limit";

			$suggestions = $this->db->query($query, array('user_ID' => USER_ID));
			if ($suggestions) {
				while ($suggestion = $this->db->fetch_assoc($suggestions)) {
					//$suggestion['groups'] = explode(',', $suggestion['groups']);
					$return[$suggestion['ID']] = $suggestion;
				}
			}
		}
		

		return $return;
	}
	
	function get_referral($type='user') {
		$return = array();
		
		$query = "SELECT RU.user_ID AS ID, RU.user_name AS name" // , GROUP_CONCAT(UF.group_ID) AS groups
			." FROM users U"
			." LEFT JOIN users RU ON U.referral_user_ID = RU.user_ID"
			." LEFT JOIN ".$this->table." UF ON UF.follow_ID = U.user_ID AND UF.user_ID = '{{user_ID}}'"
			." WHERE U.user_ID = '{{user_ID}}' AND UF.follow_ID IS NULL"
			." LIMIT 0,1";

		$suggestions = $this->db->query($query, array('user_ID' => USER_ID));
		if ($suggestions) {
			while ($suggestion = $this->db->fetch_assoc($suggestions)) {
				//$suggestion['groups'] = explode(',', $suggestion['groups']);
				$return[$suggestion['ID']] = $suggestion;
			}
		}
		
		return $return;
	}
	
	function get_referrals($type='user') {
		$return = array();
		
		$query = "SELECT U.user_ID AS ID, U.user_name AS name" // , GROUP_CONCAT(UF.group_ID) AS groups
			." FROM users U"
			." LEFT JOIN ".$this->table." UF ON UF.follow_ID = U.user_ID AND UF.user_ID = '{{user_ID}}'"
			." WHERE U.user_ID != '{{user_ID}}' AND  UF.follow_ID IS NULL"
			." AND U.referral_user_ID = '{{user_ID}}'"
			." ORDER BY RAND()"
			." LIMIT 0,10";

		$suggestions = $this->db->query($query, array('user_ID' => USER_ID));
		if ($suggestions) {
			while ($suggestion = $this->db->fetch_assoc($suggestions)) {
				//$suggestion['groups'] = explode(',', $suggestion['groups']);
				$return[$suggestion['ID']] = $suggestion;
			}
		}
		
		return $return;
	}

	//Followers lists (who is following you)
	function get_ers($id = 0, $keyword = '') { // $type='user'
		$id = preg_replace( '/[^0-9]+/', '', $id);
		if (!$id || $id < 0) $id = USER_ID;
		$return = array();

		$query = "SELECT U.user_ID AS ID, user_name AS name, UF.timestamp as following, GROUP_CONCAT(UF.group_ID) AS groups" // , UF.group_ID
				." FROM ".$this->table." FU"
				." LEFT JOIN ".$this->table." UF ON UF.user_ID = FU.follow_ID AND UF.follow_ID = FU.user_ID"
				." LEFT JOIN users U ON U.user_ID = FU.user_ID"
				." WHERE FU.follow_ID = '{{follow_ID}}'"
				." AND (user_name LIKE '%{{keyword}}%' OR user_name_first LIKE '%{{keyword}}%' OR user_name_last LIKE '%{{keyword}}%' OR user_email LIKE '%{{keyword}}%')"
				." GROUP BY FU.user_ID, FU.follow_ID";
		$followers = $this->db->query($query, array('follow_ID' => $id, 'keyword' => $keyword));
		if ($followers) {
			while ($follower = $this->db->fetch_assoc($followers)) {
				if ($id == USER_ID) $follower['groups'] = explode(',', $follower['groups']);
				else unset ($follower['groups']);
				$return[$follower['ID']] = $follower;
			}
		}

		return $return;
	}

	// Following list (who you're following)
	function get_ing($id = 0, $keyword = '') { // $type='user'
		$id = preg_replace( '/[^0-9]+/', '', $id);
		if (!$id || $id < 0) $id = USER_ID;
		$return = array();
		
		$query = "SELECT U.user_ID AS ID, user_name AS name, GROUP_CONCAT(group_ID) AS groups" //
				." FROM ".$this->table." FU"
				." LEFT JOIN users U ON U.user_ID = FU.follow_ID"
				." WHERE FU.user_ID = '{{user_ID}}'"
				." AND (user_name LIKE '%{{keyword}}%' OR user_name_first LIKE '%{{keyword}}%' OR user_name_last LIKE '%{{keyword}}%' OR user_email LIKE '%{{keyword}}%@')"
				." GROUP BY FU.user_ID, FU.follow_ID";
		$followings = $this->db->query($query, array('user_ID' => $id, 'keyword' => $keyword));
		if ($followings) {
			while ($following = $this->db->fetch_assoc($followings)) {
				if ($id == USER_ID) $following['groups'] = explode(',', $following['groups']);
				else unset ($following['groups']);
				$return[$following['ID']] = $following;
			}
		}

		return $return;
	}

	// get groups
	function get_group($group_ID=NULL) { // $type='user'
		$group_ID = preg_replace( '/[^0-9]+/', '', $group_ID);
		$return = array();

		$db_where = array('user_ID' => USER_ID);
		if ($group_ID != '') {
			$db_where['group_ID'] = $group_ID;
		}

		$results = $this->db->select($this->table.'_groups', $db_where);
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
		$group_ID = $this->db->insert($this->table.'_groups', $insert, $insert);

		return $group_ID;
	}

	// remove group
	function delete_group($group_ID=NULL) {
		$group_ID = preg_replace( '/[^0-9]+/', '', $group_ID);
		if (!$group_ID || $group_ID < 0) return;

		$this->db->delete($this->table.'_groups', array('group_ID' => $group_ID));
		$this->db->delete($this->table, array('group_ID' => $group_ID));

		return;
	}

	//-- User follow User --//

	// get follow relation to user
	function get_user($id = 0) {
		$id = preg_replace( '/[^0-9]+/', '', $id);
		if (!$id || $id < 0) return;

		$return = array(
			"ID" => $id,
			"following" => false,
		);

		$query = "SELECT follow_ID AS ID, timestamp as following, GROUP_CONCAT(group_ID) AS groups" //
				." FROM ".$this->table.""
				." WHERE user_ID = '{{user_ID}}' && follow_ID = '{{follow_ID}}'"
				." GROUP BY user_ID, follow_ID";
		
		$follows = $this->db->query($query, array('user_ID' => USER_ID, 'follow_ID' => $id));
		if ($follows) {
			$follow = $this->db->fetch_assoc($follows);
			if ($id != USER_ID) $follow['groups'] = explode(',', $follow['groups']);
			else unset ($follow['groups']);
			$return = array(
				"ID" => $follow['ID'],
				"following" => ($follow['following']),
			);

		}

		return $return;
	}

	// follow user
	function put_user($request_data=NULL) {
		$follow_ID = preg_replace( '/[^0-9]+/', '', $request_data['follow_ID']);
		$group_ID = preg_replace( '/[^0-9]+/', '', $request_data['group_ID']);
		if (!$follow_ID || $follow_ID < 0) return;

		$insert = array(
			'user_ID' => USER_ID,
			'follow_ID' => $follow_ID,
			'group_ID' => $group_ID,
			'timestamp' => $_SERVER['REQUEST_TIME']
		);
		
		$this->db->insert_update($this->table, $insert, $insert);

		return;
	}

	// unfollow user
	function delete_user($id=0, $group_ID=0) {
		$id = preg_replace( '/[^0-9]+/', '', $id);
		$group_ID = preg_replace( '/[^0-9]+/', '', $group_ID);
		if (!$id || $id < 0) return;

		if ($group_ID) {
			$this->db->delete($this->table, array(
				'user_ID' => USER_ID,
				'follow_ID' => $id,
				'group_ID' => $group_ID,
			));
		} else {
			$this->db->delete($this->table, array(
				'user_ID' => USER_ID,
				'follow_ID' => $id
			));
		}

		return;
	}


	//-- User follow Company --//

	// get follow relation to user
	function get_company($id = 0) {
		$id = preg_replace( '/[^0-9]+/', '', $id);
		if (!$id || $id < 0) return;

		$return = array(
			"ID" => 0,
			"following" => false,
		);

		$query = "SELECT follow_ID AS ID, timestamp as following, GROUP_CONCAT(group_ID) AS groups" //
				." FROM ".$this->table.""
				." WHERE user_ID = '{{user_ID}}' && follow_ID = '{{follow_ID}}'"
				." GROUP BY user_ID, follow_ID";
		$follows = $this->db->query($query, array('user_ID' => USER_ID, 'follow_ID' => $id));
		if ($follows) {
			$follow = $this->db->fetch_assoc($follows);
			if ($id != USER_ID) $follow['groups'] = explode(',', $follow['groups']);
			else unset ($follow['groups']);
			$return = array(
				"ID" => $follow['ID'],
				"following" => ($follow['following']),
			);

		}

		return $return;
	}

	// follow user
	function post_company($request_data=NULL) {
		$follow_ID = preg_replace( '/[^0-9]+/', '', $request_data['follow_ID']);
		$group_ID = preg_replace( '/[^0-9]+/', '', $request_data['group_ID']);
		if (!$follow_ID || $follow_ID < 0) return;

		$insert = array(
			'user_ID' => USER_ID,
			'follow_ID' => $follow_ID,
			'group_ID' => $group_ID,
			'timestamp' => $_SERVER['REQUEST_TIME']
		);

		$this->db->insert_update($this->table, $insert, $insert);

		return;
	}

	// unfollow user
	function delete_company($id=0, $group_ID=0) {
		$id = preg_replace( '/[^0-9]+/', '', $id);
		$group_ID = preg_replace( '/[^0-9]+/', '', $group_ID);
		if (!$id || $id < 0) return;

		if ($group_ID) {
			$this->db->delete($this->table, array(
				'user_ID' => USER_ID,
				'follow_ID' => $id,
				'group_ID' => $group_ID,
			));
		} else {
			$this->db->delete($this->table, array(
				'user_ID' => USER_ID,
				'follow_ID' => $id
			));
		}

		return;
	}
}

?>