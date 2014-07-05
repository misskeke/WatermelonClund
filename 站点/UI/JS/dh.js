(function () {
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
})();
