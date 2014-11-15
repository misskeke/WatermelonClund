$(function(){
    var xb=$('.xb');
    $('.xbF').click(function(){
            xb.val("男");
    });
    $('.xbM').click(function(){
            xb.val("女");
    });
    XLIB.centEditCf($('.ttc'));
    $('.btcc').html("<h1>这样</h1>的是这个页面的大标题，一般只会出现一次。<h2>我是第二标题</h2>一般会出现很多次。<h3>第三</h3><h4>第四</h4>");
});