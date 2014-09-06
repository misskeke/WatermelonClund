<?php
require "inc/sql.php";
$sq=$_POST["s"];
if(!isset($sq)){
    die();
}else{
    $sq=special_filter($sq);
    if(strlen($sq)==0){
        $echo = array();
        $echo["errid"] = 13357;
        $echo["errmsg"] = "请输入搜索词";
        die(json_encode($echo));
    }
    $filter=special_filter(isset($_POST["searchType"])?$_POST["searchType"]:"");
    $sjg=array();
    $serchs=mb_split("\s+",$filter);
    if(strlen($filter)==0){
        $serchs=array("bar","user","thread");
    }
    $serregex="^.{0,}[";
    $serregex.=preg_quote(mb_ereg_replace("\s+","",$sq));
    $serregex.="]{1,}.{0,}$";
    foreach ($serchs as $typ){
        switch($typ){
            case "bar":
                $sqlbar="SELECT bar.fid, bar.fname, bar.fallow_num, bar.thread_num, bar.headpic, bar.last_editstate_doid, bar.ct, bar.swlinks FROM `bar` WHERE bar.fname REGEXP '".$mys->real_escape_string($serregex)."' LIMIT 20";
                $res=$mys->query($sqlbar);
                if($res==false){
                    diemyerror();
                }
                $bar=$res->fetch_all(MYSQLI_ASSOC);
                break;
            case "user":
                $sqlbar="SELECT `user`.uid, `user`.username, `user`.mailmd5 AS email FROM `user` WHERE `user`.username REGEXP '".$mys->real_escape_string($serregex)."' LIMIT 20";
                $res=$mys->query($sqlbar);
                if($res==false){
                    diemyerror();
                }
                $usr=$res->fetch_all(MYSQLI_ASSOC);
                break;
        }
    }
    $echo = array();
    $echo["errid"] = 0;
    $echo["errmsg"] = "";
    $echo["bar"] = $bar;
    $echo["user"]=$usr;
    $echo["filter"]=$serchs;
    $echo["regex"]=$serregex;
    die(json_encode($echo));
}