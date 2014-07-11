<?php
if(!isset($_POST["picid"])){
    die("参数错误，请重试。");
}
require "inc/sql.php";
$succ=$mys->query("UPDATE `pics` SET `zan`=`zan`+1 WHERE (`picid`='".$mys->real_escape_string($_POST["picid"])."')");
if($succ){
    $echo = array();
    $echo["errid"] = 0;
    $echo["errmsg"] = "";
    die(json_encode($echo));
}else{
    diemyerror();
}