XAPI.showWorld = function () {
    var reflushinterval=0;
    var exited=false;
    var dlcont = XAPI.showCont("<h1><div style='max-width: 600px; margin: auto; text-align: left;'>世界动态</div></h1>",function(){
        dlcont.css({textAlign:"left"});
        clearInterval(reflushinterval);
        reflushinterval=0;
        XAPI.log("cleared interval for worlds page");
        exited=true;
    });
    dlcont.css({textAlign:"center"});
    // api/list_world_t.php
    var tiecot = $('<div style="min-height: 100px; text-align: left; margin: 16px auto auto auto; box-shadow: 0 0 8px #000; background-color: #ffffff; max-width: 600px;"><div class="topjz">请稍候…………………………………………</div></div>');
    dlcont.append(tiecot);
    dlcont.find('*').css({opacity: 0, x: "150px"}).eachanimate({opacity: 1, x: "0px"}, true, 390, 75, false, "easeOutExpo", function () {
    });
    $("body").animate({backgroundColor: "#87CEFA"}, 350);
    var minc=0;
    function loadpge(min, max, frist, ct, dg) {
        XAPI.log(min+" - "+max);
        XAPI.ui.addState("正在加载 tid: "+min+"~"+max);
        if(frist){
            var ani=tiecot.find(".topjz");
            ani.css("pointer-events","none");
            ani.animate({height:"0px"},150,function(){
                ani.remove();
            });
        }
        var anic=tiecot.find(".contuineuload");
        anic.css("pointer-events","none");
        anic.animate({height:"0px"},150,function(){
            anic.remove();
        });
        if(minc==0){
            minc=min;
        }else if(minc>min){
            minc=min;
        }
        XAPI.send("api/list_world_t.php", {mn: min, mx: max}, function (q) {
            var pge=$('<div class="page" style="opacity: 0;"></div>');
            for (var i = 0; i < q.t.length; i++) {
                (function (t) {
                    var tiet = $('<div style="padding: 4px 16px 4px 16px; border-bottom: solid 1px rgba(50, 116, 174, 0.29);"></div>').mouseenter(function () {
                        tiet.css({backgroundColor: "#E8E8E8"});
                    }).mouseleave(function () {
                            tiet.css({backgroundColor: "#ffffff"});
                        });
                    tiet.append($("<div style='font-size: 65%; cursor: pointer; color: #0c1e3f;'></div>").text("@" + t.author).append(
                        $('<span style="margin-left: 20px; color: #323232;"></span>').text((function (t) {
                            var te = new Date();
                            te.setTime(t * 1000);
                            return te.toLocaleString()
                        })(t.time))).prepend($('<img style="vertical-align: middle; margin: 5px;">')
                            .attr("src",XAPI.user_hadpic_get((t.email==null?"":t.email),32))).click(function(){
                            XAPI.showUser(t.uid,{});
                        }));
                    var pobj=XAPI.cpXXCode(t.content);
                    var cc=$("<div style='word-break: break-all;'></div>");
                    for(var i=0;i<pobj.length;i++){
                        if(i>400){
                            cc.append($('<span class="str" style="opacity: 0; color: #5a86ff;"></span>').text("……"));
                            break;
                        }
                        (function(o){
                            if(o.str!="\n" && o.str){
                                cc.append($('<span class="str" style="opacity: 0;"></span>').text(o.str));
                            }else if(o.picid){
                                var img=$('<div class="pic" style="color: #990000;">正在加载图片</div>');
                                cc.append(img);
                                setTimeout(function(){
                                    if(reflushinterval!=0){
                                        XAPI.send("api/pic_get_url.php",{picid: o.picid},function(q){
                                            if(q.errid!=0){
                                                img.text(q.errmsg);
                                            }else{
                                                img.html("").append($("<img style='max-width: 60%;'>").css("cursor","pointer").attr("src", q.picurl).click(function(){
                                                    XAPI.pages.startPage({picPage: o.picid, callback:{}});
                                                }));
                                                var thei=img.height();
                                                img.css({height:"0px"}).animate({height:thei+"px"},200,function(){
                                                    img.css({height:"auto"});
                                                });
                                            }
                                        });
                                    }
                                },i*300);
                            }else if(o.str=="\n"){
                                cc.append($('<br>'));
                            }
                        })(pobj[i])
                    }
                    tiet.append(cc);
                    pge.append(tiet);
                    var cps=cc.find(".str");
                    cps.css({scale:1.5}).eachanimate({opacity:1,scale:1},true,120,1500/cps.length,true,"linear",function(){});
                })(q.t[i]);
            }
            if(q.t.length>0){
                if(dg){
                    tiecot.prepend(pge);
                }else{
                    tiecot.append(pge);
                }
            }
            var pgehei=pge.height();
            pge.css({rotateX:"90deg",height:"0px"}).transit({opacity:1,rotateX:"0deg",height:pgehei+"px"},250,function(){
                pge.css({height:"auto"});
            });
            var tiet = $('<div class="contuineuload" style="padding: 4px; cursor: pointer;"></div>').mouseenter(function () {
                tiet.css({backgroundColor: "#E8E8E8"});
            }).mouseleave(function () {
                    tiet.css({backgroundColor: "#ffffff"});
                }).text("继续加载").click(function () {
                    loadpge(minc-8,minc-1, false,7);
                });
            tiecot.append(tiet);
            if(frist){
                (function(){
                    var tiet = $('<div class="topjz" style="padding: 4px; cursor: pointer; border-bottom: solid 1px rgba(50, 116, 174, 0.29);"></div>').mouseenter(function () {
                        tiet.css({backgroundColor: "#E8E8E8"});
                    }).mouseleave(function () {
                            tiet.css({backgroundColor: "#ffffff"});
                        }).text("往上继续加载").click(function () {
                            XAPI.ui.addState("正在往上加载");
                            var ani=tiecot.find(".topjz");
                            ani.css("pointer-events","none");
                            ani.animate({height:"0px"},150,function(){
                                ani.remove();
                            });
                            XAPI.send("api/get_last_tid.php",{},function(q){
                                var last= q.lasttid;
                                var cst=last-max;
                                XAPI.log(cst);
                                loadpge(min+ct,last,true,cst,true);
                            });
                        });
                    tiecot.prepend(tiet);
                })();
            }
        });
    }
    if(!exited){
        reflushinterval=setInterval(function(){
            tiecot.find('.topjz').click();
        },7500);
    }
    XAPI.ui.addState("获取最后一贴tid...");
    XAPI.send("api/get_last_tid.php",{},function(q){
        loadpge(q.lasttid-15, q.lasttid, true,16);
    });
    XAPI.chgUrl({});
};