<?php
error_reporting(0);
usleep(500000);
function getRandStr($length)
{
    $str = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $randString = '';
    $len = strlen($str) - 1;
    for ($i = 0; $i < $length; $i++) {
        $num = mt_rand(0, $len);
        $randString .= $str[$num];
    }
    return $randString;
}

require "inc/sql.php";
if (!isset($_POST["u"]) || !isset($_POST["p"])) {
    die("参数错误，请重试。");
}
$name = special_filter($_POST["u"]);
$pass = $_POST["p"];
$res = $mys->query("SELECT * FROM `user` WHERE `user`.username = '" . $mys->real_escape_string($name) . "' AND `user`.`password` = '" . $mys->real_escape_string($pass) . "'");
if ($res->num_rows > 0) {
    $ft = $res->fetch_assoc();
    $krr=getRandStr(32);
    $bool = $mys->query("INSERT INTO `session` (`uid`, `krr`, `ip`, `time`) VALUES ('" . $ft["uid"] . "', '" . $mys->real_escape_string($krr) . "', '".$mys->real_escape_string(GetIP())."', '".time()."')");
    if(!$bool){
        $echo = array();
        $echo["errid"] = 7;
        $echo["errmsg"] = "Mysql错误";
        die(json_encode($echo));
    }
    $echo = array();
    $echo["errid"] = 0;
    $echo["errmsg"] = "";
    $echo["uid"] = $ft["uid"];
    $echo["sid"]=$mys->insert_id;
    $echo["krr"]=$krr;
    $echo["uname"] = $ft["username"];
    die(json_encode($echo));
} else {
    $echo = array();
    $echo["errid"] = 6;
    $echo["errmsg"] = "用户名或密码错误";
    die(json_encode($echo));
}