<?php

chdir('../../src/');
include('php/class.db.php');
include('php/class.core.php');
include('php/class.garbage.php');

echo "<pre>";
echo "=== DB Garbage Collection ===\n";
$timer = new Timers;
$timer->start('gc');

$g = new Garbage;
$g->clean();
$timer->stop('gc');


$timer->print_results();
echo "</pre>";
?>