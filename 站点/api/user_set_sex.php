<?php
require "inc/sql.php";
require "inc/session.php";
if(!isset($_POST["sex"])){
    die("参数错误，请重试。");
}

if(!is_numeric($_POST["sex"])){
    diemyerror("整数啊喂！你是在玩注入吗 - ".$_POST["sex"]);
}

if(($usr=chksoretusr($_POST["sid"],$_POST["krr"],$mys))==false){
    $echo = array();
    $echo["errid"] = 10;
    $echo["errmsg"] = "会话不正确";
    die(json_encode($echo));
}

if($_POST["sex"]<0 || $_POST["sex"]>5){
    $echo = array();
    $echo["errid"] = 120;
    $echo["errmsg"] = "性别值超出范围";
    die(json_encode($echo));
}

$sql="UPDATE `user` SET `sex`='".$mys->real_escape_string(intval($_POST["sex"]))."' WHERE `uid`='".$mys->real_escape_string($usr["uid"])."'";

$succ=$mys->query($sql);
if($succ){
    $echo = array();
    $echo["errid"] = 0;
    $echo["errmsg"] = "";
    die(json_encode($echo));
}else{
    diemyerror();
}