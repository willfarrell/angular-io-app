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
 * @version   GIT: 0.0.0
 * @link      http://domainsicle.com
 */

// set_include_path(dirname(dirname(__FILE__)).'/lib'.PATH_SEPARATOR.get_include_path());



require_once 'php/inc.config.php';		// config vars
require_once 'php/lib.global.php';		// collection of php missing function

require_once 'php/class.core.php';		// api classes are extended from this
require_once 'php/class.session.php';	// User session

// https://github.com/Luracast/Restler
require_once 'php/Restler/restler.php'; // Change made in Restler.php : generateMap() : } elseif (Defaults::$autoRoutingEnabled) {
//use Luracast\Restler\Restler;
//Defaults::$smartAutoRouting = false;

// Include API Classes
require_once 'php/api.account.php';
require_once 'php/api.user.php';
	require_once 'php/api.message.php';	// plugin
	require_once 'php/api.follow.php';	// plugin
require_once 'php/api.company.php';
	require_once 'php/api.location.php';

require_once 'php/api.filepicker.php';	// plugin


//-- Add-ons --//
require_once 'php/api.contact.php';		// plugin

// App
//require_once 'php/api.__class__.php';

$r = new Restler();
$r->setSupportedFormats('JsonpFormat');
//$r->setSupportedFormats('JsonFormat', 'JsFormat'); // , 'XmlFormat'

// services
$r->addAPIClass('Account');
$r->addAPIClass('Contact'); // replace with message???
//$r->addAPIClass('Img');

//if ($session->cookie['user_ID']) {	// Users Only
	$r->addAPIClass('User');
	$r->addAPIClass('Company');
	$r->addAPIClass('Location');

	$r->addAPIClass('Filepicker');
	
	$r->addAPIClass('Follow');
	$r->addAPIClass('Message');

//}

$r->handle();

/*
RESTler source code change to support METHOD_

if (preg_match_all(
    '/^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)/i',
    $methodUrl, $matches)
) {
    $httpMethod = strtoupper($matches[0][0]);
    $methodUrl = substr($methodUrl, strlen($httpMethod));
} else if (preg_match_all(
	'/^(GET|POST|PUT|DELETE|HEAD|OPTIONS)_?/i',
    $methodUrl, $matches)
) {
	//echo "<pre>$methodUrl\n";print_r($matches);
    $httpMethod = strtoupper($matches[1][0]);
    $methodUrl = substr($methodUrl, strlen($matches[0][0]));
    //echo "$methodUrl\n";
} else {
    $httpMethod = 'GET';
}

*/

?>
