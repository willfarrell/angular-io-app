<?php

/**
 * @access protected
 */

class Message extends Core {
	private $table = "messages";
	
	/**
	 * Constructs a Message object.
	 */
	function __construct() {
		parent::__construct();
	}
	
	/**
	 * Destructs a Message object.
	 *
	 * @return void
	 */
	function __destruct() {
		parent::__destruct();
	}
	
	/**
	 * Create a key between two users
	 *
	 * @param int $user_ID Other user ID
	 * @return string
	 */
	private function user_key($user_ID) {
		return implode('-', $this->db->sort(USER_ID, $user_ID));
	}
	
	/**
	 * Get unread count
	 *
	 * @return int
	 *
	 * @url GET unread
	 * @access protected
	 */
	function unread() {
		// Check permissions
		/*if(!$this->permission->check()) {
			return $this->permission->errorMessage();
		};*/
		
		$count = 0;
		
		$query = "SELECT COUNT(*) AS count"
				." FROM ".$this->table." M"
				." WHERE "
				." `user_to_ID` = '{{user_ID}}'"
				." AND `timestamp` = (SELECT MAX(timestamp) FROM messages WHERE user_key = M.user_key LIMIT 0,1)"
				." AND `read` = 0"
				." GROUP BY user_key ORDER BY timestamp DESC";
		
		$where = array(
			'user_ID' => USER_ID
		);
		
		$results = $this->db->query($query, $where);
		if ($results) {
			$result = $this->db->fetch_assoc($results);
			$count = $result['count'];
		}
		return $count;
	}
	
	/**
	 * Get a list of all messages
	 *
	 * @return array
	 *
	 * @url GET list
	 * @access protected
	 */
	function get_list() {
		
		$return = array();
		
		$query = "SELECT *"
				." FROM ".$this->table." M"
				." WHERE "
				." (user_from_ID = '{{user_ID}}' OR user_to_ID = '{{user_ID}}')"
				." AND timestamp = (SELECT MAX(timestamp) FROM messages WHERE user_key = M.user_key LIMIT 0,1)"
				." GROUP BY user_key ORDER BY timestamp DESC"
				." LIMIT 0,25";
		
		
		$where = array(
			'user_ID' => USER_ID
		);
		
		$messages = $this->db->query($query, $where);
		while ($messages && $message = $this->db->fetch_assoc($messages)) {
			// get user details
			$user_ID = ($message['user_to_ID'] == USER_ID) ? $message['user_from_ID'] : $message['user_to_ID'];
			
			$user_obj = $this->db->select("users",
				array("user_ID" => $user_ID),
				array("user_ID", "user_username", "user_name_first", "user_name_last")
			);
			if ($user_obj) $message['user'] = $this->db->fetch_assoc($user_obj);
			
			$return[] = $message;
		}

		return $return;
	}
	
	/**
	 * Get list of messages with a user by ID
	 *
	 * @param int $user_ID User ID
	 * @return array
	 *
	 * @url GET {user_ID}
	 * @access protected
	 */
	function get($user_ID=NULL) {
		// Check permissions
		/*if(!$this->permission->check(array("user_ID" => $user_ID))) {
			return $this->permission->errorMessage();
		};*/
		
		$return = array();
		$user_key = $this->user_key($user_ID);
		
		$user_obj = $this->db->select("users",
			array("user_ID" => $user_ID),
			array("user_ID", "user_username", "user_name_first", "user_name_last")
		);
		if ($user_obj) $return['user'] = $this->db->fetch_assoc($user_obj);
		else return;
		
		$query = "SELECT *"
				." FROM ".$this->table
				." WHERE "
				." user_key = '{{user_key}}'"
				." ORDER BY timestamp DESC"
				." LIMIT 0,25";
		
		$where = array(
			'user_key' => $user_key
		);
		
		$messages = $this->db->query($query, $where);
		while ($messages && $message = $this->db->fetch_assoc($messages)) {
			$return['thread'][] = $message;
		}
		
		// mark as read
		$where['user_to_ID'] = USER_ID;
		$this->db->update($this->table, array('read' => 1), $where);
		
		return $return;
	}
	
	/**
	 * Send message to a user
	 *
	 * @param array $request_data POST data
	 * @return bool
	 *
	 * @url POST
	 * @access protected
	 */
	function post($request_data=NULL) {
		
		$insert = array(
			'user_key' => $this->user_key($request_data['user_ID']),
			'user_from_ID' => USER_ID,
			'user_to_ID' => $request_data['user_ID'],
			'message' => strip_tags($request_data['message']),
			'timestamp' => $_SERVER['REQUEST_TIME'],
		);
		$this->db->insert($this->table, $insert);
		
		$this->notify->send($request_data['user_ID'], 'new_message', array(), "email,sms,push");
		
		return TRUE;
	}
	
	/**
	 * Delete a message sent to a user
	 *
	 * @param int $user_ID User ID
	 * @param int $timestamp Timestamp of message
	 * @return bool
	 *
	 * @url GET delete/{user_ID}/{timestamp}
	 * @url DELETE {user_ID}/{timestamp}
	 * @access protected
	 */
	function delete($user_ID=NULL, $timestamp=NULL) {
		
		$user_key = $this->user_key($user_ID);
		
		$where = array(
			'user_key' => $user_key,
			'user_to_ID' => USER_ID,
			'timestamp' => $timestamp,
		);
		
		$this->db->delete($this->table, $where);
		
		return TRUE;
	}
}

?>
