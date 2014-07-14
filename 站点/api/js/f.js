(function () {
    function xapilog(str) {
        console.info("[" + new Date().toTimeString().substr(0, 8) + "|XAPI] - " + str);
        $('.xapi_log_shower').text(str);
    }

    xapilog("loaded!");
    window.XAPI = {
        log: xapilog,
        timeZoneToDate: function(tz){
            var date=new Date();
            date.setTime(tz*1000);
            return date;
        }
    };
    XAPI.$cont=$('.content');
    XAPI.setdh = function (dh) {
        var rt=$('.dh_content').html(dh);
        XAPI.dhp();
        return rt;
    };
    $.getScript("UI/JS/lib/md5.js",function(){
        XAPI.log("md5.js loaded");
        $.getScript("UI/JS/ui.js",function(){
            XAPI.log("WebsintUI loaded");
            $.getScript("api/js/user.js", function () {
                XAPI.log("User Api loaded");
            });
        });
    });
    var lastswit=function(){};
    XAPI.showCont=function(html,onswitch){
        lastswit();
        if(onswitch){
            lastswit=onswitch;
        }else{
            lastswit=function(){};
        }
        XAPI.$cont.html(html);
        return XAPI.$cont;
    }
    XAPI.ult={
        getPagesWillShow:function(currentPage,max){
            var min=currentPage-5;
            if(min<1){
                min=1;
            }
            var pages=[];
            for(var cu=min;cu<=min+10;cu++){
                if(cu>max){
                    break;
                }
                pages.push(cu);
            }
            return pages;
        }
    };
})();
