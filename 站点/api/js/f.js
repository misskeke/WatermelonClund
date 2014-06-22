(function(){
    function xapilog(str){
        console.info("["+new Date().toTimeString().substr(0,8)+"|XAPI] - "+str);
    }
    xapilog("loaded!");
    window.XAPI={log: xapilog};
    XAPI.log("loading user api...");
    $.getScript("api/js/user.js",function(){
        XAPI.log("User Api loaded");
    });
    XAPI.log("loading RSA api...");
    $.getScript("UI/JS/lib/rsa.js",function(){
        XAPI.log("RSA Api loaded");
    });
})();