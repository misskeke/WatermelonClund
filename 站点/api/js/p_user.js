XAPI.showUser = function (uid, cbc) {
    XAPI.ui.addState("加载用户：" + uid);
    XAPI.chgUrl({uid: uid, callback: cbc});
    var ended = false;
    var cont = XAPI.showCont("<div style='text-align: center; margin-top: 30px;' class='errlod'>正在加载</div>", function () {
        cont.html("").css({textAlign: "left"});
        ended = true;
    });
    $("body").animate({backgroundColor: "#C1973D"}, 350);
    XAPI.send("api/user_get_info.php", {uid: uid}, function (q) {
        if (ended) {
            return;
        }
        if (q.errid != 0) {
            cont.find(".errlod").text("错误：" + q.errmsg).append($('<br>'))
                .append(XAPI.ui.createDBotton("返回").click(function () {
                    XAPI.pages.startPage(cbc);
                }));
        } else {
            var userinfo = q.user;
            cont.html("").css({textAlign: "center"});
            var box = $('<div style="margin: 6px auto auto auto; background-color: #ffffff; position: relative; min-height: 350px;; text-align: left; width: 750px; box-shadow: 0 2px 4px #000; padding-bottom: 6px; padding-top: 2px;"></div>');
            cont.append(box);
            setTimeout(function () {
                if (parseInt(XAPI.user.uid) == parseInt(uid)) {
                    box.prepend($('<a class="myusrpage" style="color: #5a2c13; opacity: 0;" href="javascript:void(0);"><span class="iconfont">&#xe604;</span>&nbsp;这是你自己的用户页！您可以点击此处编辑资料。</a>'))
                        .find(".myusrpage").animate({opacity: "1"}, 250).click(function () {
                            var box = XAPI.ui.createDiagbox("资料设置",function () {
                                XAPI.showUser(uid, cbc);
                            }, "650px", "auto").c;
                            // 0=未设置 1=男 2=女 3=伪娘/萌正太 4=女汉 5=其他 6=bot
                            var xbxzk = $('<select><option value="0">未设置</option><option value="1">男</option><option value="2">女</option>' +
                                '<option value="3">伪娘/萌正太</option><option value="4">女汉</option><option value="5">其他</option>' +
                                '</select>');
                            xbxzk.val(userinfo.sex);
                            var setsex = XAPI.ui.createDBotton("设置性别").click(function () {
                                box.find(".setsexing").remove();
                                setsex.after($('<span class="setsexing">正在设置</span>')).css({display: "none"});
                                XAPI.send("api/user_set_sex.php", {sex: xbxzk.val()}, function (q) {
                                    if (q.errid != 0) {
                                        box.find(".setsexing").addClass("error").text(q.errmsg);
                                        setsex.css({display: "inline-block"});
                                    } else {
                                        box.find(".setsexing").text("成功");
                                        setsex.css({display: "inline-block"});
                                    }
                                });
                            });
                            box.append($('<div>性别：</div>').append(xbxzk).append(setsex));
                            var kz_n = XAPI.ui.createDInput("&#xe611;");
                            var kz_v = XAPI.ui.createDInput("&#xe606;");
                            kz_n.texttitle("名称");
                            kz_v.texttitle("内容");
                            kz_n.ipt.css({width: "150px", verticalAlign: "middle"});
                            kz_v.ipt.css({width: "150px", verticalAlign: "middle"});
                            var kz_sb = XAPI.ui.createDBotton("设置");
                            box.append($('<div>增加/修改扩展特性</div>').append(kz_n.ipt).append(kz_v.ipt).append(kz_sb));
                            kz_sb.click(function () {
                                box.find('.uusetting').remove();
                                kz_sb.after($('<span class="uusetting"></span>').text("正在设置")).css({display: "none"});
                                XAPI.send("api/user_add_extra.php", {extra: kz_n.text(), value: kz_v.text()}, function (q) {
                                    if (q.errid != 0) {
                                        box.find('.uusetting').addClass("error").text(q.errmsg);
                                    } else {
                                        box.find('.uusetting').text("OK~");
                                    }
                                    kz_sb.css({display: "inline-block"});
                                });
                            });
                        });
                }
            }, 500);
            var hadcard = $('<div style="background-color: #dadada; padding-left: 260px; min-height: 268px; position: relative;"></div>');
            var hp_img = $('<img style="position: absolute; border-radius: 248px; box-shadow: 0 0 4px #000; cursor: pointer; left: 8px; width: 248px; top: 8px; height: 248px;">').attr("src",
                    XAPI.user_hadpic_get(userinfo.email, 256)).click(function () {
                    var csc = $('<div style="background-color: rgba(0, 0, 0, 0.66); position: fixed; cursor: pointer; text-align: center; z-index: 1501; left: 0; right: 0; top: 0; bottom: 0;"></div>')
                        .append($('<div style="margin: 120px auto auto auto;" class="tohei"></div>').append($('<img style="border-radius: 8px;">').attr("src", XAPI.user_hadpic_get(userinfo.email, 500))));
                    $('body').append(csc);
                    var habing = false;

                    function cca() {
                        if (habing) {
                            return;
                        }
                        csc.find(".tohei").css({marginTop: (window.innerHeight / 2 - 250) + "px"});
                        console.info("r");
                        requestAnimationFrame(cca);
                    }

                    requestAnimationFrame(cca);
                    csc.click(function () {
                        habing = true;
                        csc.remove();
                    });
                });
            hadcard.append(hp_img);
            if (userinfo.state > 0) {
                var fjxx = userinfo.state * 20;
                hp_img.css({"-webkit-filter": "grayscale(" + fjxx / 100 + ")", "filter": "grayscale(" + fjxx / 100 + ")"});
                hadcard.append($('<div style="color: #ff0000;">此用户已被封禁</div>'));
            }
            box.append(hadcard);
            var hdc = $('<div style="padding-bottom: 8px; padding-left: 16px; padding-top: 8px;"></div>');
            hadcard.append($('<div></div>').append(
                    $('<span style="font-size: 155%; color: rgba(80, 53, 17, 0.71);"></span>').text(userinfo.username))
                .append($('<span class="hidden">&nbsp;&nbsp;&nbsp;&nbsp;</span>'))
                .append($('<span style="color: #5c5c5c; font-size: 80%; margin-left: 4px;"></span>').text("(" + userinfo.email + ")")));
            hadcard.append(hdc);
            hdc.append($('<div></div>').text("注册日期： " + XAPI.timeZoneToDate(userinfo.registerTime).toLocaleDateString()));
            // 0=未设置 1=男 2=女 3=伪娘/萌正太 4=女汉 5=其他 6=bot
            hdc.append($('<div style="font-size: 120%;" class="iconfont"></div>').html((function (sex) {
                switch (sex) {
                    case 0:
                        return "&#xe60e;";
                    case 1:
                        return "&#xe60f;";
                    case 2:
                        return "&#xe610;";
                    case 3:
                        return "&#xe60b;";
                    case 4:
                        return "&#xe60a;";
                    case 5:
                        return "&#xe60c;";
                    case 6:
                        return "&#xe609;";
                    default:
                        return "&#xe60d;";
                }
            })(parseInt(userinfo.sex))));
            hdc.append($('<div>UID: </div>').append($('<span style="color: #5a100e;"></span>').text(userinfo.uid)));
            if (userinfo.group == 1) {
                hdc.append($('<div style="font-size: 110%; color: #a12a00"><span style="display: inline-block; vertical-align: middle; font-size: 150%;" class="iconfont">' +
                    '&#xe614;</span>此用户是西瓜云管理组的一员。</div>'))
            }
            XAPI.send("api/user_list_extra.php", {uid: uid}, function (q) {
                if (ended) {
                    return;
                }
                if (q.errid != 0) {
                    hdc.append($('<div></div>').text(q.errmsg));
                } else {
                    for (var i = 0; i < q.extras.length; i++) {
                        (function (ex, tr) {
                            if (ex == "_upage_bgcolor") {
                                if (!ended) {
                                    $("body").animate({backgroundColor: tr}, 350);
                                }
                                return;
                            }
                            hdc.append($('<div></div>').text(ex).append($('<span style="color: #5a2b36;">: </span>')).append($('<span style="color: #305a24;"></span>').text(tr)));
                        })(q.extras[i].ename, q.extras[i].evalue);
                    }
                }
                XAPI.ui.addState("");
            });
        }
    });
};