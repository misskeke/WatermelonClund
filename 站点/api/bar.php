<?php
require "inc/sql.php";
if(!isset($_POST["kw"]) && !isset($_POST["f"])){
    die("参数错误");
}
$fname=$_POST["kw"];
$q=$mys->query(isset($_POST["f"])?"SELECT * FROM `bar` WHERE bar.fid = '".$mys->real_escape_string($_POST["f"])."'":
    "SELECT * FROM `bar` WHERE bar.fname = '".$mys->real_escape_string($fname)."'");
if($q->num_rows<1){
    $echo = array();
    $echo["errid"] = 850000;
    $echo["errmsg"] = "吧不存在";
    die(json_encode($echo));
}
$echo=$q->fetch_assoc();
$echo["errid"] = 0;
$echo["errmsg"] = "";
die(json_encode($echo));