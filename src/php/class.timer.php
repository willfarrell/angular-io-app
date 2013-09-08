<?php

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
	public static function start() {
		self::$start_time = self::now();
		self::$pause_time = 0;
	}

	/**
	 * pause the timer
	 *
	 * @return void
	 */
	public static function pause() {
		$now = self::now();
		if (!self::$start_time) { self::$start_time = $now; }
		self::$pause_time = $now;
	}

	/**
	 * unpause the timer
	 *
	 * @return void
	 */
	public static function unpause() {
		$now = self::now();
		if (!self::$start_time) { self::$start_time = $now; }
		if (!self::$pause_time) { self::$pause_time = $now; }
		self::$start_time += ($now - self::$pause_time);
		self::$pause_time = 0;
	}

	/**
	 * stop the timer
	 *
	 * @return void
	 */
	public static function stop() {
		$now = self::now();
		if (!self::$start_time) { self::$start_time = $now; }
		self::$stop_time = $now;
		self::$duration = self::$stop_time - self::$start_time;
		self::$start_time = 0;
	}

	/**
	 * duration the timer
	 *
	 * @return float
	 */
	public static function duration() {
		self::$duration = (self::$stop_time ? self::$stop_time : 0) - self::$start_time;
		return self::$duration;
	}

	/**
	 * get the current timer value
	 *
	 * @return float
	 */
 	public static function get($decimals = 8) {
		return round((self::now() - self::$start), $decimals);
	}

	/**
	 * format the time in seconds
	 *
	 * @return float
	 */
	public static function now() {
		list($usec,$sec) = explode(' ', microtime());
		return ((float)$usec + (float)$sec);
	}
	
	/**
	 * Formats the elapsed time as a string.
	 *
	 * @param  float $time
	 * @return string
	 */
	public static function secondsToTimeString($time)
	{
		$ms = round($time * 1000);

		foreach (self::$times as $unit => $value) {
			if ($ms >= $value) {
				$time = floor($ms / $value * 100.0) / 100.0;
				return $time . ' ' . ($time == 1 ? $unit : $unit . 's');
			}
		}

		return $ms . ' ms';
	}

	/**
	 * Formats the elapsed time since the start of the request as a string.
	 *
	 * @return string
	 */
	public static function timeSinceStartOfRequest()
	{
		return self::secondsToTimeString(microtime(TRUE) - self::$requestTime);
	}

	/**
	 * Returns the resources (time, memory) of the request as a string.
	 *
	 * @return string
	 */
	public static function resourceUsage()
	{
		return sprintf(
		  'Time: %s, Memory: %4.2fMb',
		  self::timeSinceStartOfRequest(),
		  memory_get_peak_usage(TRUE) / 1048576
		);
	}
}

?>