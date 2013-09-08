<?php

// TODO replace timer with https://github.com/sebastianbergmann/php-timer/ ??

/*

Add a timer for nested events

If negative min value, you forgot to place a stop call

*/

require_once 'class.timer.php';

class Timers {
	static $id = "";
	static $timers = array();
	static $counter = 0;
	
	/**
	 * Constructs a Timers object.
	 */
	function __construct($id="") {
		self::$id = $id;
	}
	
	/**
	 * Destructs a Timers object.
	 *
	 * @return void
	 */
	function __destruct() {
		// print to log files
		if (TIMERS_FILE) {
			$data = json_encode(self::$results_all());
			if ($data != "[]") {
				$file = $_SERVER['DOCUMENT_ROOT'].'/timers.txt';
				file_put_contents($file, "\n".$_SERVER['REQUEST_TIME']." (".date('r', $_SERVER['REQUEST_TIME']).")\n", FILE_APPEND);
				file_put_contents($file, $data, FILE_APPEND);
			}
		}
	}
	
	/**
	 * start the timer
	 *
	 * @param string $id
	 * @return void
	 */
	public static function start($id=NULL) {
		if ($id==NULL) { $id = self::$id; }
		if (isset(self::$timers[$id])) {
			self::$timers[$id]['count']++;
		} else {
			self::$timers[$id] = array(
				'timer' => array(),
				'count' => 0,
			);
		}

		self::$timers[$id]['timer'][self::$timers[$id]['count']] = new Timer;
		self::$timers[$id]['timer'][self::$timers[$id]['count']]->start();
	}

	/**
	 * pause the timer
	 *
	 * @param string $id
	 * @return void
	 */
	public static function pause($id=NULL) {
		if ($id==NULL) $id = self::$id;
		self::$timers[$id]['timer'][self::$timers[$id]['count']]->pause();
	}

	/**
	 * unpause the timer
	 *
	 * @param string $id
	 * @return void
	 */
	public static function unpause($id=NULL) {
		if ($id==NULL) $id = self::$id;
		self::$timers[$id]['timer'][self::$timers[$id]['count']]->unpause();
	}

	/**
	 * stop the timer
	 *
	 * @param string $id
	 * @return void
	 */
	public static function stop($id=NULL) {
		if ($id==NULL) $id = self::$id;
		self::$timers[$id]['timer'][self::$timers[$id]['count']]->stop();
	}
	
	/**
	 * return results for an id
	 *
	 * @param string $id
	 * @return array
	 */
	public static function results($id=NULL) {
		if ($id==NULL) $id = self::$id;

		$results = array();
		$array_size = count(self::$timers[$id]['timer']);
		for($i = 0; $i < $array_size; $i++) {
			$results[$i] = self::$timers[$id]['timer'][$i]->duration();
		}

		$return = array();
		$return['total'] = array_sum($results);
		$return['min'] = min($results);
		$return['max'] = max($results);
		$return['avg'] = $return['total'] / $array_size;
		
		return $return;
	}
	
	/**
	 * return all ID results
	 *
	 * @return array
	 */
	public static function results_all() {
		$results = array();
		foreach (self::$timers as $key => $value) {
			$results[$key] = self::$results($key);
		}
		return $results;
	}
	
	/**
	 * return all ID results as string
	 *
	 * @param string $id
	 * @return string
	 */
	public static function print_results($id = NULL) {
		if ($id) $results = self::$results($id);
		else $results = self::$results_all();
		
		echo "\n=== Timings ===\n";
		echo "ID\t\tavg\tmin\tmax\ttotal\n";
		
		foreach($results as $key => $value) {
			echo "$key\t\t"
				.number_format($value['avg'], 3)."s\t"
				.number_format($value['min'], 3)."s\t"
				.number_format($value['max'], 3)."s\t"
				.number_format($value['total'], 3)."s\n";
		}
	}

	/**
	 * clear id
	 *
	 * @param string $id
	 * @return void
	 */
	public static function clear($id=NULL) {
		if ($id==NULL) $id = self::$id;
		unset(self::$timers[$id]);
	}
	
	/**
	 * clear all ids
	 *
	 * @return void
	 */
	public static function clear_all() {
		unset(self::$timers);
	}
}

?>