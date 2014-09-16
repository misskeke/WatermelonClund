(function () {
    function screenshotPage() {
        var body = $('body');
        var screenshot = $('<div style="font-family: \'微软雅黑\', Tahoma, Arial; color: black;font-size: 16px;background-color: ' + body.css("background-color") + ';word-break: break-all !important;">' + body.html() + '</div>')[0];
        $(screenshot).find('.dhstyle').remove();
        $(screenshot).find('.no_mirror').remove();
        screenshot.style.pointerEvents = 'none';
        screenshot.style.overflow = 'hidden';
        screenshot.style.webkitUserSelect = 'none';
        screenshot.style.mozUserSelect = 'none';
        screenshot.style.msUserSelect = 'none';
        screenshot.style.oUserSelect = 'none';
        screenshot.style.userSelect = 'none';
        return screenshot;
    }
    $('.dh').animate({top: "0px"}, 400, "easeOutBack", function () {
        $('.waterbate').animate({opacity: 1}, 250);
    });
    XAPI.dhp = function () {
        $('.dh_content').find('.dh_link').unbind("mouseenter mouseleave").mouseenter(function () {
            $(this).stop(true, true).animate({backgroundColor: "rgba(4,139,250,0.4)"}, 200);
        }).mouseleave(function () {
            $(this).stop(true, true).animate({backgroundColor: "transparent"}, 200);
        });
    };
    XAPI.dhp();
    var isie=!!window.ActiveXObject || "ActiveXObject" in window;
    if(!isie){
        /*
         XAPI.log("A E R O getted!");
         function caa() {
         var scr = (!window.scrollY ? window.document.documentElement.scrollTop : window.scrollY);
         var scy = (!window.scrollX ? window.document.documentElement.scrollLeft : window.scrollX);
         $('.aero').html("").append($(screenshotPage()).css({y: -scr + 1, x: -scy}));
         setTimeout(function(){
         requestAnimationFrame(caa);
         },20);
         }
         requestAnimationFrame(caa);
         */
    }else{
        XAPI.log("A E R O Didn't support ie!");
        $('.aero').remove();
    }
    $.getScript("UI/JS/lib/md5.js", function () {
        XAPI.log("md5.js loaded");
        $.getScript("UI/JS/ui.js", function () {
            XAPI.log("WebsintUI loaded");
        });
    });
})();
