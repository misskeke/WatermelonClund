<?php
error_reporting(0);
require "inc/sql.php";
$pge=1;
if(!is_numeric($_POST["mx"]) || !is_numeric($_POST["mn"])){
    diemyerror("检测到sql注入？");
}
$mn=($_POST["mn"]<1?1:$_POST["mn"])-1;
$mx=($_POST["mx"]<1?1:$_POST["mx"])-1;
$sql="SELECT * FROM (SELECT thread.tid, thread.uid, thread.time, thread.content, thread.zan_num FROM `thread` WHERE thread.deleted = 0 AND thread.type = 1 AND thread.reply_tid = 0 LIMIT ".$mn.",".($mx-$mn+1).")tmp ORDER BY tid DESC";
$res=$mys->query($sql);
if($res==false){
    if($mn>$mx){
        $echo = array();
        $echo["errid"] = 0;
        $echo["errmsg"] = "";
        $echo["time"]=time();
        $echo["t"]=array();
        die(json_encode($echo));
    }
    diemyerror();
}else{
    $arrout=array();
    $tde=$res->fetch_all(MYSQLI_ASSOC);
    foreach ($tde as $abs){
        $uid=$abs["uid"];
        $res=$mys->query("SELECT `username`, `email`, `state` FROM `user` WHERE `uid` = '".$uid."'");
        if($res==false){
            diemyerror();
        }else{
            $assoc=$res->fetch_assoc();
        }
        $abs["author"]=$assoc["username"];
        $abs["email"]=$assoc["email"];
        $abs["state"]=$assoc["state"];
        if($assoc["state"]==3 || $assoc["state"]==5){
            $abs["content"]="此用户已被强屏蔽。";
        }
        $resh=$mys->query("SELECT thread.tid FROM `thread` WHERE thread.reply_tid = '".$abs["tid"]."' AND thread.deleted = 0 LIMIT 0, 1");
        if($resh->num_rows<1){
            $abs["reply_has"]=0;
        }else{
            $abs["reply_has"]=1;
        }
        $arrout[]=$abs;
    }
    $echo = array();
    $echo["errid"] = 0;
    $echo["errmsg"] = "";
    $echo["time"]=time();
    $echo["t"]=$arrout;
    die(json_encode($echo));
}