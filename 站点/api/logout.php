<?php
require "inc/sql.php";
require "inc/session.php";
if (chksio($_POST["sid"], $_POST["krr"], $mys) == false) {
    $echo = array();
    $echo["errid"] = 10;
    $echo["errmsg"] = "会话不正确";
    die(json_encode($echo));
} else {
    $mys->query("UPDATE `session` SET `shuted`='1' WHERE (`sid`='" . $mys->real_escape_string($_POST["sid"]) . "')");
    $echo = array();
    $echo["errid"] = 0;
    $echo["errmsg"] = "";
    die(json_encode($echo));
}