<?php


require_once 'class.db.php';

class Profile {
	private $db;
	private $table = 'users';

	function __construct(){
		global $database;
        $this->db = $database;
    }




    function get_points() {
		$return = 0;
		$result = $this->db->select('users', array('user_ID' => USER_ID));
		if ($result) {
			$user = $this->db->fetch_assoc($result);
			$return = $user['points'];
		}
		
		$query = "SELECT SUM(`bet`) AS bets, SUM(`return`) AS returns FROM game_points_log GPL"
				." WHERE `user_ID` = '{{user_ID}}' AND `timestamp_return` != 0 AND `timestamp_return` <= '".$_SERVER['REQUEST_TIME']."'";

		$result = $this->db->query($query, array('user_ID' => USER_ID));
		if ($result) {
			$log = $this->db->fetch_assoc($result);
			$return -= $log['bets'];
			$return += $log['returns'];
		}

		return $return;
    }

    
    function get_invites() {
    	$return = array();
    	
    	$user_ID = USER_ID;
		$query = "SELECT G.game_ID, game_name, round_ID, user_inviter_ID AS user_ID, expire_timestamp FROM game_round_invite GRI"
				." LEFT JOIN games G ON G.game_ID = GRI.game_ID"
				." WHERE user_invitee_ID = '{{user_ID}}'"
				." AND expire_timestamp > ".$_SERVER['REQUEST_TIME']
				." GROUP BY game_ID, round_ID"
				." ORDER BY invite_timestamp DESC"
				." LIMIT 0,20";
		$result = $this->db->query($query, array('user_ID' => $user_ID));
		if ($result) {
			$return = array();
			while ($round = $this->db->fetch_assoc($result)) {
				$return[] = $round;
			}
		}

		return $return;
    }

    function get_log() {
    	$return = array();
    	
		$user_ID = USER_ID;
		$query = "SELECT * FROM game_points_log GPL"
				." LEFT JOIN games G ON G.game_ID = GPL.game_ID"
				." WHERE user_ID = '{{user_ID}}'"
				." AND bet != 0"
				." AND `timestamp_return` != 0 AND timestamp_return < ".$_SERVER['REQUEST_TIME']
				." ORDER BY timestamp_return DESC"
				." LIMIT 0,20";
		$result = $this->db->query($query, array('user_ID' => $user_ID));
		if ($result) {
			$return = array();
			while ($round = $this->db->fetch_assoc($result)) {
				$return[] = $round;
			}
		}

		return $return;
    }

}

// insert dummy data related to users
// user ID 1 - 10 are bots, 11 - 50 blank user accounts
function profile_dummy_data() {
	global $database, $session;
	$dummy_users = 50;

	//$query = "DELETE FROM `users` WHERE `user_ID` < 10000";
	//$this->db->query($query);
	$query = "DELETE FROM `friends` WHERE `user_ID` < 10000";
	$database->query($query);

	$message_ID = 1;
	for ($i = 1; $i <= $dummy_users; $i++) {

		$database->insert_update('users', array(
			'user_ID' => $i,
			'user_email' => $i."@stockgaming.com",
			'user_name' => "SGBot".$i,
			'user_name_first' => "Bot ".$i,
			'user_name_last' => "SG",
			'user_age' => rand(18,101),
			'password' => $session->password_hash($i, $i."@stockgaming.com"),
			'points' => 1000000,
		));
		echo "$i  \n";

	}

}

?>