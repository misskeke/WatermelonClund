<?php
function chksio($sid,$krr,mysqli $mys){
    $res=$mys->query("SELECT * FROM `session` WHERE `sid` = '".$mys->real_escape_string($sid)."' AND `krr` = '".$mys->real_escape_string($krr)."' AND `shuted` < '1'");
    if($res->num_rows>0){
        return true;
    }else{
        return false;
    }
}