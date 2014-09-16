<?php
function chksio($sid, $krr, mysqli $mys)
{
    $res = $mys->query("SELECT * FROM `session` WHERE `sid` = '" . $mys->real_escape_string($sid) . "' AND `krr` = '" . $mys->real_escape_string($krr) . "' AND `shuted` < '1'");
    if ($res->num_rows > 0) {
        return true;
    } else {
        return false;
    }
}

function chksoretusr($sid, $krr, mysqli $mys)
{
    $res = $mys->query("SELECT * FROM `session` WHERE `sid` = '" . $mys->real_escape_string($sid) . "' AND `krr` = '" . $mys->real_escape_string($krr) . "' AND `shuted` < '1'");
    if ($res == false || $res->num_rows < 1) {
        return false;
    } else {
        $uid = $res->fetch_assoc()["uid"];
        $res = $mys->query("SELECT * FROM `user` WHERE `uid` = '" . $mys->real_escape_string($uid) . "'");
        if ($res) {
            $usr = $res->fetch_assoc();
            if ($usr["state"] > 3) {
                $echo = array();
                $echo["errid"] = 1100106;
                $echo["errmsg"] = "您的帐号已被禁止登录，或者被删除。";
                $echo["uname"] = "";
                die(json_encode($echo));
            }
            return $usr;
        } else {
            return false;
        }
    }
}