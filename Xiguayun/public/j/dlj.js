$(function () {
    var url=$('.ipturl'),tiny=$('.ipttiny');
    if(location.hash.length>1){
        tiny.val(location.hash.substr(1));
    }
    $('.submit').click(function(){
        if(url.val().length<1){
            XLIB.wcAddErrtest(url, "你的意思是我要猜一个url？","https://websint.org");
            return;
        }
        var portal=url.val().match(/^([A-Za-z0-9]+):\/\//);
        if(portal){
            portal = portal[1] || "http";
        }else{
            url.val("http://"+url.val());
        }
        if(portal && portal != "http" && portal != "https"){
            XLIB.wcAddErrtest(url, "忘了告诉你= = 只支持http和https。");
            return;
        }
        if(tiny.val().length>0){
            if(tiny.val().match(/[\/\\\?#]/)){
                XLIB.wcAddErrtest(tiny, "不能包括/\\?#");
                return;
            }
            if(tiny.val()=="short"){
                XLIB.wcAddErrtest(tiny, "不能用这个- -");
                return;
            }
        }
        $.get("/short?url="+encodeURIComponent(url.val())+(tiny.val().length>0?"&tiny="+encodeURIComponent(tiny.val()):""),function(q){
            if(q.tiny){
                window.location.assign("/"+q.tiny+"?norec=1&successful=1");
            }else{
                XLIB.wcAddErrtest(url, q.error);
            }
        },'json');
    });
    XLIB.wcAddErrtestAutoNo(url);
    XLIB.wcAddErrtestAutoNo(tiny);
});
