$(function(){
    var xx=$('.xx');
    var ttd=0;
    xx.mouseenter(function(){
        clearTimeout(ttd);
        xx.text("缩短这个页面");
        xx.css({paddingRight: "280px"});
    });
    xx.mouseleave(function(){
        clearTimeout(ttd);
        ttd=setTimeout(function(){
            xx.text("把窝拖进收藏，以后只需点击一下即可缩短点击所在页面！");
            xx.css({paddingRight: ""});
        },800);
    });
});