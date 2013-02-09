<?php


// CORS
//header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-Access-Token, X-PINGOTHER");


error_reporting(E_ALL|E_STRICT);

ignore_user_abort(true); // Sets whether a client disconnect should cause a script to be aborted.
set_time_limit(30); // number of seconds a script is allowed to run - If set to zero, no time limit is imposed.

// ini set
	// prevent Img API memory issue

// Set server default time to UTC, it's a life saver. seriously
date_default_timezone_set('UTC');

$localhost = ($_SERVER &&
	($_SERVER['REMOTE_ADDR'] == '127.0.0.1'
	|| strpos($_SERVER['REMOTE_ADDR'], '192.168') !== false
	|| strpos($_SERVER['HTTP_HOST'], 'localhost') !== false
	|| strpos($_SERVER['HTTP_HOST'], '192.168') !== false));

//-- Session --//
// Cookie Variables
//if (!defined("SESSION_EXPIRE")) 		define("SESSION_EXPIRE", 	60); // 1min	how frequently to rotate session id ** not active
if (!defined("COOKIE_EXPIRE")) 			define("COOKIE_EXPIRE", 	60*60*24*14); // 2h
if (!defined("COOKIE_EXPIRE_REMEMBER")) define("COOKIE_EXPIRE_REMEMBER", 	60*60*24*14); // 2 weeks
if (!defined("COOKIE_PATH")) 			define("COOKIE_PATH", 		"/");
if (!defined("COOKIE_DOMAIN")) 			define("COOKIE_DOMAIN", 	getenv('HTTP_HOST'));//(getenv('HTTP_HOST') != 'localhost') ? getenv('HTTP_HOST') : NULL);
if (!defined("COOKIE_SECURE")) 			define("COOKIE_SECURE", 	(getenv("HTTPS") == "on"));
if (!defined("COOKIE_HTTPONLY")) 		define("COOKIE_HTTPONLY", 	TRUE);

//-- Password --//
if (!defined("PASSWORD_HASH")) 		define("PASSWORD_HASH", 	"bcrypt");	// PBKDF2, bcrypt, scrypt (recommended)
if (!defined("PASSWORD_SALT")) 		define("PASSWORD_SALT", 	'');		// Added to password (Stored in Code - same for all)
//if (!defined("PASSWORD_PEPPER")) 	define("PASSWORD_PEPPER", 	FALSE);		// Added to password (Stored in DB)
//if (!defined("PASSWORD_CAYENNE")) define("PASSWORD_CAYENNE", 	FALSE);		// Added to password (Stored in File)
//if (!defined("PASSWORD_NONCE")) define("PASSWORD_NONCE", 	TRUE);

// PBKDF2 - Require NIST compliance [https://github.com/P54l0m5h1k/PBKDF2-implementation-PHP]
if (!defined("PBKDF2_SALT")) 		define("PBKDF2_SALT", 		'');
if (!defined("PBKDF2_BINARY")) 		define("PBKDF2_BINARY", 	TRUE);		// generate binary data, or base64 encoded string
if (!defined("PBKDF2_ITERATIONS")) 	define("PBKDF2_ITERATIONS", 10000);		// how many iterations to perform 10,000+ (2012)
if (!defined("PBKDF2_KEY_LENGTH")) 	define("PBKDF2_KEY_LENGTH", 32);		// key length
if (!defined("PBKDF2_ALGORITHM")) 	define("PBKDF2_ALGORITHM", 	'sha512');	// hashing algorithm (sha-256, sha-512)

// bcrypt - easy to implement [https://gist.github.com/1053158]
if (!defined("BCRYPT_WORK_FACTOR")) define("BCRYPT_WORK_FACTOR", 8);		// work_factor (4 - 31) [http://wildlyinaccurate.com/bcrypt-choosing-a-work-factor]

//scrypt - longest to break (2012-10), requires extra work server side to implement [https://github.com/DomBlack/php-scrypt]
if (!defined("SCRYPT_SALT")) 		define("SCRYPT_SALT", 		NULL);		// NULL to grenerate random
if (!defined("SCRYPT_PEPPER")) 		define("SCRYPT_PEPPER", 	'');		//
if (!defined("SCRYPT_SALT_LENGTH")) define("SCRYPT_SALT_LENGTH", 8);		// The length of the salt
if (!defined("SCRYPT_KEY_LENGTH")) 	define("SCRYPT_KEY_LENGTH", 32);		// The key length
if (!defined("SCRYPT_CPU")) 		define("SCRYPT_CPU", 		16384);		// The CPU difficultly (must be a power of 2,  > 1) pow(2,14)
if (!defined("SCRYPT_MEMORY")) 		define("SCRYPT_MEMORY", 	8);			// The memory difficultly
if (!defined("SCRYPT_PARALLEL")) 	define("SCRYPT_PARALLEL", 	1);			// The parallel difficultly


//-- Database --//
if ($localhost) {
	if (!defined("DB_SERVER")) define('DB_SERVER','localhost');
	if (!defined("DB_NAME")) define('DB_NAME','angular_db');
	if (!defined("DB_USER")) define('DB_USER','root');
	if (!defined("DB_PASS")) define('DB_PASS','localhost');
} else {
	if (!defined("DB_SERVER")) define('DB_SERVER','localhost');
	if (!defined("DB_NAME")) define('DB_NAME','angular_db');
	if (!defined("DB_USER")) define('DB_USER','angular_user');
	if (!defined("DB_PASS")) define('DB_PASS','angular1234');
}

//-- Notify --//

//-- Email --//
if (!defined("MAIL_ADMIN_EMAIL")) define('MAIL_ADMIN_EMAIL','will.farrell@gmail.com');//'will@angular.io');
if (!defined("MAIL_SIGNATURE")) define('MAIL_SIGNATURE',"\n\nKind Regards,\n\nwill Farrell\nwill@angulario.com\nhttps://angulario.com");
if (!defined("MAIL_SITE_NAME")) define('MAIL_SITE_NAME',"Angular.io");
if (!defined("MAIL_SITE_EMAIL")) define('MAIL_SITE_EMAIL',"will.farrell@gmail.com");
if (!defined("MAIL_SITE_URL")) define('MAIL_SITE_URL',"http://app.angulario.com/"); // trailing /

// mailgun
define('MAILGUN_APIKEY', "key-1d6to8lo6755xglfknbkhs4nzai4xo-4");
define('MAILGUN_DOMAIN', "angulario.mailgun.org");

//-- SMS --//

//-- Filepicker --//

//-- AWS --//


?>
