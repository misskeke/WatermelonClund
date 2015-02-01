var express = require('express'), strlib = require('../bin/str.js'), smail, path = require('path'), ersp = require('../bin/errrsp.js'), cy = require('crypto'), router = express.Router(), marked = require('marked'), fs = require('fs'), ccap = require('ccap'), aStyleMill = "color: #056db2; text-decoration: none; text-shadow: 0 0 2px rgba(0, 0, 0, 0.60);", dbc, mon, nodpath = path.join(__dirname, ".."), conts = {
    mdHelp: fs.readFileSync(nodpath + '/public/i/Mdhelp.md', 'utf8')
};
module.exports = function (d) {
    mon = d.mongo;
    dbc = d.db;
    strlib.init();
    require('./dbc')(dbc,mon);
    marked(conts.mdHelp, function (err, content) {
        conts.mdHelpmded=content;
    });
    require('./mb')(function(){
        router.get('/',function(req, res){
            res.send("= =");
        });
    },dbc,marked,router);
    return router;
};

