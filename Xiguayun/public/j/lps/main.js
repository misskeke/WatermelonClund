(function(){
    try{
        $('.dd_pgr').css({width: "750px"});
        var bx=$('.box_vcd');
        bx.html('');
        console.info('...');
        bx.append($('<div class="xb_cavmain"></div>'));
        window.paper=Raphael(bx[0],800,1000);
        (function(paper){
            var tdd=paper.rect(0,0,800,3);
            tdd.attr({fill:"#000000", stroke: "none"});
            var ldc=paper.rect(0,49,800,1);
            ldc.attr({fill:"#5F0CA3", stroke: "none"});
            bx.animate({height: "300px"}, 1000, 'jswing');
            $('.dd_pgr').css({width: "800px", height: "0"});
            ldc.animate({y: 0, height: 300}, 1000, 'bounce', function(){
                tdd.remove();
                $.getScript("/j/lps/s1j.js");
            });
        })(window.paper);
    }catch (e){
        console.info(e);
    }
})();