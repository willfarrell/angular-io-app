<?php
/**

All ini_set should be placed in php.ini and removed from this doc

Resources:
scrypt - https://github.com/DomBlack/php-scrypt

PECL:
pecl install gnupg # class.notify.php
pecl install scrypt # class.password.php

# geoip tidy
*/

/*
$localhost = ($_SERVER &&
	($_SERVER["REMOTE_ADDR"] === "127.0.0.1"
	|| strpos($_SERVER["HTTP_HOST"], "localhost") !== false
	|| strpos($_SERVER["HTTP_HOST"], "192.168") !== false)
	);
*/
// CORS
//header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-Access-Token, X-PINGOTHER");

// DEV / DEBUGING
error_reporting(E_ALL); // 0 or E_ALL
define("CONSOLE_FILE", TRUE);
define("CONSOLE_FIREPHP", TRUE);
define("CONSOLE_CHROMELOGGER", TRUE);
//define("TIMERS_FILE", FALSE);

ignore_user_abort(true); // Sets whether a client disconnect should cause a script to be aborted.
set_time_limit(60); // number of seconds a script is allowed to run - If set to zero, no time limit is imposed.
//ini_set('max_execution_time', 86400);

// Set server default time to UTC, it's a life saver. seriously
date_default_timezone_set("UTC");

// Overwrite if used with cloud flare
$_SERVER['REMOTE_ADDR'] = getenv("HTTP_CF_CONNECTING_IP")
	? getenv("HTTP_CF_CONNECTING_IP")
	: getenv("HTTP_X_FORWARDED_FOR")
		? getenv("HTTP_X_FORWARDED_FOR")
		: getenv("REMOTE_ADDR");

//-- Session Class --//
define("SESSION_EXPIRE", 86400*30); // max session length from last server interaction. Requires "remember" at login
ini_set('session.use_cookies', 1);
ini_set('session.use_only_cookies', 1);
ini_set("session.name", "PHPSESSID");
ini_set("session.cookie_lifetime", 60*60*24*30); // gets overwritten when "remember" is not checked
ini_set("session.cookie_path", "/");
ini_set("session.cookie_domain", ""); // getenv("HTTP_HOST")
ini_set("session.cookie_secure", (getenv("HTTPS") == "on"));
ini_set("session.cookie_httponly", TRUE);
if (in_array('sha512', hash_algos())) {
	ini_set('session.hash_function', 'sha512');
}
ini_set('session.hash_bits_per_character', 5);

//define("REQUIRE_EMAIL_CONFIRM", FALSE);

//-- Password Class --//
define("PASSWORD_RESET_LENGTH", 3600);	// The time one has to reset their password in seconds (1 hour)

//-- Password Hashing --//
define("PASSWORD_HASH", 		"bcrypt");	// PBKDF2, bcrypt, scrypt (recommended)
define("PASSWORD_SALT", 		"");		// Added to password (Stored in Code - same for all)
//define("PASSWORD_PEPPER", 	FALSE);		// Added to password (Stored in other DB/cache)
//define("PASSWORD_CAYENNE",	FALSE);		// Added to password (Stored in File)
//define("PASSWORD_NONCE", 		TRUE);		//

// PBKDF2 - Require NIST compliance [https://github.com/P54l0m5h1k/PBKDF2-implementation-PHP]
define("PBKDF2_SALT", 		"");
define("PBKDF2_BINARY", 	TRUE);		// generate binary data, or base64 encoded string
define("PBKDF2_ITERATIONS", 10000);		// how many iterations to perform 10,000+ (2012)
define("PBKDF2_KEY_LENGTH", 32);		// key length
define("PBKDF2_ALGORITHM", 	"sha512");	// hashing algorithm (sha-256, sha-512)

// bcrypt - easy to implement [https://gist.github.com/1053158]
define("BCRYPT_WORK_FACTOR",10);		// work_factor (4 - 31) [http://wildlyinaccurate.com/bcrypt-choosing-a-work-factor]

// scrypt - longest to break (2012-10), requires extra work server side to implement [https://github.com/DomBlack/php-scrypt]
define("SCRYPT_SALT", 		NULL);		// NULL to grenerate random
define("SCRYPT_PEPPER", 	"");		//
define("SCRYPT_SALT_LENGTH",8);			// The length of the salt
define("SCRYPT_KEY_LENGTH", 32);		// The key length
define("SCRYPT_CPU", 		16384);		// The CPU difficultly (must be a power of 2,  > 1) pow(2,14)
define("SCRYPT_MEMORY", 	8);			// The memory difficultly
define("SCRYPT_PARALLEL", 	1);			// The parallel difficultly


//-- Database Class --//
define("DB_SERVER","localhost");
define("DB_NAME","angular_db");
define("DB_USER","angular_user");
define("DB_PASS","angular1234");

define("STRIPE_API_SECRET_KEY", "");
//define("STRIPE_API_PUBLIC_KEY", ""); // in scripts/async.js

//-- Notify Class --//
// move to config.notify.json
define("NOTIFY_FROM_NAME", 	"Angular.io");
define("NOTIFY_FROM_EMAIL", "will.farrell@gmail.com");
define("NOTIFY_FROM_NUMBER","");	// assigned by SMS service
define("NOTIFY_FROM_URL", 	"http://app.angulario.com/");

//-- Email --//
define("EMAIL_ADMIN_EMAIL",	"will.farrell@gmail.com");//"will@angular.io");
define("EMAIL_ADDRESS",		"1 Young St., Toronto, Ontario, Canada, M5E 2A3"); // Address is required to help keep stay out of the spam folder
define("EMAIL_SIGNATURE",	"\n\nKind Regards,\n\nwill Farrell\nwill@angulario.com\nhttps://angulario.com");
define("EMAIL_FOOTER",		"\n\n".EMAIL_ADDRESS."\nUpdate preferences at: {{global:site_url}}#/settings/notifications\n\nThis action was requested from {{_SERVER:REMOTE_ADDR}}.");
// AWS SES
define("EMAIL_AWS_APIKEY", 	"");
// mailgun
define("EMAIL_MAILGUN_APIKEY", "");
define("EMAIL_MAILGUN_DOMAIN", "");


//-- SMS --//
// AWS SNS
define("SMS_AWS_APIKEY", 	"");
// nexmo
define("SMS_NEXMO_APIKEY", 	"");
define("SMS_NEXMO_APISECRET", "");
// twilio
define("SMS_TWILIO_APIKEY", "");


//-- Filepicker --//

//-- AWS --//


?>
