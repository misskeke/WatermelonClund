XAPI.showWorld = function () {
    var reflushinterval=0;
    var exited=false;
    var dlcont = XAPI.showCont("<h1>世界动态</h1>",function(){
        clearInterval(reflushinterval);
        XAPI.log("cleared interval for worlds page");
        exited=true;
    });
    // api/list_world_t.php
    var tiecot = $('<div style="min-height: 100px;  margin: 16px; box-shadow: 0 0 8px #000; background-color: #ffffff;"><div class="topjz">请稍候…………………………………………</div></div>');
    dlcont.append(tiecot);
    dlcont.find('*').css({opacity: 0, x: "150px"}).eachanimate({opacity: 1, x: "0px"}, true, 390, 75, false, "easeOutExpo", function () {
    });
    $("body").animate({backgroundColor: "#87CEFA"}, 350);
    var minc=0;
    function loadpge(min, max, frist, ct, dg) {
        XAPI.log(min+" - "+max);
        XAPI.ui.addState("正在加载 tid: "+min+"~"+max);
        if(frist){
            tiecot.find(".topjz").remove();
        }
        $('.contuineuload').remove();
        if(minc==0){
            minc=min;
        }else if(minc>min){
            minc=min;
        }
        tiecot.find(".contuineuload").remove();
        XAPI.send("api/list_world_t.php", {mn: min, mx: max}, function (q) {
            var pge=$('<div class="page" style="opacity: 0;"></div>');
            for (var i = 0; i < q.t.length; i++) {
                (function (t) {
                    var tiet = $('<div style="padding: 4px; cursor: pointer;"></div>').mouseenter(function () {
                        tiet.css({backgroundColor: "#E8E8E8"});
                    }).mouseleave(function () {
                            tiet.css({backgroundColor: "#ffffff"});
                        });
                    tiet.append($("<div style='font-size: 65%; color: #0c1e3f;'></div>").text("@" + t.author).append(
                        $('<span style="margin-left: 20px; color: #323232;"></span>').text((function (t) {
                            var te = new Date();
                            te.setTime(t * 1000);
                            return te.toLocaleString()
                        })(t.time))));
                    tiet.append($("<div style='word-break: break-all;'></div>").text(t.content.length>400? t.content.substr(0,400)+" ...":t.content));
                    pge.append(tiet);
                })(q.t[i]);
            }
            if(dg){
                tiecot.prepend(pge);
            }else{
                tiecot.append(pge);
            }
            var pgehei=pge.height();
            pge.css({rotateX:"90deg",height:"0px"}).transit({opacity:1,rotateX:"0deg",height:pgehei+"px"},250);
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
                    var tiet = $('<div class="topjz" style="padding: 4px; cursor: pointer;"></div>').mouseenter(function () {
                        tiet.css({backgroundColor: "#E8E8E8"});
                    }).mouseleave(function () {
                            tiet.css({backgroundColor: "#ffffff"});
                        }).text("往上继续加载").click(function () {
                            XAPI.ui.addState("正在往上加载");
                            tiecot.find(".topjz").remove();
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