var m_crypto,shaer,md5er;
module.exports={
    cache:null,
    init:function(c){
        this.cache=c;
        m_crypto = require('crypto');
    },
    strsftrim:function(s){
        return s.trim().replace(/[\x00-\x19\x7F-\xA0\u1680\u180E\u2000-\u200B\u2028\u2029\u202F\u205F\u3000\uFEFF]/g,'').trim();
    },
    md5:function(s){
        return this.cache.get("md5\x00"+ s,function(){
            md5er=m_crypto.createHash('md5');
            md5er.update(s);
            return md5er.digest('hex');
        });
    },
    sha512:function(s){
        return this.cache.get("sha512\x00"+ s,function(){
            shaer=m_crypto.createHash('sha512');
            shaer.update(s);
            return shaer.digest('hex');
        });
    }
};