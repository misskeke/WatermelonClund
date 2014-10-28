$(function () {
    $('.dd_pgr').css({width: "200px"});
    $.getScript("https://static.websint.org/j/jquery.easing.1.3.js",function(){
        $('.dd_pgr').css({width: "400px"});
        $.getScript("https://static.websint.org/j/raphael-min.js",function(){
            $('.dd_pgr').css({width: "600px"});
            $.getScript("/j/lps/main.js");
        });
    });
});