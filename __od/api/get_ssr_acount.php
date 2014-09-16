<?php
require "inc/sql.php";
require "inc/session.php";
error_reporting(0);
if (($usr = chksoretusr($_POST["sid"], $_POST["krr"], $mys)) == false) {
    $echo = array();
    $echo["errid"] = 10;
    $echo["errmsg"] = "会话不正确";
    die(json_encode($echo));
} else {
    set_time_limit(0);
    while (true) {
        $sql = "SELECT ssr.type, COUNT(ssr.ssrid) AS count FROM `ssr` WHERE ssr.recer = '" . $mys->real_escape_string($usr["uid"]) . "' AND ssr.showed = 0 GROUP BY ssr.type ORDER BY ssr.type ASC";
        $res = $mys->query($sql);
        if ($res == false) {
            diemyerror();
        }
        $echo = array();
        $echo["errid"] = 0;
        $echo["errmsg"] = "";
        $echo["msgs"] = $res->fetch_all(MYSQLI_ASSOC);
        die(json_encode($echo));
    }
}
