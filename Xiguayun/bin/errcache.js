var errpc = require('./errrsp.js');
module.exports = function (fn, res) {
    try {
        fn();
    } catch (e) {
        console.info("fn!");
        errpc(res, {message: "出现程序错误", status: "E_SERVER_ERROR"}, 500);
        console.info(e);
    }
};
