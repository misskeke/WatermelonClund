var strlib = require('./bin/str.js');
strlib.init(require('memory-cache'));
console.info(new Date().getTime());
console.info(strlib.md5("test"));
console.info(new Date().getTime());
console.info(strlib.md5("test"));
console.info(new Date().getTime());
console.info(strlib.sha512("test"));
console.info(new Date().getTime());
console.info(strlib.sha512("test"));
console.info(new Date().getTime());