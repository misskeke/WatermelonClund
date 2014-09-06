$(function () {
    var b = $('.banner');
    var r = Raphael(b[0], $(document.body).width(), 300);
    var rectBgr = r.rect(0, 0, $(document.body).width(), 300);
    rectBgr.attr({
        gradient: "270-#7cb6f0-#a0cfff:5-#FFFFFF:30",
        stroke: "none"
    });
    window.onresize = function () {
        r.setSize($(document.body).width(), 300);
        rectBgr.attr({
            width: $(document.body).width() + "px"
        });
    };
    function hd2jd(j){
        return j * Math.PI / 180;
    }
    function rdClor() {
        var r = parseInt(Math.random() * 200);
        var g = parseInt(Math.random() * 200);
        var b = parseInt(Math.random() * 200);
        return "#" + r.toString(16) + g.toString(16) + b.toString(16);
    }
    function ddrXMain() {
        requestAnimationFrame(function(){
            for(var cp=0;cp<1;cp++){
                (function(){
                    var tAcou = 80;
                    var xpt = 200;
                    var sec = 500;
                    var cx = parseInt(Math.random() * $(document.body).width());
                    var cy = parseInt(Math.random() * 125);
                    var ds = hd2jd(-parseInt(Math.random() * 180));
                    var clc=rdClor();
                    for (var i = 0; i < tAcou; i++) {
                        if(i%6==0){
                            ds = hd2jd(-parseInt(Math.random() * 180));
                            clc = rdClor();
                            xpt=parseInt(Math.random()*100)+150;
                        }
                        (function(ds,clc,xpt){
                            setTimeout(function () {
                                var tz = r.circle(cx, cy, 0);
                                tz.attr({
                                    fill: clc,
                                    stroke: "none",
                                    opacity:0
                                });
                                var txMrbc = xpt * Math.cos(ds);
                                var tyMrbc = xpt * Math.sin(ds);
                                tz.animate({
                                    cx: cx + txMrbc,
                                    cy: cy + tyMrbc,
                                    opacity: 1,
                                    r: 2
                                }, sec, 'cubic-bezier(0,0,.33,1)', function () {
                                    tz.animate({
                                        opacity: 0,
                                        cy: cy + tyMrbc + 25,
                                        r: 0
                                    }, 200, 'cubic-bezier(1,1,0,0)', function () {
                                        tz.remove();
                                    });
                                });
                            }, 10 * i);
                        })(ds,clc,xpt)
                    }
                    setTimeout(ddrXMain, 200);
                })();
            }
        });
    }
    ddrXMain();
    var cbcPath= r.path(strp);
    cbcPath.attr({
        fill:"#eea96e",
        stroke: "none",
        opacity:0
    });
    var ttl=cbcPath.getTotalLength();
    for(var i=0;i<ttl;i+=Math.random()){
        var p=cbcPath.getPointAtLength(i);
        (function(p){
            setTimeout(function(){
                var cric=r.circle(p.x, p.y+parseInt(Math.random()*40)+20, 0);
                cric.attr({
                    fill: rdClor(),
                    stroke: "none",
                    opacity:0
                });
                cric.animate({
                    opacity:1,
                    r:1,
                    cy: p.y
                },250);
            },i*10);
        })(p);
    }
    setTimeout(function(){
        cbcPath.animate({opacity:1},1000);
    },ttl*10);
});