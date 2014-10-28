$(function () {
    $.getScript = function(j,s){
        jQuery.ajax({
            url: j,
            dataType: "script",
            cache: true
        }).done(function() {
            s && s();
        });
    };
    var intel;
    $('.dbd').mousedown(function () {
        if (!intel) {
            $(document).mouseup(function () {
                $(document).unbind("mouseup");
                if (intel) {
                    clearInterval(intel);
                    intel = 0;
                }
            });
            intel = setInterval(function () {
                window.scrollBy(0, -((window.scrollY / 100) + 1 < 30 ? (window.scrollY / 100) + 1 : 30));
            }, 1);
        }
    });
    function addClose() {
        $('.sucrf_close').css({display: "inline"}).animate({opacity: 1}, 200).click(function () {
            $('.sucrf').animate({opacity: 0, height: "0px"}, 300, function () {
                $('.sucrf').remove();
            });
            $('.sucrf_close').unbind('click');
        });
    }

    var ttl = setTimeout(function () {
        $('.sucrf').animate({opacity: 0, height: "0px"}, 1500, function () {
            $('.sucrf').remove();
        }).unbind('mousemove').mousemove(function () {
            $('.sucrf').stop(true, false, false).animate({opacity: 1, height: "50px"}, 150);
            addClose();
        });
    }, 3500);
    $('.sucrf').mousemove(function () {
        clearTimeout(ttl);
        addClose();
    });
});