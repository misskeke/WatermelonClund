XAPI.ui = {
    createDInput: function (icontext) {
        var ipt = $("<div style='display: inline-block; margin: 4px; padding: 0; min-height: 32px; height: 32px; width: 250px; position: relative; font-size: 18px;'></div>");
        var edit = $('<input maxlength="256" style="display: inline-block; opacity: 0.6; overflow: hidden; white-space: nowrap;  position: absolute; left: 32px; right: 0; top: 0; line-height: 32px; background-color: #ffffff; bottom: 0; box-shadow: 0 0 3px #000 inset; font: inherit; border: none; margin: 0; border:0; outline:none;">');
        var icond = $("<div class='iconfont' style='display: inline-block; cursor: pointer; position: absolute; width: 32px; text-align: center; top: 0; line-height: 32px; bottom: 0; left: 0; background-color: #005dff; color: #ffffff; font-size: 24px;'></div>").html(icontext);
        var evahandler=null;
        if(location.protocol=="http:"){
            icond.css({backgroundColor:"#4F5D73"});
        }
        var texttitle = $("<div style='position: absolute; left: 36px; line-height: 32px; white-space: nowrap; overflow: hidden; right: 0; font-size: 80%; top: 0; bottom: 0; z-index: 3; opacity: 0.6; pointer-events: none;'></div>");
        ipt.append(texttitle);
        ipt.append(icond);
        texttitle.mousedown(function (e) {
            e.preventDefault();
            edit[0].select();
        });
        icond.mousedown(function (e) {
            e.preventDefault();
            edit[0].select();
        });
        ipt.append(edit);
        var lasthas = false;

        function evtctitle() {
            setTimeout(function () {
                if (edit.val().length > 0 && !lasthas) {
                    texttitle.stop(true, true, true).animate({opacity: 0}, 150);
                    lasthas = true;
                } else if (edit.val().length == 0 && lasthas) {
                    texttitle.stop(true, true, true).animate({opacity: 0.6}, 150);
                    lasthas = false;
                }
                edit.css({width:(parseInt(ipt.css("width"))-32)+"px"});
                if(evahandler){
                    evahandler();
                }
            }, 1);
        }

        edit.keydown(evtctitle);
        edit.bind("paste", evtctitle);
        edit.bind("cut", evtctitle);
        edit.bind("focus", function () {
            edit.stop(true, true, true).animate({opacity: 1}, 150);
            evtctitle();
        });
        edit.bind("blur", function () {
            edit.stop(true, true, true).animate({opacity: 0.6}, 150);
            evtctitle();
        });
        ipt.bind("mousemove", evtctitle);
        evtctitle();
        return {text: function (text) {
            if (text) {
                edit.val(text);
                evtctitle();
            } else {
                return edit.val();
            }
        },
            icon: function (icon) {
                if (icon) {
                    icond.text(icon);
                } else {
                    return icond.text();
                }
            }, texttitle: function (text) {
                if (text) {
                    texttitle.text(text);
                } else {
                    return texttitle.text();
                }
            },
            $edit: edit, $icon: icond, ipt: ipt, $texttitle: texttitle,
        set_eva:function(ev){
            evahandler=ev;
        }, maxLength:function (mx){
                return edit.attr("maxlength",mx);
            }};
    },
    createDBotton: function (text) {
        var btn = $("<a style='display: inline-block; vertical-align: middle; text-align: center; box-shadow: 0 0 10px rgba(0, 0, 0, 0.51),0 -2px 0 rgba(0, 0, 0, 0.51) inset; color: #ffffff; cursor: pointer; background-color: #0059cd; margin: 4px; padding: 4px 8px 4px 8px;' href='javascript:void(0);'></a>")
            .text(text);
        if(location.protocol=="http:"){
            btn.css({backgroundColor:"#4F5D73"});
        }
        btn.mouseenter(function () {
            btn.stop(true, false, false).animate({backgroundColor: "#004DAB"}, 150);
        });
        btn.mouseleave(function () {
            if(location.protocol=="http:"){
                btn.stop(true, false, false).animate({backgroundColor:"#4F5D73"},150);
            }else{
                btn.stop(true, false, false).animate({backgroundColor: "#0059CD"}, 150);
            }
        });
        btn.mousedown(function(e){
            e.preventDefault();
        });
        return btn;
    },
    createDTextArea: function (texttitletext) {
        var are=$('<div style="position: relative; background-color: #ffffff; margin: 4px;"></div>');
        var edit=$('<textarea style="font: inherit; border: none; margin: 0; border:0; resize: none; outline:none; position: absolute; left: 2px; right: 2px; top: 2px; bottom: 2px;"></textarea>');
        var texttitle=$('<div style="position: absolute; opacity: 0.6; z-index: 2; left: 2px; right: 2px; top: 2px; bottom: 2px; pointer-events: none;"></div>').text(texttitletext);
        are.append(edit);
        are.append(texttitle);
        var lasthas = false;

        function evtctitle() {
            setTimeout(function () {
                if (edit.val().length > 0 && !lasthas) {
                    texttitle.stop(true, true, true).animate({opacity: 0}, 150);
                    lasthas = true;
                } else if (edit.val().length == 0 && lasthas) {
                    texttitle.stop(true, true, true).animate({opacity: 0.6}, 150);
                    lasthas = false;
                }
                edit.css({width:(are.width()-8)+"px",height:(are.height()-8)+"px"});
            }, 1);
        }

        edit.keydown(evtctitle);
        edit.bind("paste", evtctitle);
        edit.bind("cut", evtctitle);
        edit.bind("focus", function () {
            edit.stop(true, true, true).animate({opacity: 1}, 150);
            are.stop(true, true, true).animate({opacity: 1}, 150);
            evtctitle();
        });
        edit.bind("blur", function () {
            edit.stop(true, true, true).animate({opacity: 0.6}, 150);
            are.stop(true, true, true).animate({opacity: 0.6}, 150);
            evtctitle();
        });
        edit.css({opacity: 0.6});
        are.css({opacity: 0.6});
        are.bind("mousemove", evtctitle);

        texttitle.click(function () {
            edit[0].select();
        });

        evtctitle();

        return {text: function (text) {
            if (text) {
                edit.val(text);
                evtctitle();
            } else {
                return edit.val();
            }
        }, texttitle: function (text) {
                if (text) {
                    texttitle.text(text);
                } else {
                    return texttitle.text();
                }
            },
            $edit: edit, ipt: are, $texttitle: texttitle};
    },
    createDiagbox:function(dititle,onclose,width,height){
        var hbox=$('<div class="no_mirror" style="position: fixed; z-index: 1600; text-align: center; background-color: rgba(0, 0, 0, 0.65); left: 0; right: 0; top: 0; bottom: 0;"></div>');
        var boxt=$('<div style="margin: 80px auto auto auto; text-align: left; background-color: #ffffff; padding: 32px 8px 8px 8px; box-shadow: 0 0 10px #fff; overflow: auto; position: relative;"></div>');
        var close=$('<div style="position: absolute; right: 4px; top: 4px; font-size: 14px; z-index: 50; cursor: pointer;">×</div>');
        var title=$('<div style="position: absolute; left: 0; padding-left: 4px; cursor: default; -webkit-user-select: none; user-select: none; top: 0; right: 0; height: 24px; line-height: 24px; font-size: 16px; border-bottom: solid 1px skyblue;"></div>');
        title.text(dititle);
        boxt.append(title);
        var body=$('body');
        $('.content').css("-webkit-filter","blur(2px)");
        var bdyoverflow=body.css("overflow");
        body.css("overflow","hidden");
        $('.dhstyle').css("-webkit-filter","blur(2px)");
        boxt.append(close);
        var closed=false;
        function loop(){
            boxt.css({marginTop:((window.innerHeight/2)-(boxt.height()/2))+"px"});
            if(closed){
                return;
            }
            requestAnimationFrame(loop);
        }
        loop();
        close.click(function(){
            if(closed){return;}
            closed=true;
            hbox.stop(true,false,false).animate({opacity:0},180+200,'easeInSine');
            boxt.stop(true,false,false).transit({scale:(boxt.width()+30)/boxt.width(),opacity:0.8},180,'easeInOutCubic',function(){
                boxt.transit({opacity:0,scale:0.6},200,'easeOutSine',function(){
                    hbox.remove();
                    $('.content').css("-webkit-filter","");
                    $('.dhstyle').css("-webkit-filter","");
                    body.css("overflow","auto");
                });
            });
            if(onclose){
                onclose();
            }
        });
        hbox.css({opacity:0}).animate({opacity:1},300);
        hbox.append(boxt);
        body.append(hbox);
        boxt.css({width:width,height:height,opacity:0,scale:(boxt.width()+80)/boxt.width()});
        boxt.transit({scale:1,opacity:1},380,'easeInOutCubic');
        return {c:boxt,close:function(){
            close.click();
        }};
    }
};
(function () {
    var dhman = $('.dh');
    XAPI.ui.dhst = $('<div class="dh_state" style="position: absolute; text-align: center; left: 0; right: 0; top: 0; bottom: 0; line-height: 32px; font-size: 14px; opacity: 0.7; pointer-events: none;"></div>');
    dhman.append(XAPI.ui.dhst);
})();
if(location.protocol=="http:"){
    setInterval(function(){
        $(':password').css({backgroundColor:"#F7D0C9"});
    },1);
}
XAPI.ui.addState = function (s) {
    XAPI.ui.dhst.text(s);
    XAPI.log(s);
    if (XAPI.ui.dhslastTimeout > 0) {
        clearTimeout(XAPI.ui.dhslastTimeout);
    }
    XAPI.ui.dhslastTimeout = setTimeout(function () {
        XAPI.ui.dhslastTimeout = 0;
        XAPI.ui.dhst.text("");
    }, 3000);
};
$.getScript("api/js/user.js", function () {
    XAPI.log("User Api loaded");
});