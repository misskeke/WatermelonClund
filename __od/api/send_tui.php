<?php
require "inc/sql.php";
require "inc/session.php";
if (!isset($_POST["content"])) {
    die("参数错误，请重试。");
}
$tuic = special_filter($_POST["content"], true);
if (strlen($tuic) < 1 || strlen($tuic) > 16777215) {
    $echo = array();
    $echo["errid"] = 20;
    $echo["errmsg"] = "贴子长度过长或过短 (最大长度为16777215字节)";
    die(json_encode($echo));
}
if (mb_strlen($tuic) > 500) {
    $echo = array();
    $echo["errid"] = 21;
    $echo["errmsg"] = "推文长度不能大于500个字";
    die(json_encode($echo));
}
if (($usr = chksoretusr($_POST["sid"], $_POST["krr"], $mys)) == false) {
    $echo = array();
    $echo["errid"] = 10;
    $echo["errmsg"] = "会话不正确";
    die(json_encode($echo));
} else {
    if ($usr["state"] == 1 || $usr["state"] == 3) {
        $echo = array();
        $echo["errid"] = 1100110;
        $echo["errmsg"] = "您的帐号已被封禁。";
        $echo["uname"] = "";
        die(json_encode($echo));
    }
    $successful = $mys->query("INSERT INTO `thread` (`uid`, `ip`, `time`, `title`, `type`, `content`, `fid`, `reply_tid`) VALUES ('" . $mys->real_escape_string($usr["uid"])
        . "', '" . $mys->real_escape_string(GetIP()) . "', '" . time() . "', '', '1', '" .
        $mys->real_escape_string($_POST["content"]) . "', '0', '" . (is_numeric($_POST["reply"]) ? $mys->real_escape_string($_POST["reply"]) : 0) . "')");
    if ($successful) {
        $echo = array();
        $echo["errid"] = 0;
        $echo["errmsg"] = "";
        $echo["tid"] = $mys->insert_id;
        if (is_numeric($_POST["reply"])) {
            $res = $mys->query("SELECT thread.uid FROM `thread` WHERE thread.tid = '" . $mys->real_escape_string($_POST["reply"]) . "' AND thread.deleted = 0");
            if ($res && $res->num_rows > 0) {
                $uid = $res->fetch_assoc()["uid"];
                if ($uid != $usr["uid"]) {
                    $addmsgsql = "INSERT INTO `ssr` (`type`, `time`, `maker`, `recer`, `target`, `makeby`) VALUES ('1', '"
                        . time() . "', '" . $mys->real_escape_string($usr["uid"]) . "', '" . $mys->real_escape_string($uid) . "', '"
                        . $mys->real_escape_string($_POST["reply"]) . "', '" . $mys->real_escape_string($echo["tid"]) . "')";
                    $mys->query($addmsgsql);
                }
            }
        }
        $con=$_POST["content"];
        // 回复 * :
        if(preg_match('/^回复\s.+\s:/',$con,$y)>0){
            $call=$y[0];
            $callusr=mb_substr($call,3,mb_strlen($call)-5);
            $echo["reply_to"]=$callusr;
            $usrinfo=$mys->query("SELECT `user`.uid FROM `user` WHERE `user`.username = '".$mys->real_escape_string($callusr)."'");
            if($usrinfo!=false && $usrinfo->num_rows>0){
                $uic=$usrinfo->fetch_assoc();
                $uid=$uic["uid"];
                $addmsgsql = "INSERT INTO `ssr` (`type`, `time`, `maker`, `recer`, `target`, `makeby`) VALUES ('1', '"
                    . time() . "', '" . $mys->real_escape_string($usr["uid"]) . "', '" . $mys->real_escape_string($uid) . "', '"
                    . $mys->real_escape_string($_POST["reply"]) . "', '" . $mys->real_escape_string($echo["tid"]) . "')";
                $mys->query($addmsgsql);
            }
        }
        die(json_encode($echo));
    } else {
        diemyerror($mys->error);
    }
}