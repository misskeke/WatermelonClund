<?php
error_reporting(0);
require "inc/sql.php";
$sql="SELECT COUNT(thread.tid) AS c FROM `thread` WHERE thread.deleted = 0 AND thread.type = 1 AND thread.reply_tid = 0";
$res=$mys->query($sql);
if($res==false){
    diemyerror();
}else{
    $echo = array();
    $echo["errid"] = 0;
    $echo["errmsg"] = "";
    $echo["lasttid"]=$res->fetch_assoc()["c"];
    die(json_encode($echo));
}