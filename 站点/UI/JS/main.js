window.lastsend=0;
window.lastget=0;
$(function () {
    window.ru=function(){
        XAPI.log("========= Important =========");
        console.log("%c注意！","font-size: 500%; color: #E42E1A; text-shadow: 0 0 4px #000; font-family: '微软雅黑', Tahoma, Arial;");
        console.log("%c这是用于开发的一个浏览器功能。如果任何人让你在这里粘贴些内容为了任何目的，那是一个骗局并且可能允许对方盗取你的帐号！ ","font-size: 180%; color: #101010; text-shadow: 0 0 4px #000; font-family: '微软雅黑', Tahoma, Arial;");
    };
    window.ci=setInterval(function(){
        console.clear();
        ru();
    },100);
    window.X_RELOAD=function(){
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
                    console.log("%c###### loaded "+scr,"color: #284d72");
                    if(cbc){
                        cbc();
                    }
                    completeStateAcount++;
                    changeGd();
                    window.lastget=new Date().getTime();
                }
            };
        },50);
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