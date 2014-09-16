<?php

class ultra {
    public static $debug__=true;
    public static $dbgStack="";
    public static function queryCache($m,$p,$f,$lm){
        if(ultra::$debug__){
            ultra::$dbgStack.="queryCache($m,$p,$f,$lm)\n";
        }
        $s=ultra::buildCacheName($m,$p);
        if(apc_exists($s)){
            if(ultra::$debug__){
                ultra::$dbgStack.="\tAPC:Cache ".$s." exists. return cache = ".apc_fetch($s)."\n";
            }
            return apc_fetch($s);
        }else{
            if(isset($f)){
                $rv=$f();
                if(isset($rv)){
                    if(!isset($lm)){
                        $lm=30;
                    }
                    if(ultra::$debug__){
                        ultra::$dbgStack.="\tAPC:Stored ".$s." = ".$rv."\n";
                    }
                    apc_store($s,$rv,$lm);
                }
                return $rv;
            }else{
                return "";
            }
        }
    }
    public static function buildCacheName($m,$p){
        return $m.' '.$p;
    }
    public static function Cmd5($s){
        return ultra::queryCache("md5of",$s,function()use($s){return md5($s);},0);
    }
    public static function sdCache($m,$p,$s,$lm){
        if(ultra::$debug__){
            ultra::$dbgStack.="sdCache($m,$p,$s,$lm)\n";
        }
        $k=ultra::buildCacheName($m,$p);
        if(isset($s)){
            if(!isset($lm)){
                $lm=30;
            }
            if(ultra::$debug__){
                ultra::$dbgStack.="\tapc_store($k,$s,$lm)\n";
            }
            apc_store($k,$s,$lm);
        }else{
            if(ultra::$debug__){
                ultra::$dbgStack.="\tapc_delete($k)\n";
            }
            apc_delete($k);
        }
    }
} 