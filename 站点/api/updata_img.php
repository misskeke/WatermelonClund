<?php
if (!isset($_POST["src"])) {
    die("参数错误，请重试。");
}
require "inc/sql.php";
require "inc/session.php";
$src = special_filter($_POST["src"]);
if (strlen($src) < 1) {
    $echo = array();
    $echo["errid"] = 40;
    $echo["errmsg"] = "必须选择图片";
    die(json_encode($echo));
} else if (strlen($src) > 52428800) {
    $echo = array();
    $echo["errid"] = 41;
    $echo["errmsg"] = "图片最大为20M";
    die(json_encode($echo));
}

if (($usr = chksoretusr($_POST["sid"], $_POST["krr"], $mys)) == false) {
    $echo = array();
    $echo["errid"] = 10;
    $echo["errmsg"] = "会话不正确";
    die(json_encode($echo));
}

$sql = "INSERT INTO `pics` (`authoruid`, `updip`, `time`, `src`) VALUES ('" . $mys->real_escape_string($usr["uid"]) . "', '" . $mys->real_escape_string(GetIP()) . "', '" . time() . "', '" . $mys->real_escape_string($src) . "')";

$successful = $mys->query($sql);
if ($successful) {
    $echo = array();
    $echo["errid"] = 0;
    $echo["errmsg"] = "";
    $echo["picid"] = $mys->insert_id;
    die(json_encode($echo));
} else {
    diemyerror();
}