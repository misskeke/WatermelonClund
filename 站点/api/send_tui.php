<?php
require "inc/sql.php";
require "inc/session.php";
error_reporting(0);
if(!isset($_POST["content"])){
    die("参数错误，请重试。");
}
$tuic=special_filter($_POST["content"],true);
if(strlen($tuic)<1 || strlen($tuic)>16777215){
    $echo = array();
    $echo["errid"] = 20;
    $echo["errmsg"] = "贴子长度过长或过短 (最大长度为16777215字节)";
    die(json_encode($echo));
}
if(mb_strlen($tuic)>5000){
    $echo = array();
    $echo["errid"] = 20;
    $echo["errmsg"] = "贴子长度过长或过短 (最大长度为16777215字节)";
    die(json_encode($echo));
}
if(($usr=chksoretusr($_POST["sid"],$_POST["krr"],$mys))==false){
    $echo = array();
    $echo["errid"] = 10;
    $echo["errmsg"] = "会话不正确";
    die(json_encode($echo));
}else{
    if($usr["state"]==1 || $usr["state"]==3){
        $echo = array();
        $echo["errid"] = 1100110;
        $echo["errmsg"] = "您的帐号已被封禁。";
        $echo["uname"] = "";
        die(json_encode($echo));
    }
    $successful=$mys->query("INSERT INTO `thread` (`uid`, `ip`, `time`, `title`, `type`, `content`, `fid`, `reply_tid`) VALUES ('".$mys->real_escape_string($usr["uid"])
        ."', '".$mys->real_escape_string(GetIP())."', '".time()."', '', '1', '".
        $mys->real_escape_string($_POST["content"])."', '0', '".(is_numeric($_POST["reply"])?$mys->real_escape_string($_POST["reply"]):0)."')");
    if($successful){
        $echo = array();
        $echo["errid"] = 0;
        $echo["errmsg"] = "";
        $echo["tid"]=$mys->insert_id;
        die(json_encode($echo));
    }else{
        diemyerror($mys->error);
    }
}