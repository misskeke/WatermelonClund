$(function () {
    window.X_BODYCHTML=$('body').html();
    window.X_RELOAD=function(){
        if(window.XAPI){
            if(XAPI.showCont){
                XAPI.showCont("");
            }
        }
        $('body').html(X_BODYCHTML);
        $.getScript("api/js/f.js", function () {
            XAPI.log("XAPI script getted!");
            $.getScript("UI/JS/dh.js",function(){
                XAPI.log("dh getted!");
            });
        });
    };
    X_RELOAD();
});