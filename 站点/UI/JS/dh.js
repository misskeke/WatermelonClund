(function () {
    $('.dh').animate({top: "0px"}, 400, "easeOutBack", function () {
        $('.waterbate').animate({opacity: 1}, 250);
    });
    $('.dh_link').mouseenter(function () {
        $(this).stop(true, true).animate({backgroundColor: "rgb(99,99,99)"}, 200);
    }).mouseleave(function () {
            $(this).stop(true, true).animate({backgroundColor: "transparent"}, 200);
        });
})();
