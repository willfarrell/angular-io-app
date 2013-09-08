<?php

/**
 * redis Database Class
 *
 * PHP Version 5
 *
 * @category  N/A
 * @package   N/A
 * @author    will Farrell <will.farrell@gmail.com>
 * @copyright 2001 - 2012 willFarrell.ca
 * @license   http://www.opensource.org/licenses/mit-license.html  MIT License
 * @version   GIT: <git_id>
 * @link      http://willFarrell.ca
 */

require_once dirname(__FILE__).'/vendor/predis/predis/autoload.php'; // https://github.com/nrk/predis
Predis\Autoloader::register();

/**
 * Database
 *
 * @category  N/A
 * @package   N/A
 * @author    Original Author <author@example.com>
 * @author    Another Author <another@example.com>
 * @copyright 2001 - 2011 willFarrell.ca
 * @license   http://www.opensource.org/licenses/mit-license.html  MIT License
 * @version   Release: <package_version>
 * @link      http://willFarrell.ca
 */

class Cache
{
    private $_connection; //The redis database connection
    private $_database;
    private $_prefix;
	
    /**
     * Constructor
	 * prefix in the form of 'prefix:'
	 *
	 * @param string $prefix
	 * @param string $type Cache to use. redis, memcached, json?
     */
    function __construct($prefix = '', $type = 'redis', $config = array())
    {
    	global $database;
    	$this->_database = $database;
    	$this->_prefix = $prefix;
    	try {
			if ($type == 'redis') {
				/*$this->_connection = new Predis\Client(
					array(
						'host' => '127.0.0.1',
						'port' => 6379
					),
					array('prefix' => $prefix.":")
				);*/
				throw new Exception("Redis not included yet");
			} else if ($type == 'memcached') {
				/*$this->connection = new Predis\Client(
					array(
						'host' => '127.0.0.1',
						'port' => 6379
					),
					array('prefix' => $prefix)
				);*/
				throw new Exception("Memcached not included yet");
			} else if ($type == 'json') {
				
				throw new Exception("JSON not included yet");
			}
    	} catch (Exception $e) {
	    	if ($this->_prefix) {
			    $query = "CREATE TABLE IF NOT EXISTS `cache_".$this->_prefix."` (`key` VARCHAR(64) NULL ,`value` TEXT NULL ) ENGINE = InnoDB";
				$this->_database->query($query);
			}
    	}
    }

    /**
     * Destructor
     */
    function __destruct()
    {
        
    }
    
    //-- Generic --//
    // http://redis.io/commands#generic
    function del($key)
    {
        try {
        	//return $this->_connection->del($key);
        	throw new Exception("del not connected");
    	} catch (Exception $e) {
    		return $this->_database->delete('cache_'.$this->_prefix, array('key' => $key));
    	}
    	return TRUE;
    }
    
    //-- String --//
    // http://redis.io/commands#string
	
	/*function mget($key_array = array())
    {
        return json_decode($this->_connection->get($key));
    }*/
    function get($key)
    {
    	$keys = explode(".", $key);
        try {
        	//$res = $this->_connection->get($keys[0]);
        	throw new Exception("get not connected");
    	} catch (Exception $e) {
	        $db = $this->_database->select('cache_'.$this->_prefix, array('key' => $key));
        	if (!$db) { return; }
        	$ret = $this->_database->fetch_assoc($db);
        	$res = $ret['value'];
    	}
    	
        $data = json_decode($res, true);
        
        for ($i = 1, $l = sizeof($keys); $i < $l; $i++) {
        	if (!isset($data[$keys[$i]])) return NULL;
	        $data = $data[$keys[$i]];
        }
        
        return $data;
        //$this->_database->delete('redis_'.$_prefix, array('key' => $key));
    }
    
    /*function mset($key_value_array = array())
    {
        return $this->_connection->set($key, json_encode($value));
    }*/
    function set($key, $value = NULL)
    {
    	//$keys = explode(".", $key);
    	// TODO add sublevel set?
    	try {
        	//return $this->_connection->set($key, json_encode($value));
        	throw new Exception("set not connected");
    	} catch (Exception $e) {
        	$this->_database->insert_update(
        		'cache_'.$this->_prefix,
        		array('key' => $key, 'value' => json_encode($value))
        	);
    	}
    	return TRUE;
    }
    
    //-- Hash --//
    // http://redis.io/commands#hash
    
    /*function hgetall($hash_key)
    {
        $object = $this->_connection->hgetall($hash_key);
        foreach ($object as $key => $value) {
	        $object[$key] = json_decode($value);
        }
        return $object;
    }*/
    
    /*function hmget($hash_key, $field_array = array())
    {
        $object = $this->_connection->hmget($hash_key);
        foreach ($object as $key => $value) {
	        $object[$key] = json_decode($value);
        }
        return $object;
    }*/
    
    /*function hget($hash_key, $field)
    {
        return json_decode($this->_connection->hget($hash_key, $field));
    }
    
    function hmset($hash_key, $field_value_array = array())
    {
        foreach ($field_value_array as $key => $value) {
	        $this->hset($hash_key, $key, $value);
        }
        return;
    }
    
    function hset($hash_key, $field, $value)
    {
        return $this->_connection->hset($hash_key, $field, json_encode($value));
    }*/
};

?>