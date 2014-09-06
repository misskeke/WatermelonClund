<?php

require_once "sql.php";

interface thread {
    public function tid();
    public function author();
    public function sendIp();
    public function sendTime();
    public function title();
    public function isDeleted();
    public function del_Do();
    public function ban_because_this_do();
    public function type();
    public function content();
    public function bar();
    public function replyTo_thread();
    public function state();
    public function zanNum();
}

class __thread implements thread {
    public $tid;
    public $myline;
    public function  __thread($tid){
        global $mys;
        $r=$mys->query("SELECT * FROM `thread` WHERE thread.tid = ".$mys->real_escape_string($tid));
        if($r->num_rows<1){
            throw new ThreadNotFindExp($tid);
        }
        $this->myline=$r->fetch_assoc();
        $this->tid=$this->myline["tid"];
    }
    public function tid(){
        return $this->tid;
    }
    public function author(){
        return new __man("",$this->myline["uid"]);
    }
    public function sendIp(){
        return $this->myline["ip"];
    }
    public function sendTime(){
        return $this->myline["time"];
    }
    public function title(){
        return $this->myline["title"];
    }
    public function isDeleted(){
        return $this->myline["deleted"]>0;
    }
    public function del_Do(){
        if($this->isDeleted()){
            return new __MDO($this->myline["del_doid"]);
        }else{
            return null;
        }
    }
    public function ban_because_this_do(){
        if($this->myline["ban_because_this_doid"]>0){
            return new __MDO($this->myline["ban_because_this_doid"]);
        }else{
            return null;
        }
    }
}

class ThreadNotFindExp extends ThreadExp {
    public function ThreadNotFindExp($t){
        parent::ThreadExp("帖子未找到",$t);
    }
}

abstract class ThreadExp extends Exception {
    public $message;
    public $tid;
    public function ThreadExp($message,$i){
        $this->message=$message;
        $this->tid=$i;
    }
    public function toString(){
        return $this->tid." ".$this->message."。";
    }
}