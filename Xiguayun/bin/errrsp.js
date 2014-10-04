module.exports = function (res, err, s) {
    res.status(s || 500);
    res.render('error', {
        message: err.message,
        error: {status: err.status, stack: (function () {
            switch (err.status) {
                case "E_CONTENT_NOT_FIND":
                    return "您访问的既不是帖子 也不是吧 也不是用户页 也不是……\n总之我们不知道您在访问什么……\n";
                case "E_SERVER_ERROR":
                    return "请稍候重试";
                default :
                    return "嗯。。是发生错误了\n但是我们不知道这是什么错误，也不知道哪里错误了……\n" +
                        "错误码是" + err.status + "。"
            }
        })()},
        title: err.message,
        SpecH1: ""
    });
};
