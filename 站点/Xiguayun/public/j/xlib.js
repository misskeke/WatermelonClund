var XLIB = {};
XLIB.chgUrl = function (url) {
    history.replaceState({}, {}, url);
};
XLIB.wcAddErrtestAutoNo = function (ipt, oc) {
    ipt[0].nst = ipt.attr("placeholder");
    ipt.bind(XLIB.onTxtChangSpd, function () {
        ipt.removeClass("xui-input-error");
        if (ipt[0].st) {
            ipt[0].st.remove();
        }
        ipt.unbind('mousedown');
        ipt.attr("placeholder", ipt[0].nst);
        if (oc) {
            oc();
        }
    });
};
XLIB.wcAddErrtest = function (ipt, txt, rt, ontc) {
    ipt.focus().select().addClass("xui-input-error");
    var st = $('<div class="xui-errcrc"></div>').css({left: (ipt.offset().left + ipt.width()) + "px", top: ipt.offset().top + "px"})
        .text(txt).bind('focus blur keydown keyup paste cut mousedown mouseup click mousewheel', function () {
            ipt.focus().select();
            setTimeout(function () {
                ipt.focus().select();
            }, 1);
            st.remove();
        });
    $('body').append(st);
    if (rt) {
        ipt.attr("placeholder", rt);
        if (ipt.val().length > 0) {
            st.append($('<div style="opacity: 0.5; font-size: 60%;"></div>').text(rt).mousedown(function () {
                ipt.val(rt);
                if (ontc) {
                    ontc();
                }
            }));
        } else {
            ipt.mousedown(function () {
                ipt.val(rt);
                if (ontc) {
                    ontc();
                }
                ipt.unbind('mousedown');
            });
        }
    }
    ipt[0].st = st;
};
XLIB.strSpaceOh = function (s) {
    return s.replace(/^\s+|\s+$/gm, '');
};
XLIB.rds = function (l) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < (l || 6); i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};
XLIB.onTxtChangSpd = "focus blur keydown keyup paste cut mousedown mouseup click mousewheel";