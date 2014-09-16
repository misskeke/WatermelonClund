$(function () {
    var useript = $('.lginusn');
    var lastcent = useript.val();
    var lasttimeout = -1;
    setInterval(function () {
        if (useript.val() != lastcent) {
            clearTimeout(lasttimeout);
            lastcent = useript.val();
            lasttimeout = setTimeout(function () {
                XLIB.chgUrl(lastcent.match(/\S/) ? "/login/" + lastcent : "/login");
            }, 500);
        }
    }, 50);
});