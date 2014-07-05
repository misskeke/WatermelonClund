$(function () {
    $.getScript("api/js/f.js", function () {
        XAPI.log("XAPI script getted!");
        $.getScript("UI/JS/dh.js",function(){
            XAPI.log("dh getted!");
        });
    });
});