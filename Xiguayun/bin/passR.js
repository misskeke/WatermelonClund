var fs = require('fs');

module.exports= JSON.parse(fs.readFileSync("/etc/websint/passfile", 'utf8'));