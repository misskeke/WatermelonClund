<?php
error_reporting(0);
require "inc/sql.php";
$sql="SELECT thread.tid FROM `thread` ORDER BY thread.tid DESC LIMIT 1";
$res=$mys->query($sql);
if($res==false){
    diemyerror();
}else{
    $echo = array();
    $echo["errid"] = 0;
    $echo["errmsg"] = "";
    $echo["lasttid"]=$res->fetch_assoc()["tid"];
    die(json_encode($echo));
}