$(function () {
    $.getScript("UI/JS/dh.js");
    $.getScript("api/js/f.js", function () {
        XAPI.log("XAPI script getted!");
    });
});