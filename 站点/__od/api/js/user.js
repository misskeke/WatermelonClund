(function () {
    XAPI.user = {};
    XAPI.log("Checking localstorage");
    var username = "";
    var password = "";
    var sid = 0;
    var krr = "";
    var uid = -1;
    var usrinfo;
    var autolog = false;
    if (!window.localStorage) {
        XAPI.log("You Boswer did not support localStorage!");
        XAPI.ui.addState("您的浏览器不支持HTML5的localStorage，因此您不能记住用户名和密码。请换更新的浏览器（如chrome）");
        XAPI.supportRemember = false;
        window.localStorage = {};
    } else {
        XAPI.log("Checking localstorage contant...");
        if (window.localStorage.userName) {
            XAPI.log("find user!");
            username = window.localStorage.userName;
            password = window.localStorage.userPasswd;
            autolog = window.localStorage.autolog == "true" || false;
            XAPI.ui.addState("发现曾经登录过的用户：" + username);
        } else {
            XAPI.log("You had never logined here!");
        }
    }
    function rtt(callback) {
        function nol() {
            var as = XAPI.setdh("<a class='dh_link' href='javascript:XAPI.showWorld();'>世界</a><span class='hidden'>   |   </span><a class='dh_link' href='javascript:XAPI.showLogin();'>登录</a><span class='hidden'>|</span><a class='dh_link' href='javascript:XAPI.showRegister();'>注册</a>").find("a");
            XAPI.ui.addState("您从未在这里登录过，请登录或注册。");
            callback();
        }

        var isie = !!window.ActiveXObject || "ActiveXObject" in window;
        if (isie) {
            XAPI.log("ie?");
            var dibox = XAPI.ui.createDiagbox("不支持IE", undefined, "650px", "auto");
            var ccr = $('<div style="color: deepskyblue;">推吧网页版暂不完全支持IE。请使用chrome(推荐)或者firefox。</div>');
            dibox.c.append(ccr);
            dibox.c.append(XAPI.ui.createDBotton("继续使用IE").click(function () {
                dibox.close();
            }));
        }

        if (localStorage.lastSid) {
            if (localStorage.lastKrr) {
                sid = localStorage.lastSid;
                krr = localStorage.lastKrr;
                uid = localStorage.lastUid;
                XAPI.send("api/checksession.php", {}, function (q) {
                    if (q.successful == 1) {
                        XAPI.loggedShow();
                        callback();
                        XAPI.ui.addState("您曾经登录过但是并未注销！已为您登录");
                    } else {
                        XAPI.log("seassion sid=" + sid + ", krr=" + krr + " is incorrect!");
                        sid = 0;
                        krr = "";
                        uid = 0;
                        delete localStorage.lastSid;
                        delete localStorage.lastKrr;
                        setTimeout(function () {
                            rtt(callback);
                        }, 1);
                    }
                });
                return;
            }
        }
        if (!autolog) {
            nol();
        } else {
            XAPI.ui.addState("正在使用您记住的密码登录");
            XAPI.user.loginUsr(username, password, function (s, m, q) {
                if (s) {
                    sid = q.sid;
                    krr = q.krr;
                    uid = q.uid;
                    XAPI.log("loggened sid=" + sid + ", krr=" + krr + ", uid=" + uid);
                    XAPI.ui.addState("使用您记住的密码登录成功！");
                    localStorage.lastSid = sid;
                    localStorage.lastKrr = krr;
                    localStorage.lastUid = uid;
                    XAPI.loggedShow();
                } else {
                    localStorage.autolog = false;
                }
                callback();
            });
        }
    }

    XAPI.sendTieShow = function (reply_tid, arr) {
        var body = $('body');
        var maint = $('<div class="no_mirror" style="background-color: rgba(0, 0, 0, 0.60); position: fixed; left: 0; right: 0; top: 0; bottom: 0; z-index: 1601;"></div>');
        body.append(maint);
        var ttd = $('<div style="margin: 32px auto auto auto; position: relative; border-radius: 4px; background-color: rgba(255, 255, 255, 0.80); height: 300px; width: 750px; padding: 4px;"></div>');
        maint.append(ttd);
        var edit = XAPI.ui.createDTextArea("推文...");
        if (arr) {
            edit.text(arr);
        }
        edit.ipt.css({position: "absolute", left: "2px", right: "2px", top: "16px", bottom: "40px"});
        ttd.append(edit.ipt);
        var dbd = $('<div style="position: absolute; font-size: 16px; left: 2px; right: 2px; bottom: 2px; height: 36px; text-align: right;"></div>');
        var cancel = XAPI.ui.createDBotton("取消");
        cancel.click(function () {
            maint.animate({opacity: 0, bottom: (window.innerHeight) + "px"}, 150, function () {
                maint.remove();
            });
        });
        function imcb(imgs) {
            var itext = "";
            for (var i = 0; i < imgs.length; i++) {
                (function (img) {
                    itext += "\\p=" + img + "/";
                })(imgs[i]);
            }
            edit.text(edit.text() + itext);
        }
        var ok = XAPI.ui.createDBotton("发推");
        var picinp = XAPI.ui.createDBotton("插入图片");
        ok.click(function () {
            XAPI.ui.addState("正在发推");
            dbd.find(".log_and_error").remove();
            cancel.css({display: "none"});
            ok.css({display: "none"});
            picinp.css({display: "none"});
            dbd.append($('<span class="log_and_error" style="font-size: 80%; color: #5d5d5d;">请稍候</span>'));
            XAPI.send("api/send_tui.php", {content: edit.text(), reply: reply_tid}, function (q) {
                XAPI.ui.addState("");
                if (q.errid != 0) {
                    dbd.find(".log_and_error").remove();
                    dbd.append($('<span class="log_and_error error" style="font-size: 80%;"></span>').text(q.errmsg));
                    cancel.css({display: "inline-block"});
                    ok.css({display: "inline-block"});
                    picinp.css({display: "inline-block"});
                } else {
                    cancel.click();
                }
            });
        });
        dbd.append(picinp);
        dbd.append(cancel).append(ok);
        ttd.append(dbd);
        picinp.click(function () {
            XAPI.user.updateImage(imcb, true);
        });
        maint.css({opacity: 0, bottom: (window.innerHeight) + "px"}).animate({opacity: 1, bottom: "0px"}, 150);
    };
    XAPI.getUerHfQz = function (usr) {
        return "回复 " + usr + " : ";
    };
    XAPI.cpXXCode = function (xxcode) {
        // XXCODE示例：
        // 这是文字这是文字这是文字这是文字这是文字这是\p=123456/pid为123456的图片这是刚刚的代码\\p=123456/。
        var chunks = [];
        for (var now = 0; now < xxcode.length; now++) {
            if (xxcode.charAt(now) != "\\") {
                chunks.push({str: xxcode.charAt(now)});
            } else {
                if (xxcode.charAt(now + 1) == "p" && xxcode.charAt(now + 2) == "=") {
                    var numsbui = "";
                    var nowc = 2;
                    while (true) {
                        nowc++;
                        if (xxcode.charAt(now + nowc) == "/") {
                            break;
                        } else {
                            numsbui += xxcode.charAt(now + nowc);
                        }
                        if (xxcode.charAt(now + nowc).length < 1) {
                            return [
                                {str: "此处的代码有问题"}
                            ];
                        }
                    }
                    chunks.push({picid: numsbui});
                    now += nowc;
                } else if (xxcode.charAt(now + 1) == "\\" && xxcode.charAt(now + 2) == "p" && xxcode.charAt(now + 3) == "=") {
                    chunks.push({str: "\\"});
                    now++;
                } else {
                    chunks.push({str: "\\" + xxcode.charAt(now + 1)});
                    now++;
                }
            }
        }
        return chunks;
    };
    XAPI.loggedShow = function () {
        XAPI.ui.addState("");
        XAPI.log("logined sid: " + sid);
        XAPI.user.uid = uid;
        XAPI.send("api/user_get_info.php", {user: username}, function (q) {
            if (q.errid == 0) {
                usrinfo = q.user;
                XAPI.user.info = usrinfo;
                XAPI.user.isAdmin = (usrinfo.group == 1);
            }
            var dh = XAPI.setdh("<a class='dh_link' href='javascript:XAPI.showWorld();'>世界</a><span class='hidden'> </span><a class='dh_link' href='javascript:XAPI.sendTieShow();'>发推</a>");
            var userbar = $('<a class="userbar dh_link" style="display: inline-block; position: relative; float: right; padding-left: 8px; padding-right: 8px; margin-right: 18px;" href="javascript:void(0)"></a>');
            userbar.text(username);
            userbar.append($('<span class="iconfont" style="margin-left: 4px; font-size: 75%;">&#xe607;</span>'));
            userbar.css({opacity: 0, left: "100px", cursor: "pointer"}).animate({opacity: 1, left: "0px"}, 300);
            $('.dh').append(userbar);
            var usermenubak = $('<div class="no_mirror" style="display: none; position: fixed; left: 0; right: 0; top: 0; bottom: 0; z-index: 1503; background-color: rgba(0,0,0,0)"></div>');
            var usermenu = $('<div class="no_mirror" style="position: fixed; z-index: 1505; background-color: #ffffff; box-shadow: 1px 1px 3px #000; min-height: 12px; min-width: 100px; padding-top: 4px; padding-bottom: 4px;"></div>');
            usermenu.css({display: "none", opacity: 0});
            var lock = false;
            var opened = false;
            userbar.click(function () {
                if (lock == true) {
                    return;
                }
                lock = true;
                usermenu.stop(true, false, false);
                usermenu.css({right: "18px", top: userbar.height() + "px", opacity: (opened ? 1 : 0), backgroundColor: "rgba(71, 165, 164, 0)", display: "block"}).animate({opacity: (opened ? 0 : 1), backgroundColor: (opened ? "transparent" : "rgba(182,209,209,0.7)")}, 200, function () {
                    if (opened) {
                        usermenu.css({display: "none"});
                        usermenubak.css({display: "none"});
                        opened = false;
                    } else {
                        usermenubak.css({display: "block"});
                        opened = true;
                    }
                    lock = false;
                });
            });
            usermenubak.click(function () {
                if (opened) {
                    if (lock == true) {
                        return;
                    }
                    userbar.click();
                }
            });
            usermenu.append($('<a href="javascript:void(0);" class="usermenu_item"></a>').append($('<img style="display: inline-block; vertical-align: middle; margin: 3px;">')
                    .attr("src", XAPI.user_hadpic_get(usrinfo.email, 42))).append(
                    $('<div style="vertical-align: middle; margin: 3px; display: inline-block;"></div>')
                        .append($('<div style="font-size: 110%; line-height: 25px; padding-right: 4px;"></div>').text(username)).append(
                            $('<div style="opacity: 0.75; font-size: 80%; line-height: 18px;"></div>').text("点击此处打开你的用户页"))).click(function () {
                    var hash = window.location.hash.substr(1);
                    var hastt;
                    try {
                        hastt = JSON.parse(hash);
                    } catch (e) {
                        XAPI.log("Page hash error: " + e);
                        hastt = {};
                    }
                    XAPI.showUser(usrinfo.uid, hastt);
                }));
            usermenu.append($('<a href="javascript:void(0);" class="usermenu_item">回复我的</a>').click(function () {
                XAPI.user.msgh(1);
            }));
            usermenu.append($('<a href="javascript:void(0);" class="usermenu_item">登出</a>').click(function () {
                XAPI.ui.addState("正在登出");
                XAPI.send("api/logout.php", {}, function (q) {
                    XAPI.ui.addState("登出成功！");
                    username = "";
                    password = "";
                    sid = 0;
                    krr = "";
                    uid = 0;
                    delete localStorage.lastSid;
                    delete localStorage.lastKrr;
                    delete localStorage.lastUid;
                    delete localStorage.userName;
                    delete localStorage.userPasswd;
                    $('body').append($('<div class="no_mirror" style="background-color: #000000; opacity: 0; position: absolute; z-index: 99999; top: 0; left: 0; right: 0; bottom: 0;"></div>').animate({opacity: 0.4}, 900));
                    setTimeout(function () {
                        window.location.reload();
                    }, 1000);
                })
            }));
            usermenu.find('.usermenu_item').css({lineHeight: "28px", fontSize: "16px", cursor: "pointer", paddingLeft: "8px", display: "block", color: "#000"}).mouseenter(function () {
                $(this).css({backgroundColor: "rgba(0,0,0,0.1)", color: "#034681"});
            }).mouseleave(function () {
                $(this).css({backgroundColor: "rgba(0,0,0,0)", color: "#000000"});
            }).click(function () {
                usermenubak.click();
            });
            $('body').append(usermenu).append(usermenubak);
            XAPI.dhp();
            XAPI.log("show logined finished!");
        });
    };
    XAPI.user.loginUsr = function (n, p, c) {
        $.post("api/login_usr.php", {u: n, p: p}, function (q) {
            if (q.errid == 0) {
                c(true, "", q);
            } else {
                c(false, q.errmsg, q);
            }
        }, 'json');
    };
    XAPI.send = function (u, p, q, t) {
        console.log("%c[" + new Date().toTimeString().substr(0, 8) + "|XAPI AJAX LOADING] - %c" + u + "%c WITH POST STRING %c" +
            JSON.stringify(p), "color: #035FAA;", "color: #016A32;", "color: #035FAA;", "color: #2B02AF;");
        p.sid = sid;
        p.krr = krr;
        if (u.match(/^\//)) {
            u = u.substr(1);
        }
        $.post(u, p, function (e) {
            window.lastget = new Date().getTime();
            if (typeof e == "string") {
                try {
                    q(JSON.parse(e));
                } catch (r) {
                    console.error(r);
                    if (t) {
                        var an=$('<div style="z-index: 99999999; opacity: 0; background-color: #2a5799; padding-left: 34px; font-size: 20px; position: fixed; color: #ffffff; left: 0; right: 0; top: 0; bottom: 0;">' +
                                '<div style="font-size: 80px; margin-left: 18px; margin-top: 30px;">-_-。</div>' +
                                '<div style="font-size: 80%;">阿诺- -看起来我们的服务器 或者我们的JS 有点问题- -<br>' +
                                '此网页由于以下原因已崩溃：<br>' +
                                '服务器抽了<br>' +
                                'JS有未调试的漏洞<br>' +
                                '你刷太快了<br>' +
                                '你的浏览器版本过老</div>' +
                                '<div style="font-size: 60%; opacity: 0.8;">详细错误信息：'+$('<span></span>').text(r.toString()).html()+' Server Return: '+$('<span></span>').text(e).html()+
                                ' Sended: '+$('<span></span>').text((function(){
                            p.krr= p.krr.substr(0,6)+"......";
                            return JSON.stringify(p);
                        })()).html()+' to '+$('<span></span>').text(u).html()+'</div> </div>');
                        $('body').append(an);
                        an.animate({opacity:1},3000);
                        username = "";
                        password = "";
                        sid = 0;
                        krr = "";
                        uid = 0;
                    } else {
                        setTimeout(function () {
                            XAPI.send(u, p, q, true);
                        }, 750);
                    }
                }
            } else if (typeof e == "object") {
                q(e);
            }
        });
        window.lastsend = new Date().getTime();
    };
    XAPI.showLogin = function () {
        var dlcont = XAPI.showCont("<h1 style='color: #ffffff;'>登录</h1>");
        dlcont.css({overflow: "hidden"});
        var box = $('<div style="box-shadow: 0 0 100px rgba(0, 0, 0, 0.63); text-align: left; position: relative; margin: 55px auto auto auto; width: 420px; background-color: #e7e7e7;"></div>');
        dlcont.append(box);
        dlcont.find('*').css({opacity: 0, x: "150px"}).eachanimate({opacity: 1, x: "0px"}, true, 390, 75, false, "easeOutExpo", function () {
        });
        box.append($("<div style='font-size: 100px; text-align: center;' class='iconfont'>&#xe603;</div>"));
        var usernameIpt = XAPI.ui.createDInput("&#xe600;");
        usernameIpt.texttitle("用户名");
        usernameIpt.ipt.css({width: "412px"});
        box.append(usernameIpt.ipt);
        usernameIpt.text(username);
        box.append($('<br>'));
        var passwordIpt = XAPI.ui.createDInput("&#xe601;");
        passwordIpt.texttitle("密码");
        passwordIpt.ipt.css({width: "412px"});
        passwordIpt.$edit.attr("type", "password");
        box.append(passwordIpt.ipt);
        box.append($('<br>'));
        var cck = function () {
            regbtn.remove();
            box.find(".error").remove();
            password = passwordIpt.text();
            XAPI.ui.addState("正在登录");
            XAPI.user.loginUsr(usernameIpt.text(), passwordIpt.text(), function (s, m, q) {
                XAPI.ui.addState("");
                if (s) {
                    window.localStorage.userName = q.uname;
                    username = q.uname;
                    sid = q.sid;
                    krr = q.krr;
                    uid = q.uid;
                    XAPI.log("loggened sid=" + sid + ", krr=" + krr + ", uid=" + uid);
                    XAPI.ui.addState("成功登录！");
                    localStorage.lastSid = sid;
                    localStorage.lastKrr = krr;
                    localStorage.lastUid = uid;
                    XAPI.loggedShow();
                    XAPI.showWorld();
                } else {
                    box.append($('<span class="error" style="position: relative; top: 30px;"></span>').text(m));
                    regbtn = XAPI.ui.createDBotton("登录").css({position: "absolute", right: "32px", bottom: "12px"}).click(cck);
                    box.append(regbtn);
                    password = "";
                }
            });
        };
        var regbtn = XAPI.ui.createDBotton("登录").css({position: "absolute", right: "32px", bottom: "12px"}).click(cck);
        box.append(regbtn);
        box.append($('<span style="font-size: 75%; position: relative; top: 10px; opacity: 0.75;">忘记密码？</span>'));
        $("body").animate({backgroundColor: "#023868"}, 350);
        box.css({fontFamily: "'微软雅黑'", padding: "32px"});
        XAPI.chgUrl({loginPage: true});
    };
    XAPI.showRegister = function () {
        var dlcont = XAPI.showCont("<h1 style='color: #ffffff;'>注册</h1>");
        dlcont.css({overflow: "hidden"});
        var box = $('<div style="box-shadow: 0 0 100px rgba(0, 0, 0, 0.63); text-align: left; position: relative; margin: 55px auto auto auto; width: 420px; background-color: #e7e7e7;"></div>');
        dlcont.append(box);
        dlcont.find('*').css({opacity: 0, x: "150px"}).eachanimate({opacity: 1, x: "0px"}, true, 390, 75, false, "easeOutExpo", function () {
        });
        box.append($("<div style='font-size: 100px; text-align: center;' class='iconfont'>&#xe604;</div>"));
        var usernameIpt = XAPI.ui.createDInput("&#xe600;");
        usernameIpt.texttitle("用户名");
        usernameIpt.ipt.css({width: "412px"});
        box.append(usernameIpt.ipt);
        box.append($('<br>'));
        var passwordIpt = XAPI.ui.createDInput("&#xe601;");
        passwordIpt.texttitle("密码");
        passwordIpt.ipt.css({width: "412px"});
        passwordIpt.$edit.attr("type", "password");
        box.append(passwordIpt.ipt);
        box.append($('<br>'));
        var passwordConfIpt = XAPI.ui.createDInput("&#xe606;");
        passwordConfIpt.texttitle("再输入一遍密码");
        passwordConfIpt.ipt.css({width: "412px"});
        passwordConfIpt.$edit.attr("type", "password");
        box.append(passwordConfIpt.ipt);
        box.append($('<br>'));
        var emailIpt = XAPI.ui.createDInput("&#xe605;");
        emailIpt.texttitle("邮箱");
        emailIpt.ipt.css({width: "412px"});
        box.append(emailIpt.ipt);
        box.append($('<br>'));
        var registerFunc = function () {
            regbtn.remove();
            XAPI.ui.addState("正在注册");
            box.find(".error").remove();
            if (passwordIpt.text() != passwordConfIpt.text()) {
                box.append($('<span class="error" style="position: relative; top: 30px;">两次输入的密码不一致</span>'));
                regbtn = XAPI.ui.createDBotton("注册").css({position: "absolute", right: "32px", bottom: "12px"}).click(registerFunc);
                box.append(regbtn);
                return;
            }
            password = passwordIpt.text();
            $.post("api/register_usr.php", {n: usernameIpt.text(), p: passwordIpt.text(), e: emailIpt.text()}, function (q) {
                XAPI.ui.addState("");
                if (q.errid != 0) {
                    box.append($('<span class="error" style="position: relative; top: 30px;"></span>').text(q.errmsg));
                    password = "";
                    regbtn = XAPI.ui.createDBotton("注册").css({position: "absolute", right: "32px", bottom: "12px"}).click(registerFunc);
                    regbtn = XAPI.ui.createDBotton("注册").css({position: "absolute", right: "32px", bottom: "12px"}).click(registerFunc);
                    box.append(regbtn);
                } else {
                    uid = q.uid;
                    XAPI.log("registered uid: " + uid);
                    box.transit({x: -1000}, 300, function () {
                        box.css({x: 1000});
                        box.html("<span style='font-size: 200%; color: #7ece1c;'>√</span>&nbsp;成功");
                        box.transit({x: 0}, 300, function () {
                            function tof() {
                                XAPI.user.loginUsr(q.uname, password, function (s, m, q) {
                                    if (!s) {
                                        box.append($('<div></div>').text(m));
                                        setTimeout(tof, 10);
                                        return;
                                    }
                                    sid = q.sid;
                                    krr = q.krr;
                                    username = q.uname;
                                    localStorage.lastKrr = krr;
                                    localStorage.lastSid = sid;
                                    localStorage.lastUid = uid;
                                    localStorage.userName = username;
                                    XAPI.ui.addState("注册成功！尽情享受吧~");
                                    setTimeout(function () {
                                        XAPI.loggedShow();
                                        XAPI.showWorld();
                                    }, 2000);
                                })
                            }

                            setTimeout(tof, 10);
                        });
                    })
                }
            }, 'json');
        };
        var regbtn = XAPI.ui.createDBotton("注册").css({position: "absolute", right: "32px", bottom: "12px"}).click(registerFunc);
        box.append(regbtn);
        box.append($('<span style="font-size: 75%; position: relative; top: 10px; opacity: 0.75;">注册即代表您同意我们的使用协议。</span>'));
        $("body").animate({backgroundColor: "#4A6E01"}, 350);
        box.css({fontFamily: "'微软雅黑'", padding: "32px"});
        XAPI.chgUrl({registerPage: true});
    };
    XAPI.user_hadpic_get = function (email, size) {
        return "https://www.gravatar.com/avatar/" + email + "?d=mm&r=pg&s=" + size;
    };
    XAPI.chgUrl = function (url) {
        window.history.pushState(JSON.stringify(url), JSON.stringify(url), "/?" + JSON.stringify(url));
    };
    $.getScript("UI/JS/imageupd.js", function () {
        XAPI.log("imageupd.js Loaded");
        $.getScript("api/js/piccache.js", function () {
            XAPI.log("piccache loaded!");
            $.getScript("api/js/p_world.js", function () {
                XAPI.log("World Page loaded");
                $.getScript("api/js/p_user.js", function () {
                    XAPI.log("user page loaded");
                    $.getScript("api/js/p_img.js", function () {
                        XAPI.log("p_img.js loaded");
                        $.getScript("api/js/message.js", function () {
                            XAPI.log("message.js loaded");
                            $.getScript("api/js/pages.js", function () {
                                XAPI.log("Pages loaded");
                                $.getScript("api/js/kw.js", function () {
                                    XAPI.log("KW loaded");
                                    function cst() {
                                        rtt(function () {
                                            XAPI.log("rrt callbacked");
                                            XAPI.user.onloginfinished_msg();
                                            XAPI.getPage = function () {
                                                var hash = decodeURIComponent(window.location.search).substr(1);
                                                var hastt;
                                                try {
                                                    hastt = JSON.parse(hash);
                                                } catch (e) {
                                                    XAPI.log("Page hash error: " + e);
                                                    hastt = {};
                                                }
                                                return hastt;
                                            };
                                            XAPI.kw();
                                            XAPI.pages.startPage(XAPI.getPage());
                                            setTimeout(function () {
                                                // 233の字符画~
                                                console.log("%c             %c^%c                ", "color: #000000;", "color: red", "color: #000000;");
                                                console.log("%c           %c/  \\%c              ", "color: #000000;", "color: red", "color: #000000;");
                                                console.log("%c          %c/  %c# %c\\%c         ", "color: #000000;", "color: red", "color: #000000;", "color: red", "color: #000000;");
                                                console.log("%c         %c/      \\%c            ", "color: #000000;", "color: red", "color: #000000;");
                                                console.log("%c        %c/ %c#      %c\\%c       ", "color: #000000;", "color: red", "color: #000000;", "color: red", "color: #000000;");
                                                console.log("%c       %c/        %c# %c\\%c      ", "color: #000000;", "color: red", "color: #000000;", "color: red", "color: #000000;");
                                                console.log("%c      %c\\%c---%c\\    %c/%c---%c/", "color: #000000;", "color: #02B002;", "color: #C9F74A;", "color: #02B002;", "color: #02B002;", "color: #C9F74A;", "color: #02B002;");
                                                console.log("%c       %c\\%c   %c\\%c--%c/   /   ", "color: #000000;", "color: #02B002;", "color: #000000;", "color: #02B002;", "color: #C9F74A;", "color: #02B002;");
                                                console.log("%c        %c\\%c--------%c/         ", "color: #000000;", "color: #02B002;", "color: #C9F74A;", "color: #02B002;");
                                                console.log("%c     %c西%c瓜%c云 %c| %c推吧       ", "color: #000000;", "color: #02B002; font-size: 32px; font-family: '微软雅黑';", "color: #04855C; font-size: 32px; font-family: '微软雅黑';",
                                                    "color: #03289F; font-size: 32px; font-family: '微软雅黑';", "color: #000000; font-size: 24px; font-family: '微软雅黑';", "color: #9F1303; font-size: 24px; font-family: '微软雅黑';");
                                                console.log("%c         %cwebsint.org            ", "color: #000000;", "color: deepskyblue;");
                                                console.log("%c         %c即将呈现                ", "color: #000000;", "color: deeppink;");
                                                function rdClor() {
                                                    var r = parseInt(Math.random() * 200);
                                                    var g = parseInt(Math.random() * 200);
                                                    var b = parseInt(Math.random() * 200);
                                                    return "#" + r.toString(16) + g.toString(16) + b.toString(16);
                                                }

                                                /*
                                                 【感谢百度的console输出- -】
                                                 */
                                                console.log("%c一张网页，要经历怎样的过程，才能抵达用户面前？", "color: " + rdClor());
                                                console.log("%c一位新人，要经历怎样的成长，才能站在技术之巅？", "color: " + rdClor());
                                                console.log("%c探寻这里的秘密；", "color: " + rdClor());
                                                console.log("%c体验这里的挑战；", "color: " + rdClor());
                                                console.log("%c成为这里的主人；", "color: " + rdClor());
                                                // 加入百度，加入网页搜索，你，可以影响世界。
                                                console.log("%c加入西瓜云，加入社交开发，你，可以影响世界。", "color: " + rdClor());
                                                console.log("%c     %cWebs `节操开发组 %c招人中%c ！ ", "color: #000000;", "color: #0241A0;", "color: #709E04;", "color: #0241A0;");
                                                var az=0;
                                                setInterval(function(){
                                                    az=0;
                                                },500);
                                                window.onkeydown = function (e) {
                                                    if (e.keyIdentifier == "F12") {
                                                        var dig = XAPI.ui.createDiagbox("欢迎尽情脑补本网页~", function () {
                                                        }, "600px", "250px");
                                                        var c = dig.c;
                                                        c.append($('<div style="color: #008bbb; font-size: 24px;">欢迎使用您的浏览器调试工具尽情改造本网页！</div>'));
                                                        c.append($('<div style="color: deepskyblue;">（如果你什么都没有做（不小心按了F12），请</div>').append(XAPI.ui.createDBotton("关闭").click(function () {
                                                            dig.close();
                                                        })).append($('<span>此对话框。）</span>')));
                                                        c.append($('<div>如果你不小心花样作死，请</div>').append(XAPI.ui.createDBotton("点此刷新").click(function () {
                                                            $('body').append($('<div class="no_mirror" style="background-color: #000000; opacity: 0; position: absolute; z-index: 99999; top: 0; left: 0; right: 0; bottom: 0;"></div>').animate({opacity: 0.4}, 900));
                                                            setTimeout(function () {
                                                                window.location.reload();
                                                            }, 1000);
                                                        })));
                                                        if (sid) {
                                                            c.append($('<div style="color: deepskyblue;">如果你把本网页改造的更漂亮，欢迎将您的改造写成js并附上您的验证凭据“' + $.md5($.md5($.md5($.md5(sid + " " + krr)))) + "/" + sid + '”' +
                                                                '发送至<a href="mailto:wtmtim@126.com">wtmtim@126.com</a>' +
                                                                '，将有可能被采用，如果被采用，您的帐号将获得不定数量的奖励或特权。</div>'));
                                                        }
                                                        window.onkeydown = null;
                                                    }else if(e.keyIdentifier == "F5"){
                                                        e.preventDefault();
                                                        XAPI.pages.startPage(XAPI.getPage());
                                                        az++;
                                                        if(az>1){
                                                            window.onkeydown = function (e) {
                                                                e.preventDefault();
                                                            };
                                                            window.location.reload();
                                                        }
                                                    }else if(e.ctrlKey && (e.keyIdentifier=="U+00BB" || e.keyIdentifier == "U+00BD")){
                                                        e.preventDefault();
                                                    }else if(e.ctrlKey && (e.keyIdentifier=="U+0053" || e.keyIdentifier.toUpperCase() == "S")){
                                                        e.preventDefault();
                                                    }
                                                }
                                            }, 500);
                                        });
                                    }

                                    if (location.protocol == "http:") {
                                        var digbox = XAPI.ui.createDiagbox("不安全的访问协议！", function () {
                                            cst();
                                            XAPI.ui.addState("使用不安全的连接……");
                                            var th = $('<div class="iconfont no_mirror" style="position: fixed; font-size: 450px; opacity: 0.2; text-align: center; line-height: 600px; overflow: hidden; left: 0; right: 0; top: 0; pointer-events: none; cursor: default; bottom: 0; z-index: 4000;">' +
                                                '&#xe615;</div>');
                                            $('body').append(th);
                                            th.css({scale: 6.75}).transit({scale: 1}, 400, 'easeOutQuart', function () {
                                                th.animate({color: "#FF4632"}, 500, function () {
                                                    setTimeout(function () {
                                                        th.animate({opacity: 0.08}, 1000, function () {
                                                            th.css({zIndex: -1});
                                                        });
                                                    }, 2500);
                                                });
                                            });
                                        }, "650px", "auto");
                                        digbox.c.append($('<div style="color: deepskyblue;">您当前正在使用<span style="color: deeppink;">不安全的</span>' +
                                                '连接访问站点，在这种情况下，如果您使用公开的网络，黑客可以通过截获您的网络数据包来查看并修改您发送的内容（包括密码）。</div>'))
                                            .append(XAPI.ui.createDBotton("切换到安全连接").click(function () {
                                                window.location = "https://" + location.hostname + "/";
                                            }).append($('<div style="font-size: 50%; opacity: 0.7;">（如果您在公共网络，请选择此项。）</div>')))
                                            .append(XAPI.ui.createDBotton("使用不安全的连接").click(function () {
                                                digbox.close();
                                            }).append($('<div style="font-size: 50%; opacity: 0.7;">（如果您在公共网络，请不要选择此项。）</div>')))
                                            .append($('<div style="color: deeppink;">请注意！<br>以后当您在公共网络时，请直接访问' +
                                                '<span style="font-weight: bold; color: #63c500; font-style: oblique;">https</span>://' + location.hostname
                                                + '/，因为在不安全连接下黑客可以更改此网页使此警告不显示。</div>'));
                                    } else {
                                        cst();
                                    }
                                });
                            });
                        });
                    });
                })
            });
        })
    });
})();
