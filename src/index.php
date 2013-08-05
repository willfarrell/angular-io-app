<?php

/**
 * REST index file - handle all api calls
 * Documentation for sample calls found in Readme.md
 *
 * PHP Version 5
 *
 * @category  N/A
 * @package   N/A
 * @author    will Farrell <will.farrell@gmail.com>
 * @copyright 2012 Farrell Labs
 * @license   http://www.opensource.org/licenses/mit-license.html  MIT License
 * @version   {{version}} {{date}}
 * @link      http://domainsicle.com
 */

// set_include_path(dirname(dirname(__FILE__)).'/lib'.PATH_SEPARATOR.get_include_path());

require_once dirname(__FILE__).'/php/inc.config.php';		// config vars
require_once dirname(__FILE__).'/php/lib.global.php';		// collection of php missing function

require_once dirname(__FILE__).'/php/class.core.php';		// api classes are extended from this
require_once dirname(__FILE__).'/php/class.session.php';	// User session

// https://github.com/Luracast/Restler
require_once dirname(__FILE__).'/php/vendor/luracast/restler/vendor/restler.php'; // $path = is_array($path) ? $path[0] : $path; // added to line 161 in autoloader
use Luracast\Restler\Defaults;
use Luracast\Restler\Restler;

require_once dirname(__FILE__).'/php/restler.auth.php';
//require_once 'php/restler.rateLimit.php';

//Defaults::$smartAutoRouting = false;
//Defaults::$throttle = 20; //time in milliseconds for bandwidth throttling
//Defaults::$useUrlBasedVersioning = true;

// Include API Classes
require_once dirname(__FILE__).'/php/api.account.php';
require_once dirname(__FILE__).'/php/api.user.php';
	require_once dirname(__FILE__).'/php/api.message.php';	// plugin
	require_once dirname(__FILE__).'/php/api.follow.php';	// plugin
require_once dirname(__FILE__).'/php/api.company.php';
	require_once dirname(__FILE__).'/php/api.location.php';

require_once dirname(__FILE__).'/php/api.filepicker.php';	// plugin


//-- Add-ons --//
require_once dirname(__FILE__).'/php/api.billing.php';
require_once dirname(__FILE__).'/php/api.contact.php';// plugin

// REST API
//$session = new Session;

$r = new Restler(); // true for production
//$r->setAPIVersion(2);
$r->setSupportedFormats('JsonFormat', 'JsFormat', 'XmlFormat');
$r->addAuthenticationClass('Auth');
$r->addAuthenticationClass('Auth');

// services
$r->addAPIClass('Account');
$r->addAPIClass('Contact'); // replace with message???

$r->addAPIClass('User');
$r->addAPIClass('Company');
$r->addAPIClass('Location');
$r->addAPIClass('Billing');

$r->addAPIClass('Filepicker');

$r->addAPIClass('Follow');
$r->addAPIClass('Message');

// ** Important: The Test Class must be delete in production delpoyment
require_once 'php/api.test.php';// plugin
$r->addAPIClass('Test');

$r->handle();

?>