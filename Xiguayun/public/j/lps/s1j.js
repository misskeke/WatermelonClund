(function(paper){
    var clHxx=paper.path("M 20 50 L 21 50");
    clHxx.attr({stroke: "#FFFFFF","stroke-width":2});
    clHxx.animate({path:"M 20 50 L 70 50"}, 300, function(){
        var txtTit=paper.text(50,35,"1");
        txtTit.attr({"text-anchor": "end", "font-size": 24, fill: "#FFFFFF", opacity:0});
        txtTit.animate({opacity:1},250);
        var txtMpt=paper.text(75,35,"补充一些资料……");
        var icoQue=paper.text(40,90,"");
        var icoF=paper.text(300,140,"");
        var icoM=paper.text(400,140,"");
        var uuSexask=paper.text(90,90,"您的性别是？");
        var tetRet=paper.text(80,60,"帐号还未完成创建，您现在可以暂时不填写，您已经拥有此用户名，下次点击注册将自动跳至这里。");
        $(icoQue.node).find('tspan').html('&#xe600;');
        $(icoF.node).find('tspan').html('&#xe602;');
        $(icoM.node).find('tspan').html('&#xe601;');
        icoQue.attr({"text-anchor": "start", "font-size": 40, fill: "#FFFFFF", opacity:0});
        icoF.attr({"text-anchor": "start", "font-size": 60, fill: "#6897BB", opacity:0});
        icoM.attr({"text-anchor": "start", "font-size": 60, fill: "#FF8DA1", opacity:0});
        txtMpt.attr({"text-anchor": "start", "font-size": 18, fill: "#FFFFFF", opacity:0});
        tetRet.attr({"text-anchor": "start", "font-size": 16, fill: "#FFFFFF", opacity:0});
        uuSexask.attr({"text-anchor": "start", "font-size": 16, fill: "#FFFFFF", opacity:0});
        txtMpt.animate({opacity:1},250);
        icoQue.animate({opacity:1},250);
        tetRet.animate({opacity:1},250,function(){
            uuSexask.animate({opacity:1},250);
            icoF.animate({opacity:1},250);
            icoM.animate({opacity:1},250);
        });
        function nxt(sexIsF){
        }
        $(icoQue.node).find('tspan').attr({class:"icof"});
        $(icoF.node).find('tspan').attr({class:"icof xui-a xui-aBig"}).click(function(){
            nxt(true);
        });
        $(icoM.node).find('tspan').attr({class:"icof xui-a xui-aBig"}).click(function(){
            nxt(false);
        });
    });
})(window.paper);