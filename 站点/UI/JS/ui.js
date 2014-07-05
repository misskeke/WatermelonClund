XAPI.ui = {
    createDInput: function (icontext) {
        var ipt = $("<div style='display: inline-block; margin: 4px; padding: 0; min-height: 32px; height: 32px; width: 250px; position: relative; font-size: 18px;'></div>");
        var edit = $('<input style="display: inline-block; opacity: 0.6; overflow: hidden; white-space: nowrap;  position: absolute; left: 32px; right: 0; width:100%; top: 0; line-height: 32px; background-color: #ffffff; bottom: 0; box-shadow: 0 0 3px #000 inset; font: inherit; border: none; margin: 0; border:0; outline:none;">');
        var icond = $("<div class='iconfont' style='display: inline-block; cursor: pointer; position: absolute; width: 32px; text-align: center; top: 0; line-height: 32px; bottom: 0; left: 0; background-color: #005dff; color: #ffffff; font-size: 24px;'></div>").html(icontext);
        var texttitle = $("<div style='position: absolute; left: 36px; line-height: 32px; white-space: nowrap; overflow: hidden; right: 0; font-size: 80%; top: 0; bottom: 0; z-index: 3; opacity: 0.6; pointer-events: none;'></div>");
        ipt.append(texttitle);
        ipt.append(icond);
        texttitle.click(function(){
            edit[0].select();
        });
        icond.click(function () {
            edit[0].select();
        });
        ipt.append(edit);
        var lasthas=false;
        function evtctitle(){
            setTimeout(function(){
                if(edit.val().length>0 && !lasthas){
                    texttitle.stop(true,true,true).animate({opacity:0},150);
                    lasthas=true;
                }else if(edit.val().length==0 && lasthas){
                    texttitle.stop(true,true,true).animate({opacity:0.6},150);
                    lasthas=false;
                }
            },1);
        }
        edit.keydown(evtctitle);
        edit.bind("paste",evtctitle);
        edit.bind("cut",evtctitle);
        edit.bind("focus",function(){
            edit.stop(true,true,true).animate({opacity:1},150);
            evtctitle();
        });
        edit.bind("blur",function(){
            edit.stop(true,true,true).animate({opacity:0.6},150);
            evtctitle();
        });
        ipt.bind("mousemove",evtctitle);
        return {text: function (text) {
            if (text) {
                edit.val(text);
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
            $edit: edit, $icon: icond, ipt: ipt, $texttitle: texttitle};
    },
    createDBotton:function(text){
        var btn=$("<div style='display: inline-block; box-shadow: 0 0 10px rgba(0, 0, 0, 0.51),0 -2px 0 rgba(0, 0, 0, 0.51) inset; color: #ffffff; cursor: pointer; background-color: #0059cd; font-size: 20px; line-height: 30px; margin: 4px; padding: 4px 8px 4px 8px;'></div>")
            .text(text);
        btn.mouseenter(function(){
            btn.stop(true,true,true).animate({backgroundColor:"#004DAB"},150);
        });
        btn.mouseleave(function(){
            btn.stop(true,true,true).animate({backgroundColor:"#0059CD"},150);
        });
        return btn;
    }
};
(function(){
    var dhman=$('.dh');
    XAPI.ui.dhst=$('<div class="dh_state" style="position: absolute; text-align: center; left: 0; right: 0; top: 0; bottom: 0; line-height: 32px; font-size: 14px; opacity: 0.7; pointer-events: none;"></div>');
    dhman.append(XAPI.ui.dhst);
})();
XAPI.ui.addState=function(s){
    XAPI.ui.dhst.text(s);
    if(XAPI.ui.dhslastTimeout>0){
        clearTimeout(XAPI.ui.dhslastTimeout);
    }
    XAPI.ui.dhslastTimeout=setTimeout(function(){
        XAPI.ui.dhslastTimeout=0;
        XAPI.ui.dhst.text("");
    },3000);
};