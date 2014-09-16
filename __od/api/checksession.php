<?php
require "inc/sql.php";
require "inc/session.php";
$echo = array();
$r = chksoretusr($_POST["sid"], $_POST["krr"], $mys);
$echo["successful"] = ($r != false ? true : false);
$echo["uid"] = $r["uid"];
$echo["name"] = $r["username"];
die(json_encode($echo));