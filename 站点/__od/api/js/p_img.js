XAPI.showImg = function (imgid, cbc) {
    XAPI.ui.addState("加载图片：" + imgid);
    XAPI.chgUrl({picPage: imgid, callback: cbc});
    var ict;
    var ct = XAPI.showCont("", function () {
        ict = false;
        XAPI.log("IMG page unloaded");
    });
    $("body").animate({backgroundColor: "#018DD9"}, 350);
    var mbox = $("<div style='position: absolute; left: 16px; right: 16px; top: 48px; bottom: 16px; background-color: #ffffff; box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);'></div>");
    ct.append(mbox);
    var ltd = $('<div style="text-align: center; padding-top: 32px;">正在加载，请稍候</div>');
    mbox.append(ltd);
    var back = $('<div style="position: absolute; left: 4px; top: 4px;"></div>');
    var bcbt = XAPI.ui.createDBotton("< 返回");
    bcbt.click(function () {
        XAPI.pages.startPage(cbc);
    });
    if (cbc) {
        back.append(bcbt);
    }
    mbox.append(back);
    XAPI.send("api/pic_get_info.php", {picid: imgid}, function (q) {
        if (q.errid != 0) {
            ltd.text(q.errmsg);
        } else {
            ltd.css({textAlign: "left", paddingLeft: mbox.width() / 2 - 70}).animate({paddingTop: "10px", paddingLeft: "90px"}, 250);
            ltd.text("图片： " + q.pic.picid);
            var mbinf = $('<div style="position: absolute; z-index: 2; left: 40px; top: 52px; font-size: 80%; opacity: 0.8; background-color: rgba(255, 255, 255, 0.61);"></div>');
            mbox.append(mbinf);
            XAPI.send("api/user_get_info.php", {uid: q.pic.authoruid}, function (u) {
                XAPI.ui.addState("");
                if (q.errid != 0) {
                    mbinf.append($('<div class="error">获取用户信息失败</div>'));
                } else {
                    mbinf.text("发布者：" + u.user.username);
                    mbinf.append($('<div></div>').text("发布时间：" + XAPI.timeZoneToDate(q.pic.time).toLocaleString()));
                }
            });
            var imgef = $('<div style="position: absolute; left: 8px; top: 48px; bottom: 32px; right: 8px; text-align: center;"></div>');
            var img = $('<img style="max-width: 100%; position: relative; max-height: 100%; display: inline; vertical-align:middle; margin: auto;">');
            img.attr("src", q.pic.src);
            imgef.append(img);
            mbox.append(imgef);
            ict = true;
            function crr() {
                if (ict) {
                    requestAnimationFrame(function () {
                        img.css({top: (imgef.height() / 2 - (img.height() / 2)) + "px"});
                        crr();
                    });
                }
            }

            crr();
        }
    });
};