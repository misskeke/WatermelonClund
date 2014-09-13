<?php
require "inc/sql.php";
require "inc/session.php";
if (!is_numeric($_POST["tid"])) {
    die("参数错误，请重试。");
}
if (($usr = chksoretusr($_POST["sid"], $_POST["krr"], $mys)) == false) {
    $echo = array();
    $echo["errid"] = 10;
    $echo["errmsg"] = "会话不正确";
    die(json_encode($echo));
} else {
    if ($usr["group"] == 1 && isset($_POST["desc"])) {
        $mys->begin_transaction();
        $mansql = "INSERT INTO `managing` (`target`, `type`, `doer`, `desc`, `time`, `ip`) VALUES ('"
            . $mys->real_escape_string($_POST["tid"]) . "', '1', '" . $usr["uid"] . "', '" . $mys->real_escape_string($_POST["desc"]) . "', '"
            . time() . "', '" . $mys->real_escape_string(GetIP()) . "')";
        $succ = $mys->query($mansql);
        if ($succ == false) {
            $mys->rollback();
            diemyerror();
        }
        $delsql = "UPDATE `thread` SET `deleted`='1', `del_doid`='" . $mys->insert_id . "' WHERE (`tid`='" . $mys->real_escape_string($_POST["tid"]) . "')";
        $succ2 = $mys->query($delsql);
        if ($succ2 == false) {
            $mys->rollback();
            diemyerror();
        }
        $mys->commit();
        $echo = array();
        $echo["errid"] = 0;
        $echo["errmsg"] = "";
        die(json_encode($echo));
    } else {
        $res = $mys->query("SELECT thread.uid FROM `thread` WHERE thread.tid = '" . $mys->real_escape_string(
                $_POST["tid"]) . "' AND thread.uid = '" . $usr["uid"] . "' AND thread.zan_num < 300");
        if ($res == false) {
            diemyerror();
        }
        if ($res->num_rows == 1) {
            $delsql = "UPDATE `thread` SET `deleted`='1', `del_doid`='0' WHERE (`tid`='" . $mys->real_escape_string($_POST["tid"]) . "')";
            $succ = $mys->query($delsql);
            if ($succ = false) {
                diemyerror();
            }
            $echo = array();
            $echo["errid"] = 0;
            $echo["errmsg"] = "";
            die(json_encode($echo));
        } else {
            $echo = array();
            $echo["errid"] = 11330;
            $echo["errmsg"] = "没有权限";
            die(json_encode($echo));
        }
    }
}