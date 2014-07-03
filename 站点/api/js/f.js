(function () {
    function xapilog(str) {
        console.info("[" + new Date().toTimeString().substr(0, 8) + "|XAPI] - " + str);
        $('.xapi_log_shower').text(str);
    }

    xapilog("loaded!");
    window.XAPI = {
        log: xapilog
    };
    XAPI.$cont=$('.content');
    XAPI.setdh = function (dh) {
        $('.dh_content').html(dh).find('.dh_link').mouseenter(function () {
            $(this).stop(true, true).animate({backgroundColor: "rgb(99,99,99)"}, 200);
        }).mouseleave(function () {
                $(this).stop(true, true).animate({backgroundColor: "transparent"}, 200);
            });
        return $('.dh_content');
    };
    $.getScript("UI/JS/ui.js",function(){
        XAPI.log("WebsintUI loaded");
        $.getScript("api/js/user.js", function () {
            XAPI.log("User Api loaded");
        });
    });
    XAPI.showCont=function(html){
        XAPI.$cont.html(html);
        return XAPI.$cont;
    }
})();
