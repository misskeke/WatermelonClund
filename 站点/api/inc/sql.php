<?php
mb_internal_encoding('utf-8');
error_reporting(0);
function print_stack_trace()
{
    $array = debug_backtrace();
    unset($array[0]);
    foreach ($array as $row) {
        $html .= $row['file'] . ':' . $row['line'] . '行,调用方法:' . $row['function'];
    }
    return $html;
}

$mys = new mysqli("localhost", "root", "", "devwebs");

function diemyerror($str = "")
{
    $echo = array();
    $echo["errid"] = 7;
    $echo["errmsg"] = "Mysql错误: " . $str;
    die(json_encode($echo));
}

if (mysqli_connect_errno()) {
    diemyerror();
}
function special_filter($string, $hn = false)
{
    if (!$string) return '';
    $new_string = '';
    for ($i = 0; isset($string[$i]); $i++) {
        $asc_code = ord($string[$i]);
        if ($asc_code == 9 || $asc_code == 10 || $asc_code == 13) {
            if ($hn) {
                $new_string .= $string[$i];
            } else {
                $new_string .= ' ';
            }
        } else if ($asc_code > 31 && $asc_code != 127) {
            $new_string .= $string[$i];
        }
    }
    return trim($new_string);
}

function validate_email($email)
{
    $exp = "^[a-z\'0-9]+([._-][a-z\'0-9]+)*@([a-z0-9]+([._-][a-z0-9]+))+$";
    if (eregi($exp, $email)) {
        if (checkdnsrr(array_pop(explode("@", $email)), "MX")) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function GetIP()
{
    if (!empty($_SERVER["HTTP_CLIENT_IP"])) {
        $cip = $_SERVER["HTTP_CLIENT_IP"];
    } elseif (!empty($_SERVER["HTTP_X_FORWARDED_FOR"])) {
        $cip = $_SERVER["HTTP_X_FORWARDED_FOR"];
    } elseif (!empty($_SERVER["REMOTE_ADDR"])) {
        $cip = $_SERVER["REMOTE_ADDR"];
    } else {
        $cip = "0.0.0.0";
    }
    return $cip;
}