/*! Eachanimate_jQueryPlugin
 Author: dorab_org->dorabar->Wangtingmao
 Needed: jQuery jQuery_UI jQuery_Transit(plugin)*/
(function ($) {
    $.fn.eachanimate = function (animates, usetransit, spend, eachdelay, rondom, essing, alldone) {
        var elearr = this.toArray();
        if (rondom) {
            elearr.sort(function () {
                return Math.random() > 0.75 ? -1 : 1;
            });
        }
        for (var i = 0; i < elearr.length; i++) {
            var l = (i == elearr.length - 1);
            var n = i;
            (function (noi, islast) {
                setTimeout(function () {
                    var $ele = $(elearr[noi]);
                    if (usetransit) {
                        $ele.transit(animates, spend, essing, function () {
                            if (islast) {
                                alldone.call($(elearr));
                            }
                        });
                    } else {
                        $ele.animate(animates, spend, essing, function () {
                            if (islast) {
                                alldone.call($(elearr));
                            }
                        });
                    }
                }, i * (eachdelay == 0 ? spend : eachdelay));
            })(n, l);
        }
    }
})(jQuery);