(function(paper){
    var clHxx=paper.path("M 20 50 L 21 50");
    clHxx.attr({stroke: "#FFFFFF","stroke-width":2});
    clHxx.animate({path:"M 20 50 L 70 50"}, 300, function(){
        var txtTit=paper.text(50,35,".");
        txtTit.attr({"text-anchor": "end", "font-size": 24, fill: "#FFFFFF", opacity:0});
        txtTit.animate({opacity:1},250);
        var txtMpt=paper.text(75,35,"即将完成……");
        var icoQue=paper.text(40,90,"");
        var icoF=paper.text(300,140,"");
        var icoM=paper.text(400,140,"");
        var uuSexask=paper.text(90,90,"您的性别是？");
        var tetRet=paper.text(80,60,"不必非常真实。如果是外星人请随意选一个。");
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
            // 是否是男
            var bx=$('.box_vcd');
            var ugColor = (sexIsF?"#F15D78":"#31698A");
            var urColor = ((sexIsF?"#98B4C4":"#F3748C"));
            bx.css({backgroundColor:ugColor});
            var ldc=paper.rect(0,0,800,350);
            ldc.attr({fill:ugColor, stroke: "none",opacity:0});
            ldc.animate({opacity:1},300);
            var jdc=paper.rect(0,0,800,1);
            jdc.attr({fill:urColor, stroke: "none"});
            jdc.animate({height:350},1500,'bounce',pan(sexIsF));
        }
        // FOR DEBUG
        nxt(false);
        $(icoQue.node).find('tspan').attr({class:"icof"});
        $(icoF.node).find('tspan').attr({class:"icof xui-a xui-aBig"}).click(function(){
            nxt(true);
        });
        $(icoM.node).find('tspan').attr({class:"icof xui-a xui-aBig"}).click(function(){
            nxt(false);
        });
    });
    function pan(sexIsF){
        return function(){
            var clHxx=paper.path("M 20 50 L 21 50");
            clHxx.attr({stroke: "#FFFFFF","stroke-width":2});
            clHxx.animate({path:"M 20 50 L 70 50"}, 300, function(){
                var txtTit=paper.text(50,35,"!");
                txtTit.attr({"text-anchor": "end", "font-size": 24, fill: "#FFFFFF", opacity:0});
                txtTit.animate({opacity:1},250);
                var txtMpt=paper.text(75,35,"账户已经创建");
                var tetRet=paper.text(80,60,"您可以花2分钟看看这段小短片，也可以直接进入首页。");
                txtMpt.attr({"text-anchor": "start", "font-size": 18, fill: "#FFFFFF", opacity:0});
                tetRet.attr({"text-anchor": "start", "font-size": 16, fill: "#FFFFFF", opacity:0});
                txtMpt.animate({opacity:1},250);
                tetRet.animate({opacity:1},250);
                $.getScript("/j/lps/shortVideo_init.js");
            });
            var bx=$('.box_vcd');
            var jdc=paper.rect(0,0,800,1);
            jdc.attr({fill:"#000000", stroke: "none"});
            jdc.animate({height:640},1500,'bounce');
            bx.animate({height: "640px"}, 1000, 'jswing');
        };
    }
})(window.paper);