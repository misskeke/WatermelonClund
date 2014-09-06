<?php
require "inc/sql.php";
require "inc/session.php";
if (!isset($_POST["extra"]) || !isset($_POST["value"])) {
    die("参数错误，请重试。");
}
$extra = special_filter($_POST["extra"]);
if ($mys->real_escape_string($extra) != $extra || strlen($extra) == 0) {
    $echo = array();
    $echo["errid"] = 110;
    $echo["errmsg"] = "名称不合法";
    die(json_encode($echo));
}
$value = special_filter($_POST["value"]);

if (($usr = chksoretusr($_POST["sid"], $_POST["krr"], $mys)) == false) {
    $echo = array();
    $echo["errid"] = 10;
    $echo["errmsg"] = "会话不正确";
    die(json_encode($echo));
}

$sql = "INSERT INTO `user_extra` (`uid`, `ename`, `evalue`, `ip`, `time`) VALUES ('" . $mys->real_escape_string($usr["uid"]) . "', '"
    . $mys->real_escape_string($extra) . "', '" . $mys->real_escape_string($value) . "', '" . $mys->real_escape_string(GetIP()) . "', '" . time() . "')";

$succ = $mys->query($sql);
if ($succ) {
    $echo = array();
    $echo["errid"] = 0;
    $echo["errmsg"] = "";
    $echo["eid"] = $mys->insert_id;
    die(json_encode($echo));
} else {
    diemyerror();
}