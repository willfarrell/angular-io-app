<?php

/*

Add a timer for nested events

If negative min value, you forgot to place a stop call

*/
class Timers {
	var $id = "";
	var $timers = array();
	var $counter = 0;

	function __construct($id="") {
		$this->id = $id;
	}

	function __destruct() {
		// print to log files
		/*$data = json_encode($this->results_all());
		if ($data != "[]") {
			$file = $_SERVER['DOCUMENT_ROOT'].'/timers.txt';
			file_put_contents($file, "\n".$_SERVER['REQUEST_TIME']." (".date('r', $_SERVER['REQUEST_TIME']).")\n", FILE_APPEND);
			file_put_contents($file, $data, FILE_APPEND);
		}*/
	}

	/*  start the timer  */
	function start($id=NULL) {
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

	/*  pause the timer  */
	function pause($id=NULL) {
		if ($id==NULL) $id = $this->id;
	    $this->timers[$id]['timer'][$this->timers[$id]['count']]->pause();
	}

	/*  unpause the timer  */
	function unpause($id=NULL) {
		if ($id==NULL) $id = $this->id;
	    $this->timers[$id]['timer'][$this->timers[$id]['count']]->unpause();
	}

	/*  stop the timer  */
	function stop($id=NULL) {
		if ($id==NULL) $id = $this->id;
	    $this->timers[$id]['timer'][$this->timers[$id]['count']]->stop();
	}

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

	function results_all() {
		$results = array();
		foreach ($this->timers as $key => $value) {
			$results[$key] = $this->results($key);
		}
		return $results;
	}
	
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

	function clear($id=NULL) {
		if ($id==NULL) $id = $this->id;
		unset($this->timers[$id]);
	}

	function clear_all() {
		unset($this->timers);
	}
}

// source http://davidwalsh.name/php-timer-benchmark
// duration added by will Farrell
class Timer {

	function __construct() {

	}

	function __destruct() {

	}

	/*  start the timer  */
	function start() {
	    $this->start_time = $this->get_time();
	    $this->pause_time = 0;
	}

	/*  pause the timer  */
	function pause() {
	    $this->pause_time = $this->get_time();
	}

	/*  unpause the timer  */
	function unpause() {
	    $this->start_time += ($this->get_time() - $this->pause_time);
	    $this->pause_time = 0;
	}

	/*  stop the timer  */
	function stop() {
	    $this->stop_time = $this->get_time();
	    //return $this->stop_time;
	}

	/*  duration the timer  */
	function duration() {
	    $this->duration = (isset($this->stop_time) ? $this->stop_time : 0) - $this->start_time;
	    return $this->duration;
	}

	/*  get the current timer value  */
  	function get($decimals = 8) {
	    return round(($this->get_time() - $this->start),$decimals);
	}

	/*  format the time in seconds  */
	function get_time() {
	    list($usec,$sec) = explode(' ', microtime());
	    return ((float)$usec + (float)$sec);
    }
}

$timer = new Timers;

?>
