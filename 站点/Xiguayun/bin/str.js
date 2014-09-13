var m_md5,m_crypto,shaer;
module.exports={
    cache:null,
    init:function(c){
        this.cache=c;
        m_md5=require('MD5');
        m_crypto = require('crypto');
        shaer=m_crypto.createHash('sha512');
    },
    strsftrim:function(s){
        return s.trim().replace(/[\x00-\x19\x7F-\xA0\u1680\u180E\u2000-\u200B\u2028\u2029\u202F\u205F\u3000\uFEFF]/g,'').trim();
    },
    md5:function(s){
        return this.cache.get("md5\x00"+ s,function(){
            return m_md5(s);
        });
    },
    sha512:function(s){
        return this.cache.get("sha512\x00"+ s,function(){
            shaer.update(s);
            return shaer.digest('hex');
        });
    }
};