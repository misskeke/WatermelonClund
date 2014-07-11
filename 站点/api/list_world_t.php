<?php
error_reporting(0);
require "inc/sql.php";
$pge=1;
if(!is_numeric($_POST["mx"]) || !is_numeric($_POST["mn"])){
    diemyerror("检测到sql注入？");
}
$sql="SELECT thread.tid, thread.uid, thread.time, thread.content, thread.zan_num FROM `thread` WHERE thread.deleted = 0 AND thread.type = 1 AND thread.tid >= ".$_POST["mn"]." AND thread.tid <= ".$_POST["mx"]." ORDER BY thread.tid DESC";
$res=$mys->query($sql);
if($res==false){
    diemyerror();
}else{
    $arrout=array();
    $tde=$res->fetch_all(MYSQLI_ASSOC);
    foreach ($tde as $abs){
        $uid=$abs["uid"];
        $res=$mys->query("SELECT `username`, `email` FROM `user` WHERE `uid` = '".$uid."'");
        if($res==false){
            diemyerror();
        }else{
            $assoc=$res->fetch_assoc();
        }
        $abs["author"]=$assoc["username"];
        $abs["email"]=$assoc["email"];
        $arrout[]=$abs;
    }
    $echo = array();
    $echo["errid"] = 0;
    $echo["errmsg"] = "";
    $echo["time"]=time();
    $echo["mysql"]=$sql;
    $echo["t"]=$arrout;
    die(json_encode($echo));
}