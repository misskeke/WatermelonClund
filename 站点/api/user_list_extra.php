<?php
require "inc/sql.php";
if(!isset($_POST["uid"])){
    die("参数错误，请重试。");
}
$sql="SELECT * FROM (SELECT eid, ename, evalue FROM user_extra WHERE uid = '".$mys->real_escape_string($_POST["uid"])."' ORDER BY eid DESC ) t GROUP BY ename ORDER BY eid DESC";
$res=$mys->query($sql);
if($res==false){
    diemyerror();
}
$ss=array();
while(($t=$res->fetch_assoc())!=false){
    if(strlen($t["evalue"])<1){
        continue;
    }
    $ss[]=$t;
}
$echo = array();
$echo["errid"] = 0;
$echo["errmsg"] = "";
$echo["extras"]=$ss;
die(json_encode($echo));