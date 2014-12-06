var m_crypto, shaer, md5er;
module.exports = {
    init: function (c) {
        m_crypto = require('crypto');
    },
    strsftrim: function (s) {
        if(!s){
            s="";
        }
        return s.trim().replace(/[\x00-\x19\x7F-\xA0\u1680\u180E\u2000-\u200B\u2028\u2029\u202F\u205F\u3000\uFEFF]/g, '').trim();
    },
    md5: function (s) {
        md5er = m_crypto.createHash('md5');
        md5er.update(s);
        return md5er.digest('hex');
    },
    sha512: function (s) {
        shaer = m_crypto.createHash('sha512');
        shaer.update(s);
        return shaer.digest('hex');
    }, randomStr: function (length, zf) {
        var chars = (zf || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz').split('');
        var str = '';
        for (var i = 0; i < length; i++) {
            str += chars[parseInt(Math.random() * chars.length)];
        }
        return str;
    }
};
