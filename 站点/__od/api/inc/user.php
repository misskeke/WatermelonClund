<?php
require_once "sql.php";

interface user {
    public function name();
    public function uid();
}

interface registered extends user {
    public function registerIp();
    public function chkPassword($pwd);
    public function registerTime();
}

interface banable extends registered {
    public function state();
    public function group();
    public function hasPremission($p);
}

interface man extends banable {
    public function email();
    public function sex();
}

interface emillcred extends man {
    public function emillCorrented();
    public function headPic();
}

class __User implements user {
    protected $name;
    protected $uid;
    protected $usertableline;
    public function name(){
        return $this->name;
    }
    public function uid(){
        return $this->uid;
    }
    public function  __User($user,$uid=0){
        global $mys;
        $this->name=$user;
        $this->uid=$uid;
        if($uid>0){
            $r=$mys->query("SELECT * FROM `user` WHERE `user`.uid = '".$mys->real_escape_string($this->uid)."'");
            if($r->num_rows<1){
                throw new UserNotFindExp("UID=".$this->uid);
            }
            $this->usertableline=$r->fetch_assoc();
        }else{
            $r=$mys->query("SELECT * FROM `user` WHERE `user`.username = '".$mys->real_escape_string($this->name)."'");
            if($r->num_rows<1){
                throw new UserNotFindExp($this->name);
            }
            $this->usertableline=$r->fetch_assoc();
        }
        $this->uid=$this->usertableline["uid"];
        $this->name=$this->usertableline["username"];
    }
    public function sqlLine(){
        return $this->usertableline;
    }
}

class __registered extends __User implements registered {
    public function __registered($u,$i=0){
        parent::__User($u,$i);
    }
    public function registerIp(){
        return $this->usertableline["registerip"];
    }
    public function chkPassword($pwd){
        return $this->usertableline["password"]==ultra::Cmd5($pwd);
    }
    public function registerTime(){
        return $this->usertableline["registerTime"];
    }
}

class __banable extends __registered implements banable {
    public function __banable($u,$i=0){
        parent::__registered($u,$i);
    }
    public function state(){
        return $this->usertableline["state"];
    }
    public function group(){
        return $this->usertableline["group"];
    }
    public function hasPremission($p){
        if($this->state()==1 || $this->state()>2){
            return false;
        }
        // w = AddThread d = DelThread z = SelfDelete b = Ban r = Restore thread m = Modify User
        // n = Modify Self p = Restore Self Thread Delete By Self t = See Deleted Thread o = See Managing logs
        // a = SEE DATABASE and DEBUG LOG and CACHE c = use Headpic
        $groupToPermissionStr=[
            0=>"wznoc",
            1=>"wdzbrmnptoc"
        ];
        $ugroup=$this->group();
        $uprem=$groupToPermissionStr[$ugroup];
        return strpos($uprem,$p)!==false;
    }
}
class __man extends __banable implements man {
    public function __man($u,$i=0){
        parent::__banable($u,$i);
    }
    public function email(){
        return $this->usertableline["email"];
    }
    public function sex(){
        return $this->usertableline["sex"];
    }
}

class __emillcred extends __man implements emillcred {
    public function __emillcred($u,$i=0){
        parent::__man($u,$i);
        if(!$this->emillCorrented()){
            throw new UserEmillNotCorrectedExp($this->name());
        }
    }
    public function emillCorrented(){
        return $this->usertableline["emailCorrented"]>0;
    }
    public function headPic(){
        return;
    }
}


// 0=未设置 1=男 2=女 3=秀吉 4=女汉 5=其他 6=bot

class sex {
    public static $noSetted=0,$man=1,$gir=2,$xman=3,$xgir=4,$oth=5,$bot=6;
}

class UserNotFindExp extends UserExp {
    public function UserNotFindExp($user){
        parent::UserExp("用户未找到",$user);
    }
}
class UserEmillNotCorrectedExp extends UserExp {
    public function UserEmillNotCorrectedExp($user){
        parent::UserExp("用户邮箱未通过验证",$user);
    }
}

abstract class UserExp extends Exception {
    public $message;
    public $username;
    public function UserExp($message,$n){
        $this->message=$message;
        $this->username=$n;
    }
    public function toString(){
        return $this->username." ".$this->message."。";
    }
}