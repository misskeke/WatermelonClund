(function(paper){
    var clHxx=paper.path("M 10 80 L 790 80");
    clHxx.attr({stroke: "#FFFFFF","stroke-width":1,opacity:0});
    clHxx.animate({opacity:0.8},250);
    var lt=paper.text(200,150,"> 准备好了，开始播放吧 <");
    lt.attr({"text-anchor": "start", "font-size": 32, fill: "#FFFFFF", opacity:0});
    lt.animate({opacity:1},150);
    $(lt.node).find('tspan').attr({class:"xui-a xui-aBig"});
    var it=paper.text(230,180,"> 下次吧，先带我进入首页 <");
    it.attr({"text-anchor": "start", "font-size": 24, fill: "#FFFFFF", opacity:0});
    it.animate({opacity:1},150);
    $(it.node).find('tspan').attr({class:"xui-a xui-aBig"});
    setInterval(function(){
        window.scrollBy(0,5);
    },20);
})(window.paper);