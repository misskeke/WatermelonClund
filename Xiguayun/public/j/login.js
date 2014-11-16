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
        lginsbmit.removeAttr("disabled");
    });
});