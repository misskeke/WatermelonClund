<?php
require "inc/sql.php";
require "inc/session.php";
$echo = array();
$echo["successful"]=(chksio($_POST["sid"],$_POST["krr"],$mys)==true?1:0);
die(json_encode($echo));