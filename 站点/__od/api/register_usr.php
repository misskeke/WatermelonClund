<?php
error_reporting(0);
require "inc/sql.php";

if (!isset($_POST["n"]) || !isset($_POST["p"]) || !isset($_POST["e"])) {
    die("参数错误，请重试。");
}
$name = special_filter($_POST["n"]);
$email = special_filter($_POST["e"]);
if (!validate_email($email)) {
    $echo = array();
    $echo["errid"] = 1;
    $echo["errmsg"] = "邮箱不正确";
    die(json_encode($echo));
} else if (strlen($name) < 1) {
    $echo = array();
    $echo["errid"] = 2;
    $echo["errmsg"] = "用户名没填";
    die(json_encode($echo));
} else if (strlen($_POST["p"]) < 6) {
    $echo = array();
    $echo["errid"] = 2;
    $echo["errmsg"] = "密码最少六个字符";
    die(json_encode($echo));
}
$mys->begin_transaction();
$res = $mys->query("SELECT `user`.uid FROM `user` WHERE `user`.username = '" . $mys->real_escape_string($name) . "'");
if ($res->num_rows > 0) {
    $mys->rollback();
    $echo = array();
    $echo["errid"] = 4;
    $echo["errmsg"] = "用户名存在";
    die(json_encode($echo));
}
$res = $mys->query("SELECT `user`.uid FROM `user` WHERE `user`.email = '" . $mys->real_escape_string($email) . "' AND `user`.emailCorrented = '1'");
if ($res->num_rows > 0) {
    $mys->rollback();
    $echo = array();
    $echo["errid"] = 5;
    $echo["errmsg"] = "邮箱存在";
    die(json_encode($echo));
}
$sql = "INSERT INTO `user` (`username`, `password`, `email`, `sex`, `registerip`, `registerTime`, `QQ`, `emailCorrented`, `state`, `mailmd5`) VALUES ('" . $mys->real_escape_string($name) . "', '" . $mys->real_escape_string(md5($_POST["p"])) . "', '" . $mys->real_escape_string($email) . "', '0', '" . $mys->real_escape_string(GetIP()) . "', '" . time() . "', '0', '0', '0', '".$mys->real_escape_string(md5($email))."')";
$succe = $mys->query($sql);
if ($succe) {
    $echo = array();
    $echo["errid"] = 0;
    $echo["errmsg"] = "";
    $echo["uid"] = $mys->insert_id;
    $echo["uname"] = $name;
    $mys->commit();
    die(json_encode($echo));
} else {
    diemyerror();
}
