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
    if (st.offset().left + 300 > $(window).width()) {
        st.css({left: ($(window).width() - 300) + "px"});
    }
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

XLIB.reflashLight = function () {
    var hls = $('.highlight').find('span');

    function randomRgb(max, min) {
        min = min || 0;
        var r = (parseInt(Math.random() * max) + min).toString(16);
        var g = (parseInt(Math.random() * max) + min).toString(16);
        var b = (parseInt(Math.random() * max) + min).toString(16);
        return "#" + r + g + b;
    }

    var classToRgb = {};
    for (var i = 0; i < hls.length; i++) {
        if (classToRgb[hls[i].className]) {
            $(hls[i]).css({color: classToRgb[hls[i].className]});
        } else {
            var clr = randomRgb(128);
            classToRgb[hls[i].className] = clr;
            $(hls[i]).css({color: clr});
        }
        (function (c) {
            c.mouseenter(function () {
                c.stop(true, false, false);
                var cRs = c.css("color");
                var dbNvc = randomRgb(128);
                c.unbind('mousedown mouseleave');
                c.mousedown(function () {
                    $('.highlight .' + c[0].className).stop(true, false, false)
                        .animate({color: dbNvc}, 250);
                    classToRgb[c[0].className] = dbNvc;
                    c.unbind('mousedown mouseleave');
                });
                c.stop(true, false, false);
                c.animate({color: dbNvc}, 250);
                c.mouseleave(function () {
                    c.stop(true, false, false);
                    c.animate({color: cRs}, 250);
                });
            });
        })($(hls[i]));
    }

    var mde=$('.m');
    mde.find('h1').addClass('mh1');
    mde.find('h2').addClass('mh2');
    mde.find('h3').addClass('mh3');
    mde.find('h4').addClass('mh4');
};

XLIB.centEditCf=function(ct){
    var editing=false;
    var ipt=$('<input class="xui-ipt-editable" type="text">');
    ct.mousedown(function(){
        setTimeout(function(){
            if(!editing){
                var width=ct.width();
                ipt.css({width: width+"px"});
                editing=true;
                ipt.val(ct.text());
                ct.html("");
                ct.append(ipt);
                ipt.animate({width: "200px"},125);
                ipt.focus();
                ipt.blur(function(){
                    ct.text(ipt.val());
                    ipt.remove();
                    editing=false;
                    ct.removeClass("editable-focus");
                });
                ct.addClass("editable-focus");
            }
        },1);
    });
};
XLIB.dinit=function(){
    setTimeout(function(){
        var f=function(){
            console.clear();
            for(var i=0;i<50;i++){
                console.log("                                                            ".substr(i));
            }
            console.log("  Welcome to Xgy's F12 Scripting Platform!");
            for(i=0;i<3;i++){
                console.log("                                                            ".substr(i));
            }
            console.log("         For help, type help()");
            for(i=0;i<3;i++){
                console.log("                                                            ".substr(i));
            }
        };
        eval("("+f.toString()+")();");
    },1);
};
XLIB.dinit();
$(XLIB.reflashLight);