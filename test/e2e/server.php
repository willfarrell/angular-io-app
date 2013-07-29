<?php

chdir('../../src/');
include('php/class.db.php');
include('php/class.core.php');
include('php/class.curl.php');

include('php/class.garbage.php');

$timer = new Timers;
$curl = new curl;

echo "<pre>";
echo "=== DB Garbage Collection ===\n";

$timer->start('gc');

$g = new Garbage;
$g->clean();
$timer->stop('gc');

echo "=== Session Test ===\n";

$timer->start('st');
/*
$site = 'http://app.angular/';
$ckfile = tempnam ("/tmp", "CURLCOOKIE");

$ch = curl_init ($site.'account/signin');
curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
curl_setopt($ch, CURLOPT_COOKIEJAR, $ckfile);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, "email=will.farrell@gmail.com&password=Chilly5577&remember=true");
$output = curl_exec ($ch);
var_dump($output);

//$data = $curl->post($site.'account/signin', array('email'=>'will.farrell@gmail.com', 'password'=>'Chilly5577', 'remember'=>true));
//var_dump($data['FILE']);

$ch = curl_init ($site.'account/session');
curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
curl_setopt ($ch, CURLOPT_COOKIEJAR, $ckfile);
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, true);
$output = curl_exec ($ch);
var_dump($output);


$ch = curl_init ($site.'message/unread');
curl_setopt($ch, CURLOPT_USERAGENT, $_SERVER['HTTP_USER_AGENT']);
curl_setopt ($ch, CURLOPT_COOKIEJAR, $ckfile);
curl_setopt ($ch, CURLOPT_RETURNTRANSFER, true);
$output = curl_exec ($ch);
var_dump($output);
*/
/*$data = $curl->get($site.'message/unread');
var_dump($data['FILE']);
$data = $curl->get($site.'account/signout');
var_dump($data['FILE']);8/
*/

$timer->stop('st');

$timer->print_results();
echo "</pre>";
?>