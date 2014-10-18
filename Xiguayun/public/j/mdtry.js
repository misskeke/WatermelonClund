$(function () {
    var useript = $('.mdTestarea');
    var rig = $('.dRight');
    var lastcent = useript.val();
    if (localStorage.mdTestBl) {
        useript.val(localStorage.mdTestBl);
    }
    var lasttimeout = -1;
    setInterval(function () {
        if (useript.val() != lastcent) {
            clearTimeout(lasttimeout);
            lastcent = useript.val();
            lasttimeout = setTimeout(function () {
                $.post('/markdown/preview', {md: lastcent, wisChk: pdWisChk}, function (q) {
                    rig.html(q.preview);
                    if (q.error) {
                        rig.append($('<div class="wigWitherror"></div>').text(q.error));
                    }
                    XLIB.reflashLight();
                }, 'json');
                localStorage.mdTestBl = lastcent;
            }, 500);
        }
        useript.css({minHeight: rig.height() + "px"});
    }, 50);
});