window.lastsend=0;
window.lastget=0;
if(!window.requestAnimationFrame){
    if(window.webkitRequestAnimationFrame){
        window.requestAnimationFrame=webkitRequestAnimationFrame;
    }else{
        window.requestAnimationFrame=function(f){
            setTimeout(function(){
                f(0);
            },20);
        }
    }
}
var ps=setInterval(function(){
    if(!window.$){
        return;
    }
    clearInterval(ps);
    $(function () {
        window.X_RELOAD=function(){
            var cts=$('<div class="s" style="font-size: 12px; opacity: 0.5; cursor: default; background-color: #e9e9e9; overflow: auto; border: solid 1px #686868;"></div>');
            $('.content').append(cts);
            setInterval(function(){
                var gsend=(new Date().getTime()<lastsend+200);
                var gget=(new Date().getTime()<lastget+200);
                document.title="西瓜云 "+(gsend?"-":".")+" "+(gget?"-":".")+" "+((new Date().getTime()<lastsend+80)?"=":".")+" "+((new Date().getTime()<lastget+80)?"=":".");
            },1);
            var u=function(){
                if(completeStateAcount<allStateAcount){
                    jdc.animate({backgroundColor:"#ff0000"},500,function(){
                        if(completeStateAcount<allStateAcount){
                            setTimeout(function(){
                                if(completeStateAcount<allStateAcount){
                                    jdc.animate({backgroundColor:"#000000"},500,function(){
                                        setTimeout(function(){
                                            if(completeStateAcount<allStateAcount){
                                                window.location.reload();
                                            }
                                        },1000);
                                    });
                                }
                            },3000);
                        }
                    });
                }
            };
            var lastinit=setTimeout(u,5000);
            // DEBUG start
            var getScriptSync=[];
            window.completeStateAcount=0;
            window.allStateAcount=16;
            var jdc=$('.lstate .loadjdt');
            function changeGd(){
                var jd=completeStateAcount/allStateAcount;
                var px=parseInt(jd*100)+"%";
                jdc.stop(true,false,false).animate({width: px,backgroundColor:(function(){
                    var rx= 1,gx=135,bx=253;
                    var ry= 6,gy=248,by=83;
                    var rt=parseInt(rx+(jd*(ry-rx)));
                    var gt=parseInt(gx+(jd*(gy-gx)));
                    var bt=parseInt(bx-(jd*(bx-by)));
                    return "rgb("+rt+","+gt+","+bt+")";
                })()},500);
                console.info(px);
            }
            $.getScript=function(script,callback){
                getScriptSync.push({s:script,c:callback});
                changeGd();
            };
            setInterval(function(){
                if(getScriptSync.length<1){
                    return;
                }
                var scr=getScriptSync[0].s;
                var cbc=getScriptSync[0].c;
                getScriptSync.splice(0,1);
                var script=document.createElement("script");
                window.lastsend=new Date().getTime();
                script.src=scr;
                console.log("%c###### loading "+scr,"color: #284d72");
                $('head')[0].appendChild(script);
                script.onload = script.onreadystatechange = function(){
                    clearTimeout(lastinit);
                    lastinit=setTimeout(u,5000);
                    if(  ! this.readyState
                        || this.readyState=='loaded' || this.readyState=='complete'
                        ){
                        script.onload=script.onreadystatechange=null;
                        console.log("%c###### loaded "+scr,"color: #284d72");
                        if(cbc){
                            cbc();
                        }
                        $('.content .s').append($('<div>'+(completeStateAcount*2+2)+'/'+allStateAcount*2+' - JPP -in '+scr+' -out eval</div>'));
                        completeStateAcount++;
                        changeGd();
                        window.lastget=new Date().getTime();
                    }
                };
                $('.content .s').append($('<div>'+(completeStateAcount*2+1)+'/'+allStateAcount*2+' - GET -cache '+scr+'</div>'));
            },1);
            // DEBUG end
            $.getScript("UI/JS/lib/jqui.js",function(){
                $.getScript("UI/JS/lib/jquery.Transit.js",function(){
                    $.getScript("UI/JS/lib/Eachanimate.jQuery.js",function(){
                        $.getScript("api/js/f.js");
                    });
                })
            });
        };
        X_RELOAD();
    });
},50);