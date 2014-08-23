XAPI.kw = function () {
    XAPI.log("KW start!");
    var dh = $('.dh');
    var serchBox = XAPI.ui.createDInput("");
    serchBox.$icon.css({opacity: 0, display: "none"});
    var bw = innerWidth - (dh.find('.userbar').offset() ? dh.find('.userbar').offset().left : innerWidth);
    serchBox.$edit.css({backgroundColor: "rgba(255,255,255,0.8)", lineHeight: "24px", fontSize: "12px", height: "24px", padding: "2px"});
    serchBox.$texttitle.css({lineHeight: "24px", fontSize: "12px", height: "24px", padding: "2px", textAlign: "center"});
    serchBox.ipt.css({position: "absolute", right: (bw + 5) + "px", top: "0", height: "24px", width: "200px", zIndex: 1700, opacity: 0});
    serchBox.texttitle("搜索推吧、帖子或用户");
    serchBox.maxLength(32);
    dh.append(serchBox.ipt.animate({opacity: 1}, 250));
    var serching = false;
    var serchResultBox = $('<div style="background-color: #ffffff; box-shadow: 0 0 2px #000; display: none; opacity: 0; z-index: 1701; border-radius: 5px; position: fixed; top: 34px; right: 2px; width: 300px; min-height: 30px;" class="no_mirror"></div>');
    serchBox.set_eva(function () {
        if (serching) {
            if (serchBox.text().length < 1) {
                serching = false;
                serchResultBox.stop(true, false, false).css({display: "block"}).animate({opacity: 0}, 250, function () {
                    serchResultBox.css({display: "none"});
                });
            }
        } else {
            if (serchBox.text().length > 0) {
                serchResultBox.html('');
                serching = true;
                serchResultBox.stop(true, false, false).css({display: "block"}).animate({opacity: 1}, 250, function () {
                    serchResultBox.css({display: "block"});
                });
            }
        }
    });
    var lastser = "";
    var serchinge = false;

    function ser() {
        if (serchinge) {
            return;
        }
        var sc = serchBox.text();
        if (lastser == sc || sc == "") {
            lastser = sc;
            setTimeout(ser, 250);
            return;
        }
        lastser = sc;
        serching = true;
        XAPI.send("api/search.php", {s: sc}, function (q) {
            serchinge = false;
            if (q.errid == 0) {
                serchResultBox.html('<h2>搜索“' + $('<span/>').text(sc).html() + '”的结果</h2>');
                var bars = q.bar;
                for (var i = 0; i < bars.length; i++) {
                    (function (b) {
                        var barys = $('<div style="padding: 2px; font-size: 16px; cursor: pointer;"></div>');
                        barys.mouseenter(function () {
                            barys.stop(true, false, false).transit({scale: 1.1}, 200, 'linear');
                        }).mouseleave(function () {
                            barys.stop(true, false, false).transit({scale: 1}, 200, 'linear');
                        });
                        serchResultBox.append(barys);
                        var dx = $('<img style="opacity: 0; height: 40px; display: inline-block; vertical-align: middle; margin: 4px;">');
                        barys.append(dx);
                        barys.append($('<div style="display: inline-block; vertical-align: middle;"></div>').append(
                                $('<div style="font-size: 120%;"></div>').text(b.fname.substr(0, 8) + (b.fname.length > 6 ? "..." : ""))).append($('<div style="opacity: 0.8; font-size: 14px;"></div>')
                                .append($('<span class="iconfont">&#xe616;</span>')).append($('<span style="margin-left: 4px;"></span>').text(b.fallow_num))
                                .append($('<span class="iconfont" style="margin-left: 10px; vertical-align: middle; font-size: 150%;">&#xe617;</span>'))
                                .append($('<span style="margin-left: 4px;"></span>').text(b.thread_num))));
                        barys.click(function () {
                            XAPI.showBar(b.fid);
                        });
                        XAPI.send("api/pic_get_url.php", {picid: b.headpic}, function (q) {
                            if (q.errid == 0) {
                                dx.attr("src", q.picurl).animate({opacity: 1}, 150);
                            }
                        });
                    })(bars[i]);
                }
                var usrs = q.user;
                for (var ia = 0; ia < usrs.length; ia++) {
                    (function (b) {
                        var barys = $('<div style="padding: 2px; font-size: 16px; cursor: pointer;"></div>');
                        barys.mouseenter(function () {
                            barys.stop(true, false, false).transit({scale: 1.1}, 200, 'linear');
                        }).mouseleave(function () {
                            barys.stop(true, false, false).transit({scale: 1}, 200, 'linear');
                        });
                        serchResultBox.append(barys);
                        var dx = $('<img style="height: 40px; display: inline-block; vertical-align: middle; margin: 4px;">');
                        barys.append(dx);
                        barys.append($('<div style="display: inline-block; vertical-align: middle;"></div>').append(
                            $('<div style="font-size: 120%;"></div>').text(b.username.substr(0, 8) + (b.username > 6 ? "..." : ""))));
                        dx.attr("src", XAPI.user_hadpic_get(b.email, 32));
                        barys.click(function () {
                            serchBox.text("");
                            XAPI.showUser(b.uid);
                        });
                    })(usrs[ia]);
                }
            } else {
                serchResultBox.html('<h2>Oh..搜索“' + $('<span/>').text(sc).html() + '”的时候出现了问题……</h2>');
                serchResultBox.append($('<div class="error"></div>').text(q.errmsg));
            }
            setTimeout(ser, 100);
        });
    }

    setTimeout(ser, 500);
    $('body').append(serchResultBox);
    setInterval(function () {
        bw = innerWidth - (dh.find('.userbar').offset() ? dh.find('.userbar').offset().left : innerWidth);
        serchBox.ipt.css({right: (bw + 5) + "px"});
    }, 20);
};
XAPI.showBar = function (fid) {
    XAPI.chgUrl({fid: fid});
    var rfi;
    var ct = XAPI.showCont("", function () {
        clearInterval(rfi);
        rfi = 0;
        $(".bgrc").css({backgroundImage: ""});
    });
    $("body").animate({backgroundColor: "#e3ecf3"}, 350);
    var dbox = $('<div style="min-height: 400px; text-align: left; z-index: 1; position: relative; margin: 100px auto auto auto; box-shadow: 0 0 8px #000; background-color: #ffffff; width: 75%; width: calc(100% - 100px); width: -moz-calc(100% - 100px); width: -webkit-calc(100% - 100px);"></div>');
    ct.append(dbox);
    var titlebox = $('<div style="background-color: #d9d9d9; font-size: 24px; color: #7a7a7a; line-height: 40px; text-align: center; cursor: default; user-select: none; -webkit-user-select: none;"></div>');
    titlebox.text("正在加载");
    dbox.append(titlebox);
    ct.find('*').css({opacity: 0, x: "150px"}).eachanimate({opacity: 1, x: "0px"}, true, 390, 75, false, "easeOutExpo", function () {
    });
    XAPI.send("api/bar.php", {f: fid}, function (q) {
        if (q.errid != 0) {
            titlebox.text("Oh");
            dbox.append($('<div class="error"></div>').text(q.errmsg));
            dbox.append(XAPI.ui.createDBotton("重试").click(function () {
                XAPI.showBar(fid);
            }));
            dbox.css({textAlign: "center"});
        } else {
            /*
             background: "0"
             ct: ""
             errid: 0
             errmsg: ""
             fallow_num: "0"
             fid: "1"
             fname: "zaaaaaaa"
             gms: ""
             headpic: "1"
             last_editstate_doid: "0"
             lastsign: "0"
             signnum: "0"
             state: "0"
             swlinks: ""
             thread_num: "0"
             */
            titlebox.text(q.fname);
            XAPI.send("api/pic_get_url.php", {picid: q.background}, function (q) {
                if (q.picurl) {
                    $(".bgrc").css({backgroundImage: "url(" + q.picurl + ")", opacity:1, backgroundSize:"cover", backgroundRepeat: "no-repeat"});
                }
            });
            XAPI.send("api/pic_get_url.php", {picid: q.headpic}, function (q) {
                if (q.picurl) {
                    var hpc=$('<div style="position: absolute; left: 85px; top: 90px; width: 90px; height: 90px; background-size: cover; z-index: 9; border: solid 5px #ffffff; box-shadow: 0 0 4px #000;"></div>');
                    hpc.css({backgroundImage:"url("+ q.picurl+")"});
                    ct.append(hpc);
                }
            });
            var ycbl=$('<div style="position: absolute; right: 0; top: 0; bottom: 0; width: 30px; background-color: #b4d0ac; cursor: pointer; color: #000000; font-size: 18px; text-align: center;">...</div>');
            titlebox.append(ycbl);
            ycbl.mouseenter(function(){
                ycbl.stop(true,false,false).animate({backgroundColor:"#ABD08E"},150);
            });
            ycbl.mouseleave(function(){
                ycbl.stop(true,false,false).animate({backgroundColor:"#b4d0ac"},150);
            });
            var zxvf=$('<div style="position: absolute; right: 30px; top: 0; overflow: hidden; bottom: 0; background-color: #f4f4f4; color: #000000; font-size: 18px; text-align: right; width: 0;"></div>');
            titlebox.append(zxvf);
            var zxcont=$('<div style="display: inline-block; padding-right: 8px; opacity: 0; width: 300px; float: right;"></div>');
            zxvf.append(zxcont);
            var like=$('<span style="cursor: pointer; margin-left: 8px;" class="iconfont">&#xe616;</span>');
            var pcr=$('<span style="cursor: pointer; margin-left: 8px;" class="iconfont">&#xe618;</span>');
            var nolike=$('<span style="cursor: pointer; margin-left: 8px;" class="iconfont">&#xe619;</span>');
            var tj=$('<span style="cursor: pointer; margin-left: 8px;" class="iconfont">&#xe61a;</span>');
            zxcont.append(like);
            zxcont.append(nolike);
            zxcont.append(pcr);
            zxcont.append(tj);
            var isOpen=false;
            ycbl.click(function(){
                if(!isOpen){
                    zxvf.stop(true,false,false).animate({width:"300px"},500,"easeOutExpo");
                    zxcont.stop(true,false,false).animate({opacity:1},500,"easeOutCubic");
                }else{
                    zxvf.stop(true,false,false).animate({width:"0"},500,"easeOutExpo");
                    zxcont.stop(true,false,false).animate({opacity:0},500,"easeOutCubic");
                }
                isOpen=!isOpen;
            });
        }
    });
};