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
if(($usr=chksoretusr($_POST["sid"],$_POST["krr"],$mys))==false){
    $echo = array();
    $echo["errid"] = 10;
    $echo["errmsg"] = "会话不正确";
    die(json_encode($echo));
}else{
    $successful=$mys->query("INSERT INTO `thread` (`uid`, `ip`, `time`, `title`, `del_usr`, `del_rsn`, `ban_because_this`, `ban_because_this_banid`, `type`, `content`, `fid`, `reply_tid`, `zan_usr`) VALUES ('".$mys->real_escape_string($usr["uid"])
        ."', '".$mys->real_escape_string(GetIP())."', '".time()."', '', '0', '0', '0', '0', '1', '".
        $mys->real_escape_string($_POST["content"])."', '0', '0', '')");
    if($successful){
        $echo = array();
        $echo["errid"] = 0;
        $echo["errmsg"] = "";
        $echo["tid"]=$mys->insert_id;
        die(json_encode($echo));
    }else{
        diemyerror();
    }
}