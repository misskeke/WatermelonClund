<?php
require "inc/sql.php";
if(isset($_POST["user"])){
    $sql="SELECT `user`.uid, `user`.username, `user`.email, `user`.sex, `user`.registerTime, `user`.QQ, `user`.state, `user`.group FROM `user` WHERE `user`.username = '".$mys->real_escape_string($_POST["user"])."'";
}else if(isset($_POST["uid"])){
    $sql="SELECT `user`.uid, `user`.username, `user`.email, `user`.sex, `user`.registerTime, `user`.QQ, `user`.state, `user`.group FROM `user` WHERE `user`.uid = '".$mys->real_escape_string($_POST["uid"])."'";
}else{
    die("参数错误，请重试。");
}

$res=$mys->query($sql);
if($res==false){
    diemyerror();
}else{
    if($res->num_rows<1){
        $echo = array();
        $echo["errid"] = 100;
        $echo["errmsg"] = "用户不存在";
        die(json_encode($echo));
    }
    $echo = array();
    $echo["errid"] = 0;
    $echo["errmsg"] = "";
    $echo["user"]=$res->fetch_assoc();
    die(json_encode($echo));
}