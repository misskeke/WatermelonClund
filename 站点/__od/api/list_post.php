<?php
if (!isset($_POST["tid"])) {
    die("参数错误，请重试。");
}
if (!is_numeric($_POST["mx"]) || !is_numeric($_POST["mn"])) {
    diemyerror("检测到sql注入？");
}
require "inc/sql.php";
$tid = $mys->real_escape_string($_POST["tid"]);
$mn = $_POST["mn"];
$mx = $_POST["mx"];
$sql = "SELECT thread.tid, thread.uid, thread.time, thread.content, thread.zan_num, thread.state FROM `thread`" .
    " WHERE thread.reply_tid = '" . $tid . "' AND thread.deleted = 0 LIMIT " . ($mn - 1) . ", " . ($mx - $mn + 1);
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
        $arrout[] = $abs;
    }
    $echo = array();
    $echo["errid"] = 0;
    $echo["errmsg"] = "";
    $echo["time"] = time();
    $echo["mysql"] = $sql;
    $echo["t"] = $arrout;
    $echo["num_reply"] = $mys->query("SELECT count(thread.tid) AS c FROM thread WHERE thread.deleted = 0 AND thread.reply_tid = '" . $tid . "'")->fetch_assoc()["c"];
    die(json_encode($echo));
}