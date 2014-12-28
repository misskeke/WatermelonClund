$(function () {
    var useript = $('.lginusn'), passipt = $('.lginpwd'), lginsbmit = $('.lginsbmit');
    var lastcent = useript.val();
    var lasttimeout = -1;
    setInterval(function () {
        if (useript.val() != lastcent) {
            clearTimeout(lasttimeout);
            lastcent = useript.val();
            lasttimeout = setTimeout(function () {
                XLIB.chgUrl(lastcent.match(/\S/) ? "/login/" + encodeURIComponent(lastcent) : "/login");
            }, 500);
        }
    }, 50);
    XLIB.wcAddErrtestAutoNo(useript);
    XLIB.wcAddErrtestAutoNo(passipt);
    lginsbmit.click(function(){
        lginsbmit.attr({disabled:true});
        $.post("/usr/login",{wisChk: pdWisChk, name:useript.val(),passwd:passipt.val()},function(q){
            if(q.unerror){
                XLIB.wcAddErrtest(useript, q.unerror);
            }else if(q.perror){
                XLIB.wcAddErrtest(passipt, q.perror);
            }else{
                window.location.assign(pagedata.redir);
            }
        },'json');
        lginsbmit.removeAttr("disabled");
    });
});
