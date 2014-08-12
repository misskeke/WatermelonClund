XAPI.kw=function(){
    XAPI.log("KW start!");
    var dh=$('.dh');
    var serchBox=XAPI.ui.createDInput("");
    serchBox.$icon.css({opacity:0,display:"none"});
    var bw=innerWidth-(dh.find('.userbar').offset()?dh.find('.userbar').offset().left:innerWidth);
    serchBox.$edit.css({backgroundColor:"rgba(255,255,255,0.8)",lineHeight:"24px",fontSize:"12px",height:"24px", padding:"2px"});
    serchBox.$texttitle.css({lineHeight:"24px",fontSize:"12px",height:"24px", padding:"2px",textAlign:"center"});
    serchBox.ipt.css({position:"absolute",right:(bw+5)+"px",top:"0",height:"24px",width:"200px",zIndex:1700,opacity:0});
    serchBox.texttitle("搜索推吧、帖子或用户");
    serchBox.maxLength(32);
    dh.append(serchBox.ipt.animate({opacity:1},250));
    var serching=false;
    var serchResultBox=$('<div style="background-color: #ffffff; box-shadow: 0 0 2px #000; display: none; opacity: 0; z-index: 1701; border-radius: 5px; position: fixed; top: 34px; right: 2px; width: 300px; min-height: 30px;" class="no_mirror"></div>');
    serchBox.set_eva(function(){
        if(serching){
            if(serchBox.text().length<1){
                serching=false;
                serchResultBox.stop(true,false,false).css({display:"block"}).animate({opacity:0},250,function(){
                    serchResultBox.css({display:"none"});
                });
            }
        }else{
            if(serchBox.text().length>0){
                serchResultBox.html('');
                serching=true;
                serchResultBox.stop(true,false,false).css({display:"block"}).animate({opacity:1},250,function(){
                    serchResultBox.css({display:"block"});
                });
            }
        }
    });
    var lastser="";
    var serchinge=false;
    function ser(){
        if(serchinge){
            return;
        }
        var sc=serchBox.text();
        if(lastser==sc || sc==""){
            lastser=sc;
            setTimeout(ser,250);
            return;
        }
        lastser=sc;
        serching=true;
        XAPI.send("api/search.php",{s:sc},function(q){
            serchinge=false;
            if(q.errid==0){
                serchResultBox.html('<h2>搜索“'+$('<span/>').text(sc).html()+'”的结果</h2>');
                var bars= q.bar;
                for (var i=0;i<bars.length;i++){
                    (function(b){
                        var barys=$('<div style="padding: 2px; font-size: 16px; cursor: pointer;"></div>');
                        barys.mouseenter(function(){
                            barys.stop(true,false,false).transit({scale:1.1},200,'linear');
                        }).mouseleave(function(){
                            barys.stop(true,false,false).transit({scale:1},200,'linear');
                        });
                        serchResultBox.append(barys);
                        var dx=$('<img style="opacity: 0; height: 40px; display: inline-block; vertical-align: middle; margin: 4px;">');
                        barys.append(dx);
                        barys.append($('<div style="display: inline-block; vertical-align: middle;"></div>').append(
                                $('<div style="font-size: 120%;"></div>').text(b.fname.substr(0,8)+(b.fname.length>6?"...":""))).append($('<div style="opacity: 0.8; font-size: 14px;"></div>')
                                .append($('<span class="iconfont">&#xe616;</span>')).append($('<span style="margin-left: 4px;"></span>').text(b.fallow_num))
                                .append($('<span class="iconfont" style="margin-left: 10px; vertical-align: middle; font-size: 150%;">&#xe617;</span>'))
                                .append($('<span style="margin-left: 4px;"></span>').text(b.thread_num))));
                        barys.click(function(){
                            XAPI.showBar(b.fid);
                        });
                        XAPI.send("api/pic_get_url.php",{picid: b.headpic},function(q){
                            if(q.errid==0){
                                dx.attr("src", q.picurl).animate({opacity:1},150);
                            }
                        });
                    })(bars[i]);
                }
                var usrs= q.user;
                for (var ia=0;ia<usrs.length;ia++){
                    (function(b){
                        var barys=$('<div style="padding: 2px; font-size: 16px; cursor: pointer;"></div>');
                        barys.mouseenter(function(){
                            barys.stop(true,false,false).transit({scale:1.1},200,'linear');
                        }).mouseleave(function(){
                            barys.stop(true,false,false).transit({scale:1},200,'linear');
                        });
                        serchResultBox.append(barys);
                        var dx=$('<img style="height: 40px; display: inline-block; vertical-align: middle; margin: 4px;">');
                        barys.append(dx);
                        barys.append($('<div style="display: inline-block; vertical-align: middle;"></div>').append(
                                $('<div style="font-size: 120%;"></div>').text(b.username.substr(0,8)+(b.username>6?"...":""))));
                        dx.attr("src", XAPI.user_hadpic_get(b.email,32));
                        barys.click(function(){
                            serchBox.text("");
                            XAPI.showUser(b.uid);
                        });
                    })(usrs[ia]);
                }
            }else{
                serchResultBox.html('<h2>Oh..搜索“'+$('<span/>').text(sc).html()+'”的时候出现了问题……</h2>');
                serchResultBox.append($('<div class="error"></div>').text(q.errmsg));
            }
            setTimeout(ser,100);
        });
    }
    setTimeout(ser,500);
    $('body').append(serchResultBox);
    setInterval(function(){
        bw=innerWidth-(dh.find('.userbar').offset()?dh.find('.userbar').offset().left:innerWidth);
        serchBox.ipt.css({right:(bw+5)+"px"});
    },20);
};
XAPI.showBar=function(fid){
    XAPI.chgUrl({fid:fid});
    var rfi;
    var ct = XAPI.showCont("", function () {
        clearInterval(rfi);
        rfi=0;
        XAPI.log("IMG page unloaded");
    });
    $("body").animate({backgroundColor: "#e3ecf3"}, 350);
    var dbox=$('<div style="min-height: 1000px; text-align: left; margin: 16px auto auto auto; box-shadow: 0 0 8px #000; background-color: #ffffff; width: 75%; width: calc(100% - 100px); width: -moz-calc(100% - 100px); width: -webkit-calc(100% - 100px);"></div>');
    ct.append(dbox);
    var titlebox=$('<div style="background-color: #d9d9d9; font-size: 24px; color: #7a7a7a; line-height: 40px; text-align: center; cursor: default; user-select: none; -webkit-user-select: none;"></div>');
    titlebox.text("正在加载");
    dbox.append(titlebox);
    ct.find('*').css({opacity: 0, x: "150px"}).eachanimate({opacity: 1, x: "0px"}, true, 390, 75, false, "easeOutExpo", function () {
    });
};