<?php

/**
 * MySQL Database Class
 *
 * PHP Version 5
 *
 * @category  N/A
 * @package   N/A
 * @author    will Farrell <will.farrell@gmail.com>
 * @copyright 2000 - 2012 willFarrell.ca
 * @license   http://www.opensource.org/licenses/mit-license.html  MIT License
 * @version   GIT: <git_id>
 * @link      http://willFarrell.ca
 */

/**

Additional Notes:
- Make sure the DB_USER only has permission for command your using

 */

require_once "inc.config.php";

/**
 * Database
 *
 * @category  N/A
 * @package   N/A
 * @author    Original Author <author@example.com>
 * @author    Another Author <another@example.com>
 * @copyright 2000 - 2011 willFarrell.ca
 * @license   http://www.opensource.org/licenses/mit-license.html  MIT License
 * @version   Release: <package_version>
 * @link      http://willFarrell.ca
 */

class MySQL
{
    private $connection_mysql; //The MySQL database connection
    public $last_query = "";
    
    /**
     * Constructor
     */
    function __construct()
    {
        $this->_connect(DB_SERVER, DB_USER, DB_PASS, DB_NAME);
    }

    /**
     * Destructor
     */
    function __destruct()
    {
        $this->_close();
    }

    /**
     * create db connection
     *
     * @return null
     * @access public
     */
    public function _connect($server = DB_SERVER, $user = DB_USER, $password = DB_PASS, $schema = DB_NAME)
    {
        $this->connection_mysql = mysql_connect($server, $user, $password) or die(mysql_error());
        mysql_select_db($schema, $this->connection_mysql) or die(mysql_error());
    }

    /**
     * close db connection
     *
     * @return null
     * @access public
     */
    public function _close()
    {
         mysql_close($this->connection_mysql);
    }

    /**
     * Connection check
     * pings mysql service to see if still running,
     * if not, connects again
     *
     * @return true
     * @aceess public
     */
    function ping()
    {
        if (!mysql_ping($this->connection_mysql)) {
            $this->_connect();
            $this->ping();
        } else {
            return true;
        }
    }


    /**
     *    MySQL Query
     *    runs the query through the MyQSL service
     *
     * @param string $query - MySQL Query
     *
     * @return MySQL Object
     *    @aceess    private
     */
    private function _run($query)
    {
        $return = mysql_query($query, $this->connection_mysql);
        $this->last_query = $query;
        //echo $query;
        if (mysql_error()) {
            echo $query."<br>";
            echo "<b>".mysql_error()."</b><br>";
        }
        return $return;
    }
    
    //** Functions **//
    /**
     *    checks the output of a MySQL query
     *
     * @param object $result MySQL Object
     *
     * @return MySQL Object
     *    @aceess    public
     */
    private function resultCheck($result)
    {
        if (!$result || (mysql_num_rows($result) < 1)) {
            return null;
        }
        return $result;
    }

    /**
     * cleans all values of SQL injections
     *

     * @param array $array array of values to interact with the DB
     *
     * @return array of cleaned values
     * @aceess public
     */
    private function cleanArray($array)
    {
        //print_r($array);
        $array = array_map('trim', $array);
        $array = array_map('stripslashes', $array);
        $array = array_map('mysql_real_escape_string', $array);
        return $array;
    }

    /**
     *  makes a unique ID fron N INT
     *  used as ID in shared tables between two objs
     *  ie table with user_ID, friend_ID for chat threads, friending, etc
     *  use: list(user_ID, $friend_ID) = $this->db->sort($user_ID_1, $user_ID_2);
     * 
     * @param integer $
     *
     * @return Array of Ints
     * @aceess    public
     */
    public function sort() {
	
		//$numargs = func_num_args();
		$arg_list = func_get_args();
	    sort($arg_list, SORT_NUMERIC);
	    
		return $arg_list;
    }
    
    /**
     * Custom Query
     * runs a templates written query
     *
     * @param string $query       MySQL Query
     * @param array  $value_array replace {{$key}} with $value in custom query
     *
     * @return object $object MySQL Object
     * @aceess    public
     */
    function query($query, $value_array = NULL)
    {
		if ($value_array && is_array($value_array)) {
			$value_array = $this->cleanArray($value_array);
            $query = preg_replace("/{{([\w]+)}}/e", "\$value_array['\\1']", $query);
            /*foreach ($value_array as $key => $value) {
                $query = preg_replace("/{{".$key."}}/i", $value, $query);
            }*/
        }
        
        $select = (substr($query, 0, 6) == 'SELECT');
        $result = $this->_run($query);
        $result = ($select)?$this->resultCheck($result):$result;
        return $result;
    }
    
    /**
     * Fetch next row as Array
     * cast number strings to number objects
     *
     * @param object $results       MySQL Results Object
     *
     * @return object $result Array
     * @aceess    public
     */
    function fetch_array($results, $ignore = array())
    {
	    $result = mysql_fetch_array($results);
	    
	    // cast numbers
	    if (is_array($ignore) && is_array($result)) {
		    for ($i = count($result)-1; $i >= 0; $i--) {
			    if (isset($result[$i]) && !in_array($i, $ignore) && is_numeric($result[$i])) $result[$i] += 0;
		    }
	    }
	    
	    return $result;
    }
    
    /**
     * Fetch next row as Key-Value Array
     * cast number strings to number objects
     *
     * @param object $results       MySQL Results Object
     * @param array $ignore       Array of fields to ignore, or false to not cast
     *
     * @return object $result Array
     * @aceess    public
     */
    function fetch_assoc($results, $ignore = array())
    {
	    $result = mysql_fetch_assoc($results);
	    
	    // cast numbers
	    if (is_array($ignore) && is_array($result)) {
		    foreach ($result as $key => $value) {
			    if (!in_array($key, $ignore) && is_numeric($value)) $result[$key] += 0;
		    }
	    }
	    
	    return $result;
    }
    
    /**
     * Get the number of rows related to last SELECT
     *
     * @param object $results       MySQL Results Object
     *
     * @return number of rows
     * @aceess    public
     */
    function num_rows($results)
    {
	    return ($results) ? mysql_num_rows($results) : 0;
    }
    
    /**
     * Select Query
     *
     * @param string $table        table where rows will be deleted
     * @param array  $where_array  `$key` = $value WHERE parameters
     * @param array  $select_array `$key` = $value SELECT parameters
     * @param array  $order_array  `$key` = $value ORDER BY parameters
     *
     * @return ID of affected row
     * @access public
     */
    function select($table, $where_array = null, $select_array = null, $order_array = null)
    {
        $where = $this->array_to_string($where_array, "AND");
        $where = ($where)?"WHERE ".$where:'';
        
        $select = $this->array_to_string($select_array, ",");
        $select = ($select)?$select:'*';
        
        $order = $this->array_to_string($order_array, ",");
        $order = ($order)?"ORDER BY ".$order:'';

        $query = "SELECT $select FROM `$table` $where $order";
        $result = $this->_run($query);
        $result = $this->resultCheck($result);
        return $result;
    }

    /**
     * Insert Query
     *
     * @param string $table        table where rows will be deleted
     * @param array  $set_array    `$key` = $value SET parameters
     *
     * @return Primary Key of affected row or false if exisits
     * @access public
     */
    function insert($table, $set_array)
    {
        $set = $this->array_to_string($set_array, ",", true);
        $set = ($set)?"SET ".$set:'';
        
        /*$set = '';
        if ($set_array && is_array($set_array)) {
            $set_array = $this->cleanArray($set_array);
            foreach ($set_array as $key => $value) {
                $set .= ($set)?", ":'';
                $set .= "`$key` = '$value' ";
            }
            $set = ($set)?"SET ".$set:'';
        }*/

        $query = "INSERT INTO `$table` $set";
        $this->_run($query);
        return mysql_insert_id();
    }

    /**
     * Insert On Duplicate Key Update Query
     *
     * @param string $table        table where rows will be deleted
     * @param array  $set_array    `$key` = $value SET parameters
     * @param array  $update_array `$key` = $value ON DUPLICATE UPDATE parameters
     *
     * @return ID of affected row
     * @access public
     */
    function insert_update($table, $set_array, $update_array = null)
    {
        $set = $this->array_to_string($set_array, ",", true);
        
        $update = $this->array_to_string($update_array, ",", true);
        $update = ($update) ? $update : $set;
        
        $set = ($set) ? "SET ".$set : '';
        $update = ($update) ? "ON DUPLICATE KEY UPDATE ".$update : "";
        
        /*$set = '';
        $update = '';
        if ($set_array && is_array($set_array)) {
            $set_array = $this->cleanArray($set_array);
            foreach ($set_array as $key => $value) {
                $set .= ($set)?", ":'';
                $set .= "`$key` = '$value' ";
            }
        }
        if ($update_array && is_array($update_array)) {
            $update_array = $this->cleanArray($update_array);

            foreach ($update_array as $key => $value) {
                $update .= ($update)?", ":'';
                $update .= "`$key` = '$value' ";
            }
        } else {
            $update = $set;
        }
        
        $set = ($set)?"SET ".$set:'';
        $update = ($update)?"ON DUPLICATE KEY UPDATE ".$update:'';*/

        $query = "INSERT INTO `$table` $set $update";
        $this->_run($query);
        return mysql_insert_id();
    }

    /**
     * Update Query
     *
     * @param string $table       table where rows will be deleted
     * @param array  $set_array   `$key` = $value SET parameters
     * @param array  $where_array `$key` = $value WHERE parameters
     *
     * @return number of affected rows
     * @access public
     */
    function update($table, $set_array, $where_array)
    {
        $set = $this->array_to_string($set_array, ",", true);
        $set = ($set)?"SET ".$set:'';
        
        $where = $this->array_to_string($where_array, "AND");
        $where = ($where)?"WHERE ".$where:'';
        
        /*$set = '';
        if ($set_array && is_array($set_array)) {
            $set_array = $this->cleanArray($set_array);
            foreach ($set_array as $key => $value) {
                $set .= ($set)?", ":'';
                $set .= "`$key` = '$value' ";
            }
            $set = ($set)?"SET ".$set:'';
        }

        $where = '';
        if ($where_array && is_array($where_array)) {
            $where_array = $this->cleanArray($where_array);
            foreach ($where_array as $key => $value) {
                $where .= ($where)?"AND ":'';
                $where .= "`$key` = '$value' ";
            }
            $where = ($where)?"WHERE ".$where:'';
        }*/

        $query = "UPDATE `$table` $set $where";
        $this->_run($query);
        return mysql_affected_rows();
    }

    /**
     * Delete Query
     *
     * @param string $table       table where rows will be deleted
     * @param array  $where_array array of `$key` = $value parameters
     *
     * @return number of affected rows
     * @access public
     */
    function delete($table, $where_array)
    {
        $where = $this->array_to_string($where_array, "AND", true);
        $where = ($where)?"WHERE ".$where:'';
        
        $query = "DELETE FROM `$table` $where";
        $this->_run($query);
        return mysql_affected_rows();
    }
    
    private function array_to_string($array = array(), $sep = ",", $key_value = false) {
	    $string = '';
	    if (is_array($array)) {
            $array = $this->cleanArray($array);
            foreach ($array as $key => $value) {
                $string .= ($string)?"$sep ":'';
                if ($key_value || $sep == "AND" || $sep == "OR") {
                	$string .= "`$key` = '$value' ";
                } else {
                	$string .= $value;
                }
            }
        }
        return $string;
    }

};

$database = new MySQL;

?>
