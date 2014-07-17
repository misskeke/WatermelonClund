(function () {
    function screenshotPage() {
        var screenshot = $('<div style="font-family: \'微软雅黑\', Tahoma, Arial; color: black;font-size: 16px;background-color: '+$('body').css("background-color")+';word-break: break-all !important;">'+$('body').html()+'</div>')[0];
        var sshs=$(screenshot).find('.dh').css({opacity:0});
        for(var i=0;i<sshs.length;i++){
            if($(sshs[i]).css("position")=="fixed"){
                $(sshs[i]).css({opacity:0});
            }
        }
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
    XAPI.dhp=function(){
        $('.dh_content').find('.dh_link').unbind("mouseenter mouseleave").mouseenter(function () {
            $(this).stop(true, true).animate({backgroundColor: "rgba(99,99,99,0.5)"}, 200);
        }).mouseleave(function () {
                $(this).stop(true, true).animate({backgroundColor: "transparent"}, 200);
            });
    };
    XAPI.dhp();
    $.getScript("UI/JS/aero.js",function(){
        XAPI.log("A E R O getted!");
        setInterval(function(){
            var scr=window.scrollY;
            var scy=window.scrollX;
            $('.aero').html("").append($(screenshotPage()).css({y:-scr-8,x:-scy}));
        },10);
    });
})();
