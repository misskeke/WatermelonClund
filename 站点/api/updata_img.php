<?php
if (!isset($_POST["src"])) {
    die("参数错误，请重试。");
}
require "inc/sql.php";
require "inc/session.php";
$src = special_filter($_POST["src"]);
if (strlen($src) < 1) {
    $echo = array();
    $echo["errid"] = 40;
    $echo["errmsg"] = "必须选择图片";
    die(json_encode($echo));
} else if (strlen($src) > 52428800) {
    $echo = array();
    $echo["errid"] = 41;
    $echo["errmsg"] = "图片最大为20M";
    die(json_encode($echo));
}

if (($usr = chksoretusr($_POST["sid"], $_POST["krr"], $mys)) == false) {
    $echo = array();
    $echo["errid"] = 10;
    $echo["errmsg"] = "会话不正确";
    die(json_encode($echo));
}
$sql = "INSERT INTO `pics` (`authoruid`, `updip`, `time`, `src`) VALUES ('" . $mys->real_escape_string($usr["uid"]) . "', '" . $mys->real_escape_string(GetIP()) . "', '" . time() . "', '')";

$successful = $mys->query($sql);
if(!$successful){
    diemyerror();
}

$id=$mys->insert_id;
// data:image/eeeext;base64,BASE STR HERE
if(substr($src,0,5)=="data:"){
    $lastf=stripos(substr($src,0,100),";base64,");
    if($lastf!==false){
        $mr=substr(substr($src,0,$lastf),5);
        $pb=substr($src,$lastf+8);
        $bin=base64_decode($pb);
        switch (strtolower($mr)){
            case "image/jpeg":
                $ext="jpg";
                break;
            case "image/png":
                $ext="png";
                break;
            case "image/gif":
                $ext="gif";
                break;
            case "image/bmp":
                $ext="bmp";
                break;
            case "application/octet-stream":
                $ext="psd";
                break;
            case "image/svg+xml":
                $ext="svg";
                break;
            default:
                $echo = array();
                $echo["errid"] = 35216;
                $echo["errmsg"] = "不是图片";
                die(json_encode($echo));
                break;
        }
        $ext="png";
        $fname=md5(($id).($id-1).($id+1).time()).".".$ext;
        $res=fopen("../n/".$fname,"xb");
        if(!$res){
            diemyerror("文件错误，请重试。");
        }
        if(!fwrite($res,$bin)){
            fclose($res);
            unlink("../n/".$fname);
            diemyerror("文件错误，请重试。");
        }
        fclose($res);
        $successful=$mys->query("UPDATE `pics` SET `src`='/n/".$mys->real_escape_string($fname)."' WHERE (`picid`='".$id."')");
    }
}

if ($successful) {
    $echo = array();
    $echo["errid"] = 0;
    $echo["errmsg"] = "";
    $echo["picid"] = $id;
    die(json_encode($echo));
} else {
    diemyerror();
}