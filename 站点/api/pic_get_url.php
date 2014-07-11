<?php
if(!isset($_POST["picid"])){
    die("参数错误，请重试。");
}
require "inc/sql.php";
$sql="SELECT pics.src FROM `pics` WHERE pics.picid = '".$mys->real_escape_string($_POST["picid"])."' AND pics.deleted = 0";;
$res=$mys->query($sql);
if($res==false){
    diemyerror();
}else{
    if($res->num_rows<1){
        $echo = array();
        $echo["errid"] = 45;
        $echo["errmsg"] = "图片已删除或不存在";
        die(json_encode($echo));
    }else{
        $echo = array();
        $echo["errid"] = 0;
        $echo["errmsg"] = "";
        $echo["picurl"]=$res->fetch_assoc()["src"];
        die(json_encode($echo));
    }
}