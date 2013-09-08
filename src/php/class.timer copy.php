<?php

// TODO replace timer with https://github.com/sebastianbergmann/php-timer/ ??

/*

Add a timer for nested events

If negative min value, you forgot to place a stop call

*/

class Timers {
	var $id = "";
	var $timers = array();
	var $counter = 0;
	
	/**
	 * Constructs a Timers object.
	 */
	function __construct($id="") {
		$this->id = $id;
	}
	
	/**
	 * Destructs a Timers object.
	 *
	 * @return void
	 */
	function __destruct() {
		// print to log files
		if (TIMERS_FILE) {
			$data = json_encode($this->results_all());
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
	public function start($id=NULL) {
		if ($id==NULL) $id = $this->id;
		if (isset($this->timers[$id])) {
			$this->timers[$id]['count']++;
		} else {
			$this->timers[$id] = array(
				'timer' => array(),
				'count' => 0,
			);
		}

		$this->timers[$id]['timer'][$this->timers[$id]['count']] = new Timer;
		$this->timers[$id]['timer'][$this->timers[$id]['count']]->start();
	}

	/**
	 * pause the timer
	 *
	 * @param string $id
	 * @return void
	 */
	public function pause($id=NULL) {
		if ($id==NULL) $id = $this->id;
		$this->timers[$id]['timer'][$this->timers[$id]['count']]->pause();
	}

	/**
	 * unpause the timer
	 *
	 * @param string $id
	 * @return void
	 */
	public function unpause($id=NULL) {
		if ($id==NULL) $id = $this->id;
		$this->timers[$id]['timer'][$this->timers[$id]['count']]->unpause();
	}

	/**
	 * stop the timer
	 *
	 * @param string $id
	 * @return void
	 */
	public function stop($id=NULL) {
		if ($id==NULL) $id = $this->id;
		$this->timers[$id]['timer'][$this->timers[$id]['count']]->stop();
	}
	
	/**
	 * return results for an id
	 *
	 * @param string $id
	 * @return array
	 */
	function results($id=NULL) {
		if ($id==NULL) $id = $this->id;

		$results = array();
		$array_size = count($this->timers[$id]['timer']);
		for($i = 0; $i < $array_size; $i++) {
			$results[$i] = $this->timers[$id]['timer'][$i]->duration();
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
	function results_all() {
		$results = array();
		foreach ($this->timers as $key => $value) {
			$results[$key] = $this->results($key);
		}
		return $results;
	}
	
	/**
	 * return all ID results as string
	 *
	 * @param string $id
	 * @return string
	 */
	function print_results($id = NULL) {
		if ($id) $results = $this->results($id);
		else $results = $this->results_all();
		
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
	function clear($id=NULL) {
		if ($id==NULL) $id = $this->id;
		unset($this->timers[$id]);
	}
	
	/**
	 * clear all ids
	 *
	 * @return void
	 */
	function clear_all() {
		unset($this->timers);
	}
}

// source http://davidwalsh.name/php-timer-benchmark
// duration added by will Farrell
class Timer {
	
	private static $start_time = 0;
	private static $pause_time = 0;
	private static $stop_time = 0;
	private static $duration = 0;
	
	/**
	 * start the timer
	 *
	 * @return void
	 */
	function start() {
		$this->start_time = $this->now();
		$this->pause_time = 0;
	}

	/**
	 * pause the timer
	 *
	 * @return void
	 */
	function pause() {
		
		$this->pause_time = $this->now();
	}

	/**
	 * unpause the timer
	 *
	 * @return void
	 */
	function unpause() {
		$this->start_time += ($this->now() - $this->pause_time);
		$this->pause_time = 0;
	}

	/**
	 * stop the timer
	 *
	 * @return void
	 */
	function stop() {
		$this->stop_time = $this->now();
		//return $this->stop_time;
	}

	/**
	 * duration the timer
	 *
	 * @return decimal
	 */
	function duration() {
		$this->duration = (isset($this->stop_time) ? $this->stop_time : 0) - $this->start_time;
		return $this->duration;
	}

	/**
	 * get the current timer value
	 *
	 * @return decimal
	 */
 	function get($decimals = 8) {
		return round(($this->now() - $this->start),$decimals);
	}

	/**
	 * format the time in seconds
	 *
	 * @return int
	 */
	function now() {
		list($usec,$sec) = explode(' ', microtime());
		return ((float)$usec + (float)$sec);
	}
}

?>