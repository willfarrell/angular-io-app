<?php

// RENAME this file. php/inc.config.sample.php -> php/inc.config.php

// Headers
header('Server: ');
header('X-Powered-By: ');
header('X-Content-Type-Options: nosniff');
header('X-XSS-Protection: 1; mode=block');

error_reporting(E_ALL|E_STRICT);

ignore_user_abort(true); // Sets whether a client disconnect should cause a script to be aborted.
set_time_limit(30); // number of seconds a script is allowed to run - If set to zero, no time limit is imposed.

// Set server default time, it's a life saver. seriously
date_default_timezone_set('UTC');

$localhost = ($_SERVER &&
	($_SERVER['REMOTE_ADDR'] == '127.0.0.1'
	|| strpos($_SERVER['REMOTE_ADDR'], '192.168') !== false
	|| strpos($_SERVER['HTTP_HOST'], 'localhost') !== false
	|| strpos($_SERVER['HTTP_HOST'], '192.168') !== false));

//-- Session --//
// Cookie Variables
//if (!defined("SESSION_EXPIRE")) 		define("SESSION_EXPIRE", 	60); // 1min	how frequently to rotate session id ** not active
if (!defined("COOKIE_EXPIRE")) 			define("COOKIE_EXPIRE", 	60*60*2); // 2h
if (!defined("COOKIE_EXPIRE_REMEMBER")) define("COOKIE_EXPIRE_REMEMBER", 	60*60*24*14); // 2 weeks
if (!defined("COOKIE_PATH")) 			define("COOKIE_PATH", 		"/");
if (!defined("COOKIE_DOMAIN")) 			define("COOKIE_DOMAIN", 	getenv('HTTP_HOST'));//(getenv('HTTP_HOST') != 'localhost') ? getenv('HTTP_HOST') : NULL);
if (!defined("COOKIE_SECURE")) 			define("COOKIE_SECURE", 	(getenv("HTTPS") == "on"));
if (!defined("COOKIE_HTTPONLY")) 		define("COOKIE_HTTPONLY", 	true);

//-- Password --//
if (!defined("PASSWORD_HASH")) 		define("PASSWORD_HASH", 	"scrypt");	// PBKDF2, bcrypt, scrypt
if (!defined("PASSWORD_SALT")) 		define("PASSWORD_SALT", 	'');		// Added to password (Stored in Code - same for all)
//if (!defined("PASSWORD_PEPPER")) 	define("PASSWORD_PEPPER", 	FALSE);		// Added to password (Stored in DB)
//if (!defined("PASSWORD_CAYENNE")) define("PASSWORD_CAYENNE", 	FALSE);		// Added to password (Stored in File)

// PBKDF2 - Require NIST compliance [https://github.com/P54l0m5h1k/PBKDF2-implementation-PHP]
if (!defined("PBKDF2_SALT")) 		define("PBKDF2_SALT", 		'');
if (!defined("PBKDF2_BINARY")) 		define("PBKDF2_BINARY", 	true);		// generate binary data, or base64 encoded string
if (!defined("PBKDF2_ITERATIONS")) 	define("PBKDF2_ITERATIONS", 10000);		// how many iterations to perform 10,000+ (2012)
if (!defined("PBKDF2_KEY_LENGTH")) 	define("PBKDF2_KEY_LENGTH", 32);		// key length
if (!defined("PBKDF2_ALGORITHM")) 	define("PBKDF2_ALGORITHM", 	'sha512');	// hashing algorithm (sha-256, sha-512)

// bcrypt - easy to implement [https://gist.github.com/1053158]
if (!defined("BCRYPT_WORK_FACTOR")) define("BCRYPT_WORK_FACTOR", 8);		// work_factor (4 - 31) [http://wildlyinaccurate.com/bcrypt-choosing-a-work-factor]

//scrypt - longest to break (2012-10), requires extra work server side to implement [https://github.com/DomBlack/php-scrypt]
if (!defined("SCRYPT_SALT")) 		define("SCRYPT_SALT", 		NULL);		// NULL to grenerate random
if (!defined("SCRYPT_PEPPER")) 		define("SCRYPT_PEPPER", 	'');	//
if (!defined("SCRYPT_SALT_LENGTH")) define("SCRYPT_SALT_LENGTH", 8);		// The length of the salt
if (!defined("SCRYPT_KEY_LENGTH")) 	define("SCRYPT_KEY_LENGTH", 32);		// The key length
if (!defined("SCRYPT_CPU")) 		define("SCRYPT_CPU", 		16384);		// The CPU difficultly (must be a power of 2,  > 1) pow(2,14)
if (!defined("SCRYPT_MEMORY")) 		define("SCRYPT_MEMORY", 	8);			// The memory difficultly
if (!defined("SCRYPT_PARALLEL")) 	define("SCRYPT_PARALLEL", 	1);			// The parallel difficultly


//-- Database --//
if ($localhost) {
	define('DB_SERVER','localhost');
	define('DB_NAME','_db');
	define('DB_USER','_user');
	define('DB_PASS','');
} else {
	define('DB_SERVER','localhost');
	define('DB_NAME','_db');
	define('DB_USER','_user');
	define('DB_PASS','');
}

//-- Mail --//
if (!defined("MAIL_ADMIN_EMAIL")) define('MAIL_ADMIN_EMAIL','email@domain.com');
if (!defined("MAIL_SIGNATURE")) define('MAIL_SIGNATURE',"\n\nKind Regards,\n\nYOUR NAME\nemail@domain.com\nhttps://domain.com");
if (!defined("MAIL_SITE_NAME")) define('MAIL_SITE_NAME',"My Site");
if (!defined("MAIL_SITE_EMAIL")) define('MAIL_SITE_EMAIL',"support@domain.com");
if (!defined("MAIL_SITE_URL")) define('MAIL_SITE_URL',"http://domain.com/"); // trailing /

// mailgun
define('MAILGUN_APIKEY', "");
define('MAILGUN_DOMAIN', "sample.mailgun.org");



?>