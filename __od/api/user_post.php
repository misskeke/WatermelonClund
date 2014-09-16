<?php
require "inc/sql.php";
$pge = 1;
if (!is_numeric($_POST["uid"])) {
    diemyerror("检测到sql注入？或者你没有写uid参数？");
}
$sql = "SELECT thread.tid, thread.uid, thread.time, thread.content, thread.zan_num, thread.fid FROM `thread` WHERE thread.uid = '".$mys->real_escape_string($_POST["uid"])."' AND thread.type = 1 AND thread.deleted = 0 AND thread.reply_tid = 0 ORDER BY `tid` DESC";
$res = $mys->query($sql);
if ($res == false) {
    diemyerror();
} else {
    $arrout = array();
    $tde = $res->fetch_all(MYSQLI_ASSOC);
    foreach ($tde as $abs) {
        $uid = $abs["uid"];
        $res = $mys->query("SELECT `username`, `mailmd5` AS email, `state` FROM `user` WHERE `uid` = '" . $uid . "'");
        if ($res == false) {
            diemyerror();
        } else {
            $assoc = $res->fetch_assoc();
        }
        $abs["author"] = $assoc["username"];
        $abs["email"] = $assoc["email"];
        $abs["state"] = $assoc["state"];
        if ($assoc["state"] == 3 || $assoc["state"] == 5) {
            $abs["content"] = "此用户已被强屏蔽。";
        }
        if($q->num_rows>0){
            $bi=$q->fetch_assoc();
            $abs["bar"]=array();
            $abs["bar"]["fid"]=$bi["fid"];
            $abs["bar"]["fname"]=$bi["fname"];
            $abs["bar"]["gms"]=$bi["gms"];
        }else{
            $abs["bar"]=array();
        }
        $resh = $mys->query("SELECT thread.tid FROM `thread` WHERE thread.reply_tid = '" . $abs["tid"] . "' AND thread.deleted = 0 LIMIT 0, 1");
        if ($resh->num_rows < 1) {
            $abs["reply_has"] = 0;
        } else {
            $abs["reply_has"] = 1;
        }
        $arrout[] = $abs;
    }
    $echo = array();
    $echo["errid"] = 0;
    $echo["errmsg"] = "";
    $echo["time"] = time();
    $echo["t"] = $arrout;
    die(json_encode($echo));
}