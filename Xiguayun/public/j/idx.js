$(function(){
    $('.pbtit').animate({opacity: 1, marginTop: "0px"},1200,'easeOutCubic');
    setTimeout(function(){
        $('.czz').animate({opacity: 1, marginTop: "0px"},1200,'easeOutCubic');
        setTimeout(function(){
            $('.rit').animate({opacity: 1, marginTop: "0px"},1200,'easeOutCubic');
        },150);
    },150);
    var pub=$('.indextpb');
    pub.animate({marginTop: "0px", paddingTop: "180px"}, 800, 'easeInCubic');
    function ddc(){
        pub.css({top: window.scrollY+"px"});
        console.info(window.scrollY);
        $('.lgb').css({opacity: (100-Math.min(100,window.scrollY))/100});
        ((requestAnimationFrame || webkitRequestAnimationFrame) || setTimeout)(ddc);
    }
    ddc();
});
