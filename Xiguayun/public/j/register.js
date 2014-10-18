$(function () {
    var pwd = $('.lginpwd'), pwdc = $('.lginpwdc');
    var f = $('.lgrs-box'), usn = $('.lginusn'), emi = $('.lginemi');
    var pwdgent = $('.lginpwdgenb');
    var lastGentn = "";
    f.bind("submit", function () {
        if (XLIB.strSpaceOh(usn.val()).length < 3 || XLIB.strSpaceOh(usn.val()).length > 15) {
            XLIB.wcAddErrtest(usn, "用户名长度必须≥3，≤15");
            return false;
        }
        if (pwd.val().length < 6 || pwd.val().length > 255) {
            var genc = XLIB.rds(15);
            XLIB.wcAddErrtest(pwd, "密码长度必须≥6，≤255", genc, function () {
                lastGentn = genc;
                pwdc.val(lastGentn);
                $('.lginpwd_gentxt').remove();
                pwd.after($('<div class="lginpwd_gentxt"></div>').text("请妥善保存你的密码 " + lastGentn));
            });
            return false;
        }
        if (pwd.val() != pwdc.val()) {
            XLIB.wcAddErrtest(pwdc, "两个密码不正确", (pwd.val() == lastGentn ? pwd.val() : undefined));
            return false;
        }
        if (!XLIB.strSpaceOh(emi.val()).match(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)) {
            XLIB.wcAddErrtest(emi, "邮箱格式不正确", "someone@example.com");
            return false;
        }

        $.post('/register', {emill: emi.val(), username: usn.val(), password: pwd.val(), wisChk:pdWisChk }, function (q) {
            console.info(q);
            if(q.errName){
                XLIB.wcAddErrtest(usn, q.errName);
            }else if(q.successful){
                window.location = "/register/clr";
            }
        },'json');

        return false;
    });
    pwdgent.click(function () {
        lastGentn = XLIB.rds(15);
        pwd.val(lastGentn);
        pwdc.val(lastGentn);
        $('.lginpwd_gentxt').remove();
        pwd.after($('<div class="lginpwd_gentxt"></div>').text("请妥善保存你的密码 " + lastGentn));
    });
    XLIB.wcAddErrtestAutoNo(pwdc);
    XLIB.wcAddErrtestAutoNo(usn);
    XLIB.wcAddErrtestAutoNo(emi);
    XLIB.wcAddErrtestAutoNo(pwd, function () {
        setTimeout(function () {
            if (lastGentn.length > 0) {
                if (pwd.val() != lastGentn) {
                    $('.lginpwd_gentxt').remove();
                    lastGentn = "";
                }
            }
        }, 5);
    });
});
