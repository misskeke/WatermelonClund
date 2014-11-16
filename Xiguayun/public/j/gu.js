$(function(){
    var xb=$('.xb');
    $('.xbF').click(function(){
            xb.val("男");
    });
    $('.xbM').click(function(){
            xb.val("女");
    });
    XLIB.wcAddErrtestAutoNo(xb);
    $('.subm').click(function(){
        if(xb.val().length<1){
            XLIB.wcAddErrtest(xb, "必须要有性别哦","无性");
            return;
        }
        if(xb.val().trim().length>5){
            XLIB.wcAddErrtest(xb, "性别太长了啦");
            return;
        }
        $.post("/register/finish",{wisChk: pdWisChk, sex:xb.val()},function(q){
            if(q.successful){
                window.location="/";
            }
        }, 'json');
    });
});