<?php
require "inc/sql.php";
require "inc/session.php";
error_reporting(0);
if(($usr=chksoretusr($_POST["sid"],$_POST["krr"],$mys))==false){
    $echo = array();
    $echo["errid"] = 10;
    $echo["errmsg"] = "会话不正确";
    die(json_encode($echo));
}else{
    $sql="SELECT * FROM `ssr` WHERE ssr.recer = '".$mys->real_escape_string($usr["uid"])."' AND ssr.type = '1'";
    $res=$mys->query($sql);
    if($res==false){
        diemyerror();
    }
    $arrc=$res->fetch_all(MYSQLI_ASSOC);
    $arrout=array();
    foreach ($arrc as $p){
        $u=array();
        $u["userid"]=$p["maker"];
        $mkerinfo=$mys->query("SELECT `user`.username FROM `user` WHERE `user`.uid = '".$p["maker"]."'");
        if($mkerinfo==false || $mkerinfo->num_rows<1){
            $u["user"]="null";
        }else{
            $u["user"]=$mkerinfo->fetch_assoc()["username"];
        }
        $u["time"]=$p["time"];
        $u["my_tid"]=$p["target"];
        $u["reply_tid"]=$p["makeby"];
        $tres=$mys->query("SELECT thread.content FROM `thread` WHERE thread.tid = '".$mys->real_escape_string($p["makeby"])."'");
        if($tres==false || $tres->num_rows<1){
            $u["reply_content"]="";
        }else{
            $u["reply_content"]=$tres->fetch_assoc()["content"];
        }
    }
    $mys->query("UPDATE `ssr` SET `showed`='1' WHERE (`recer` = '".$mys->real_escape_string($usr["uid"])."' AND `type` = '1')");
}
