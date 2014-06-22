<?php
if (!isset($_POST["aeskey"])) {
    die("");
}
$aeskeyrased = $_POST["aeskey"];
require ("rsa_decrypt/rsadecr.php");
require ("aes.php");
$aeskey = decryptrsa($aeskeyrased);
function generate_xdd($length)
{
    $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $xdd = '';
    for ($i = 0; $i < $length; $i++) {
        $xdd .= substr($chars, mt_rand(0, strlen($chars) - 1), 1);
    }
    return $xdd;
}
$xzz=generate_xdd(16);
$aes=new aes();
$aes->setKey($aeskey);
$xzzenced=$aes->encode($xzz);
//TODO: Put into database