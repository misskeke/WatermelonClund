var x={
    user:function(name,uid){
        this.__name=name;
        this.__uid=uid;
    }
};
x.user.prototype.name=function(){
};
x.user.prototype.uid=function(){
};

interface x.registered extends x.user {
    function registerIp();
    function password();
    function registerTime();
}

interface x.banable extends x.user {
    function state();
    function group();
}

interface x.man extends x.registered, banable, user {
    function email();
    function sex();
}

interface x.emillcred extends x.man {
    function emillCorrented();
    function headPic();
}