XAPI.showWorld = function () {
    var reflushinterval = 0;
    var exited = false;
    var dlcont = XAPI.showCont("<h1><div style='max-width: 600px; margin: auto; text-align: left;'>世界动态</div></h1>", function () {
        dlcont.css({textAlign: "left"});
        clearInterval(reflushinterval);
        reflushinterval = 0;
        XAPI.log("cleared interval for worlds page");
        exited = true;
    });
    dlcont.css({textAlign: "center"});
    // api/list_world_t.php
    var tiecot = $('<div style="min-height: 100px; text-align: left; margin: 16px auto auto auto; box-shadow: 0 0 8px #000; background-color: #ffffff; max-width: 600px;"><div class="topjz">请稍候…………………………………………</div></div>');
    dlcont.append(tiecot);
    dlcont.find('*').css({opacity: 0, x: "150px"}).eachanimate({opacity: 1, x: "0px"}, true, 390, 75, false, "easeOutExpo", function () {
    });
    $("body").animate({backgroundColor: "#87CEFA"}, 350);
    var minc = 0;

    function loadpge(min, max, frist, ct, dg) {
        XAPI.log(min + " - " + max);
        XAPI.ui.addState("正在加载 tid: " + min + "~" + max);
        if (frist) {
            var ani = tiecot.find(".topjz");
            ani.css("pointer-events", "none");
            ani.animate({height: "0px"}, 150, function () {
                ani.remove();
            });
        }
        var anic = tiecot.find(".contuineuload");
        anic.css("pointer-events", "none");
        anic.animate({height: "0px"}, 150, function () {
            anic.remove();
        });
        if (minc == 0) {
            minc = min;
        } else if (minc > min) {
            minc = min;
        }
        function clr(pge, q, issub, subft) {
            for (var i = 0; i < q.t.length; i++) {
                (function (t) {
                    var tiet = $('<div style="padding: 4px 16px 4px 16px; border-bottom: solid 1px rgba(50, 116, 174, 0.29);"></div>').mouseenter(function () {
                        if (issub) {
                            tiet.stop(true, false, false).animate({backgroundColor: "#F1FDFF"}, 250);
                        } else {
                            tiet.stop(true, false, false).animate({backgroundColor: "#EDEDED"}, 250);
                        }
                    }).mouseleave(function () {
                        if (issub) {
                            tiet.stop(true, false, false).animate({backgroundColor: "transparent"}, 250);
                        } else {
                            tiet.stop(true, false, false).animate({backgroundColor: "#FFFFFF"}, 250);
                        }
                    });
                    if (issub) {
                        tiet.css({backgroundColor: "transparent"});
                    } else {
                        tiet.css({backgroundColor: "#FFFFFF"});
                    }
                    var usrs = $("<div style='font-size: 65%; cursor: pointer; color: #0c1e3f;'></div>").text("@" + t.author).append(
                            $('<span style="margin-left: 20px; color: #323232;"></span>').text((function (t) {
                                var te = new Date();
                                te.setTime(t * 1000);
                                return te.toLocaleString()
                            })(t.time))).prepend($('<img style="vertical-align: middle; margin: 5px;">')
                            .attr("src", XAPI.user_hadpic_get((t.email == null ? "" : t.email), (issub ? 16 : 32)))).click(function () {
                            XAPI.showUser(t.uid, {});
                        }).mouseenter(function () {
                            usrs.stop(true, false, false).animate({backgroundColor: "#FCEFE9"}, 250);
                        }).mouseleave(function () {
                            usrs.stop(true, false, false).animate({backgroundColor: "transparent"}, 250);
                        });
                    tiet.append(usrs);
                    var pobj = XAPI.cpXXCode(t.content);
                    var cc = $("<div style='word-break: break-all;'></div>");
                    for (var i = 0; i < pobj.length; i++) {
                        (function (o) {
                            if (o.str != "\n" && o.str) {
                                cc.append($('<span class="str" style="opacity: 0;"></span>').text(o.str));
                            } else if (o.picid) {
                                var img = $('<div class="pic" style="color: #990000;">正在加载图片</div>');
                                cc.append(img);
                                setTimeout(function () {
                                    if (reflushinterval != 0) {
                                        XAPI.send("api/pic_get_url.php", {picid: o.picid}, function (q) {
                                            if (q.errid != 0) {
                                                img.text(q.errmsg);
                                            } else {
                                                img.html("").append($("<img style='max-width: 60%;'>").css("cursor", "pointer").attr("src", q.picurl).click(function () {
                                                    XAPI.pages.startPage({picPage: o.picid, callback: {}});
                                                }));
                                                var thei = img.height();
                                                img.css({height: "0px"}).animate({height: thei + "px"}, 200, function () {
                                                    img.css({height: "auto"});
                                                });
                                            }
                                        });
                                    }
                                }, i * 300);
                            } else if (o.str == "\n") {
                                cc.append($('<br>'));
                            }
                        })(pobj[i])
                    }
                    tiet.append(cc);
                    if (t.state > 1) {
                        cc.css({opacity: 0.03, backgroundColor: "#FC2802"});
                        var $ci = $('<div style="color: #FC2802; cursor: pointer;">此用户已被屏蔽，若要查看此内容，请点击此处。</div>').click(function () {
                            cc.animate({opacity: 0.8, backgroundColor: "#FE887A"}, 250);
                            $ci.remove();
                        });
                        tiet.append($ci);
                    }
                    var btbar = $('<div style="font-size: 60%; opacity: 0.8;"></div>');
                    tiet.append(btbar);
                    btbar.append($('<a href="javascript:void(0);">回复</a>').click(function () {
                        if (issub) {
                            XAPI.sendTieShow(subft, "@" + t.author + " : ");
                        } else {
                            XAPI.sendTieShow(t.tid);
                        }
                    }));
                    function del(gm) {
                        if (gm) {
                            (function(){
                                var dba = XAPI.ui.createDiagbox("删除帖子", undefined, "650px", "auto");
                                var db = dba.c;
                                db.append($('<div style="color: deepskyblue; font-size: 16px;"></div>').text(
                                    "您要删除的是帖子：" + t.content.substr(0, 15) + "...吗？"
                                ));
                                var cbc = $('<div style="text-align: right;"></div>');
                                db.append(cbc);
                                cbc.append(XAPI.ui.createDBotton("不是这个！").click(function () {
                                    dba.close();
                                }));
                                cbc.append(XAPI.ui.createDBotton("没错就是这个！").click(function () {
                                    cbc.transit({opacity: 0}, 300, function () {
                                        cbc.remove();
                                        var lmb = $('<div></div>');
                                        lmb.css({opacity: 0});
                                        db.append(lmb);
                                        lmb.append($('<div>填写理由</div>'));
                                        var desc = XAPI.ui.createDTextArea("理由");
                                        desc.ipt.css({width: "100%", height: "150px", borderBottom: "solid 1px skyblue"});
                                        lmb.append(desc.ipt);
                                        lmb.append($('<div style="text-align: right;"></div>').append(
                                                XAPI.ui.createDBotton("取消").click(function () {
                                                    dba.close();
                                                })
                                            ).append(
                                                XAPI.ui.createDBotton("确认删除").click(function () {
                                                    tiet.unbind("mouseenter mouseleave").animate({backgroundColor: "#FC4102"}, 250);
                                                    tiet.find('*').unbind();
                                                    XAPI.send("api/del_thread.php", {tid: t.tid, desc: desc.text()}, function () {
                                                        tiet.animate({opacity: 0.3}, 250, function () {
                                                            tiet.css({cursor: "pointer"}).click(function () {
                                                                tiet.animate({height: 0}, 100, function () {
                                                                    tiet.transit({scale: 0}, 250, function () {
                                                                        tiet.remove();
                                                                    })
                                                                })
                                                            });
                                                        })
                                                    });
                                                    dba.close();
                                                })
                                            ));
                                        lmb.animate({opacity: 1}, 350);
                                    });
                                    db.stop(true, false, false).animate({height: "450px"}, 300);
                                }));
                            })();
                        } else {
                            (function(){
                                var dba = XAPI.ui.createDiagbox("删除帖子", undefined, "650px", "auto");
                                var db = dba.c;
                                db.append($('<div style="color: deepskyblue; font-size: 16px;"></div>').text(
                                    "您要删除的是帖子：" + t.content.substr(0, 15) + "...吗？"
                                ));
                                var cbc = $('<div style="text-align: right;"></div>');
                                db.append(cbc);
                                cbc.append(XAPI.ui.createDBotton("取消").click(function () {
                                    dba.close();
                                }));
                                cbc.append(XAPI.ui.createDBotton("确定").click(function () {
                                    tiet.unbind("mouseenter mouseleave").animate({backgroundColor: "#FC4102"}, 250);
                                    tiet.find('*').unbind();
                                    XAPI.send("api/del_thread.php", {tid: t.tid}, function () {
                                        tiet.animate({opacity: 0.3}, 250, function () {
                                            tiet.css({cursor: "pointer"}).click(function () {
                                                tiet.animate({height: 0}, 100, function () {
                                                    tiet.transit({scale: 0}, 250, function () {
                                                        tiet.remove();
                                                    })
                                                })
                                            });
                                        })
                                    });
                                    dba.close();
                                }));
                            })();
                        }
                    }
                    if ((t.uid == XAPI.user.uid && !XAPI.user.isAdmin) || (XAPI.user.isAdmin && t.uid != XAPI.user.uid)) {
                        btbar.append($('<a href="javascript:void(0);" style="margin-left: 4px;">删除</a>').click(function () {
                            del(XAPI.user.isAdmin);
                        }));
                    }
                    if (XAPI.user.isAdmin && t.uid == XAPI.user.uid) {
                        btbar.append($('<a href="javascript:void(0);" style="margin-left: 4px;">删除</a>').click(function () {
                            del(false);
                        }));
                        btbar.append($('<a href="javascript:void(0);" style="margin-left: 4px;">管理删除</a>').click(function () {
                            del(true);
                        }));
                    }
                    btbar.append($("<span style='cursor: default;'>&nbsp;</span>"));
                    if (!issub) {
                        var currpage = 1;
                        btbar.append($('<a href="javascript:void(0);">刷新</a>').click(function () {
                            fr();
                        }));
                        var dd = $('<div></div>');

                        function fr() {
                            dd.html("");
                            var pagebox = $('<div></div>');
                            var dbox = $("<div style='background-color: transparent;'></div>");
                            XAPI.send("api/list_post.php", {tid: t.tid, mn: ((currpage - 1) * 10) + 1, mx: ((currpage - 1) * 10) + 10}, function (q) {
                                var acount = q.num_reply;
                                var pga = Math.ceil(acount / 10);

                                function load(page) {
                                    dbox.html("");
                                    currpage = page;
                                    buildpage();
                                    XAPI.send("api/list_post.php", {tid: t.tid, mn: ((page - 1) * 10) + 1, mx: ((page - 1) * 10) + 10}, function (q) {
                                        show(q);
                                    });
                                }

                                function show(q) {
                                    dbox.html("");
                                    clr(dbox, q, true, t.tid);
                                }

                                function buildpage() {
                                    pagebox.html("");
                                    var pagesh = XAPI.ult.getPagesWillShow(currpage, pga);
                                    for (var i = 0; i < pagesh.length; i++) {
                                        (function (i) {
                                            var pagebtn = $('<a href="javascript:void(0);" style="padding: 4px; display: inline-block; margin: 0;"></a>').text(i).click(function () {
                                                if (currpage == i) {
                                                    return;
                                                }
                                                currpage = i;
                                                load(i);
                                            });
                                            if (currpage == i) {
                                                pagebtn.attr("href", null);
                                                pagebtn.css({color: "#000000", cursor: "default"});
                                            }
                                            pagebox.append(pagebtn);
                                        })(pagesh[i]);
                                    }
                                    var pageinp = XAPI.ui.createDInput("&#xe613;");
                                    pageinp.texttitle("页数");
                                    pageinp.ipt.css({width: "100px", verticalAlign: "middle"});
                                    var jmp = XAPI.ui.createDBotton("跳");
                                    jmp.css({verticalAlign: "middle"});
                                    pagebox.append(pageinp.ipt);
                                    pagebox.append(jmp);
                                    jmp.click(function () {
                                        var jumpto = parseInt(pageinp.text());
                                        if (isNaN(jumpto)) {
                                            return;
                                        } else if (jumpto < 1) {
                                            return;
                                        } else if (jumpto > pga) {
                                            jumpto = pga;
                                            pageinp.text(jumpto);
                                        }
                                        load(jumpto);
                                    });
                                }

                                if (pga > 1) {
                                    buildpage();
                                }
                                show(q);
                            });
                            dd.append(dbox);
                            dd.append(pagebox);
                        }

                        if (t.reply_has) {
                            fr();
                        }
                        tiet.append(dd);
                    }
                    pge.append(tiet);
                    var cps = cc.find(".str");
                    cps.css({scale: 1.5}).eachanimate({opacity: 1, scale: 1}, true, 120, 1500 / cps.length, true, "linear", function () {
                    });
                })(q.t[i]);
            }
        }
        XAPI.send("api/list_world_t.php", {mn: min, mx: max}, function (q) {
            XAPI.ui.addState("");
            var pge = $('<div class="page" style="opacity: 0;"></div>');
            clr(pge, q);
            if (q.t.length > 0) {
                if (dg) {
                    tiecot.prepend(pge);
                } else {
                    tiecot.append(pge);
                }
            }
            var pgehei = pge.height();
            pge.css({rotateX: "90deg", height: "0px"}).transit({opacity: 1, rotateX: "0deg", height: pgehei + "px"}, 250, function () {
                pge.css({height: "auto"});
            });
            if (minc > 1) {
                console.info("minc=" + minc);
                var tiet = $('<div class="contuineuload" style="padding: 4px; cursor: pointer;"></div>').mouseenter(function () {
                    tiet.css({backgroundColor: "#E8E8E8"});
                }).mouseleave(function () {
                    tiet.css({backgroundColor: "#ffffff"});
                }).text("继续加载").click(function () {
                    loadpge(minc - 8, minc - 1, false, 7);
                });
                tiecot.append(tiet);
            }
            if (frist) {
                (function () {
                    var tiet = $('<div class="topjz" style="padding: 4px; cursor: pointer; border-bottom: solid 1px rgba(50, 116, 174, 0.29);"></div>').mouseenter(function () {
                        tiet.css({backgroundColor: "#E8E8E8"});
                    }).mouseleave(function () {
                        tiet.css({backgroundColor: "#ffffff"});
                    }).text("往上继续加载").click(function () {
                        XAPI.ui.addState("正在往上加载");
                        var ani = tiecot.find(".topjz");
                        ani.css("pointer-events", "none");
                        ani.animate({height: "0px"}, 150, function () {
                            ani.remove();
                        });
                        XAPI.send("api/get_last_tid.php", {}, function (q) {
                            var last = q.lasttid;
                            var cst = last - max;
                            XAPI.log(cst);
                            loadpge(min + ct, last, true, cst, true);
                        });
                    });
                    tiecot.prepend(tiet);
                })();
            }
        });
    }

    if (!exited) {
        reflushinterval = setInterval(function () {
            tiecot.find('.topjz').click();
        }, 7500);
    }
    XAPI.ui.addState("获取最后一贴tid...");
    XAPI.send("api/get_last_tid.php", {}, function (q) {
        XAPI.ui.addState("");
        loadpge(q.lasttid - 15, q.lasttid, true, 16);
    });
    XAPI.chgUrl({});
};