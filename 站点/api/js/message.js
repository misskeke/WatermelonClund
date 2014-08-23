XAPI.user.onloginfinished_msg = function (red) {
    XAPI.log("Messgae System running!");
    var nf = (window.Notification ? window.Notification : window.webkitNotifications);

    function ccstart() {
        if (XAPI.user.ccstarted) {
            return;
        }
        XAPI.user.ccstarted = true;
        XAPI.log("message.ccstart");
        var bdp = $('<div style="position: fixed; right: 2px; top: 38px; padding: 4px; font: 12px \'新宋体\'; z-index: 1499; background-color: #fdf7cc; box-shadow: 1px 1px 2px #000; border-radius: 3px; width: 120px;"></div>');
        $('body').append(bdp);
        if (bdp.html().length > 0) {
            bdp.css({display: "block"});
        } else {
            bdp.css({display: "none"});
        }
        bdp.css({display: "none"});
        setInterval(function () {
            var ydy;
            if ((ydy = $('#ydNoteExtensionClipper')).length > 0) {
                ydy.animate({opacity: 0}, 400, function () {
                    ydy.remove();
                });
                //new nf("√有道云笔记",{icon:"UI/img/notificationicons.png",body:"你是无法捕捉这个网站的内容的233"});
                var dhk = XAPI.ui.createDiagbox("试图访问http资源", function () {
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                }, "650px", "auto");
                dhk.c.append($('<div style="color: deeppink;"></div>').text(
                        "[blocked] The page at 'https://maomao/#{}' was loaded over HTTPS, but ran insecure co" +
                            "ntent from 'http://note.youdao.com/yws/mapi/wcp?method=putfile&keyfrom=wcp&from=c" +
                            "hrome&vendor=ChromeStore': this content should also be loaded over HTTPS.")).append
                    ($('<div style="color: darkcyan;"></div>').text("非常抱歉，由于chrome对https的安全内容访问" +
                        "http的不安全内容的限制，在加上为了您的安全着想，您在有道云笔记支持https之前无法使用有道云笔记。"));
                XAPI.log("youdao note find!");
            }
        }, 500);
        var nowTz = [];
        var sync = false;

        function typenumtostr(type) {
            switch (parseInt(type)) {
                case 1:
                    return "新回复";
                default :
                    return "null";
            }
        }

        function showNf(type, ac, onc) {
            if (!nf) {
                return {close: function () {
                }};
            }
            var nft = new nf("有新消息！", {icon: "UI/img/notificationicons.png", body: "您有" + ac + "条" + typenumtostr(type) + "！"});
            nft.onclick = onc;
            return nft;
        }

        function uhandler(irc) {
            if (nowTz[irc]) {
                XAPI.log("close tz: " + irc);
                nowTz[irc].nf.close();
                nowTz[irc] = undefined;
            }
            XAPI.log("msg - " + irc);
            if (irc == 1) {
                var died = false;
                var dig = XAPI.ui.createDiagbox("新回复", function () {
                    died = true;
                }, '0px', '0px');

                function sw() {
                    if (died) {
                        return;
                    }
                    dig.c.css({width: (window.innerWidth - 60) + "px", height: (window.innerHeight - 120) + "px"});
                    requestAnimationFrame(sw);
                }

                sw();
                var cc = dig.c;
                var cont = $('<div style="overflow-y: auto; overflow-x: hidden; position: absolute; left: 8px; right: 8px; top: 32px; bottom: 8px;"></div>');

                function getc() {
                    cont.html("正在加载……");
                    XAPI.send("api/reply_me.php", {}, function (q) {
                        getTz();
                        if (q.errid != 0) {
                            cont.html("错误：" + q.errmsg + "，");
                            cont.append($('<a href="javascript:void(0);">点此重试</a>').click(function () {
                                getc();
                            }));
                        } else {
                            cont.html("");
                            for (var i = 0; i < q.t.length; i++) {
                                (function (t) {
                                    var td = $('<div style="margin: 4px;"></div>');
                                    var tzshowed = false;
                                    td.append($('<div style="background-color: #e8e8e8;"></div>').append($('<img style="vertical-align: middle;">')
                                            .attr("src", XAPI.user_hadpic_get(t.email, 32))).append(
                                            $('<a style="color: cornflowerblue; margin-right: 6px; margin-left: 2px;" href="javascript:void(0);"></a>').text("@" + t.user).click(function () {
                                                dig.close();
                                                XAPI.showUser(t.uid, XAPI.getPage());
                                            })
                                        ).append($('<span>回复了</span>').append($('<a href="javascript:void(0);">我的贴子</a>').click(function () {
                                            if (tzshowed) {
                                                return;
                                            }
                                            cont.find('.close').click();
                                            tzshowed = true;
                                            var cc = $('<div style="padding: 4px; background-color: #cdcdcd">正在加载...</div>');

                                            function tryc() {
                                                XAPI.send("api/by_tid.php", {tid: t.my_tid}, function (q) {
                                                    if (q.errid != 0) {
                                                        cc.text(q.errmsg);
                                                        cc.append($('<a href="javascript:void(0);">重试</a>').click(function () {
                                                            cc.html("正在加载...");
                                                            tryc();
                                                        }))
                                                    } else {
                                                        cc.html("");
                                                        XAPI.clr(cc, q);
                                                    }
                                                });
                                            }

                                            var close = $('<div></div>').append($('<a class="close" href="javascript:void(0);">关闭</a>').click(function () {
                                                tzshowed = false;
                                                cc.remove();
                                                close.remove();
                                            }));
                                            td.append(close);
                                            td.append(cc);
                                            tryc();
                                        })).append($('<span>：</span>')))
                                        .append($('<a style="float: right; vertical-align: middle; line-height: 32px; color: #5ab500;" href="javascript:void(0);">快速回复</a>').click(function () {
                                            XAPI.sendTieShow(t.my_tid, XAPI.getUerHfQz(t.user));
                                        })));
                                    td.append($('<div style="font-style: oblique; font-size: 16px; padding-left: 18px; padding-top: 4px; padding-bottom: 4px; padding-right: 18px;"></div>')
                                        .text(t.reply_content));
                                    cont.append(td);
                                })(q.t[i])
                            }
                        }
                    });
                }

                getc();
                cc.append(cont);
            }
        }

        XAPI.user.msgh = function (t) {
            return uhandler(t);
        };
        function getTz() {
            if (sync) {
                return;
            }
            sync = true;
            XAPI.send("api/get_ssr_acount.php", {}, function (q) {
                bdp.html("");
                if (q.errid == 0) {
                    var arrc = q.msgs;
                    for (var ir = 1; ir <= 1; ir++) {
                        if (nowTz[ir]) {
                            nowTz[ir].check = false;
                        }
                    }
                    for (var i = 0; i < arrc.length; i++) {
                        (function (u) {
                            bdp.append($('<div>' + parseInt(u.count) + '个</div>').append($('<a href="javascript:void(0);">' + typenumtostr(u.type) + '</a>').click(function () {
                                uhandler(u.type);
                            })));
                            var tzz = nowTz[u.type];
                            if (tzz) {
                                tzz.check = true;
                                if (tzz.count != u.count && u.count > 0) {
                                    try {
                                        tzz.nf.close();
                                    } catch (e) {
                                    }
                                    nowTz[u.type].count = u.count;
                                    XAPI.log("nowTz: " + u.type + " was change to " + u.count);
                                    tzz.nf = showNf(u.type, u.count, function () {
                                        uhandler(u.type);
                                    });
                                } else if (u.count < 1) {
                                    try {
                                        tzz.nf.close();
                                    } catch (e) {
                                    }
                                    nowTz[u.type].check = false;
                                }
                            } else if (u.count > 0) {
                                nowTz[u.type] = {check: true, nf: showNf(u.type, u.count, function () {
                                    uhandler(u.type);
                                }), count: u.count};
                            }
                        })(arrc[i]);
                    }
                    for (var irc = 1; irc <= 1; irc++) {
                        if (nowTz[irc]) {
                            if (!nowTz[irc].check) {
                                XAPI.log("close tz: " + irc);
                                nowTz[irc].nf.close();
                                nowTz[irc] = undefined;
                            }
                        }
                    }
                }
                setTimeout(getTz, 5000);
                XAPI.log("tz:: ");
                console.info(nowTz);
                if (bdp.html().length > 0) {
                    bdp.css({display: "block"});
                } else {
                    bdp.css({display: "none"});
                }
                sync = false;
            });
        }

        getTz();
    }

    if (!red) {
        if (nf) {
            var img = document.createElement("img");
            img.src = "UI/img/notificationicons.png";
            img.onload = function () {
                XAPI.log("Icon loaded! ccstart running..");
                ccstart();
            };
        } else {
            XAPI.log("No nf! ccstart running");
            ccstart();
        }
    }
    if (!nf) {
        return;
    }
    if (nf && nf.permission != "granted") {
        var digc = XAPI.ui.createDiagbox("请求桌面通知的权限……", function () {
        }, "450px", "auto");
        var dig = digc.c;
        dig.append((function () {
            if (!red) {
                return $('<div style="color: deepskyblue;">您的浏览器已拒绝我们显示桌面通知……<br>' +
                    '桌面通知可以使您即使无需查看该网页也可以知道有新消息，让您最及时的知道新消息。</div>')
            } else {
                return $('<div style="color: deepskyblue;">申请权限失败。（您的浏览器拒绝）您可以关闭此窗口以停用通知，或者检查您的设置并再试一次</div>')
            }
        })());
        dig.append(XAPI.ui.createDBotton("点击此处允许此网页显示桌面通知").click(function () {
            nf.requestPermission(function (status) {
                digc.close();
                if (nf.permission !== status) {
                    nf.permission = status;
                }
                setTimeout(function () {
                    XAPI.user.onloginfinished_msg(true);
                }, 1000);
            });
        }));
    }
};