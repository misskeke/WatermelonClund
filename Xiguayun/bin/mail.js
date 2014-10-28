/*

   --------------------------
     var path = require('path');
     var nodemailer = require('nodemailer');
     var jade = require('jade');
     var smtpTransport = nodemailer.createTransport({
     name: 'Yoghour',
     host: 'websint.org',
     port: 25,
     auth: {
     user: "root",
     pass: "JrV4ZEJ5cIMKwtVWrWUM"
     },
     secureConnection: true,
     tls: {}
     });
     var jadef=path.join(__dirname, '..', 'views', 'mailT.jade');
     module.exports = function(subject, content, reciver, username, tdlink) {
     var mailOptions = {
     from: "Yoghour <do-not-reply@websint.org>",
     to: reciver,
     subject: subject,
     html: jade.renderFile(jadef, { MailTitle:subject,tdlink:tdlink,content:content })
     };
     smtpTransport.sendMail(mailOptions, function(error, response){
     if (error) {
     console.log(error.stack);
     } else {
     console.log('Message sent: ' + reciver + " : " + subject);
     }
     smtpTransport.close();
     });
     };

 --------------------------

*/
var dbc, mon;
var path = require('path');
var config = {
    mail: {
        from: {
            name: 'Yoghour',
            service: 'websint.org',
            auth: {
                user: 'do-not-reply',
                pass: ''
            }
        },
        to: [
            '用户名 <micromaomao@gmail.com>'
        ]
    }
};
var nodemailer = require('nodemailer');
var jade = require('jade');
var smtpTransport = nodemailer.createTransport({
    name: 'Yoghour',
    service: 'Gmail',
    auth: {
        user: 'devtest.websint@gmail.com',
        pass: '19f45b6a78a4d5fd80dc37417c8ac828'
    }
});
var jadef=path.join(__dirname, '..', 'views', 'mailT.jade');
module.exports = function(dbcc,monc){
    dbc=dbcc;
    mon=monc;
    return function(subject, content, reciver, username, tdlink, ixgWis, canNotReadOnLine) {
        var xgMail=dbc.model('xgMil');
        ixgWis.username(function(uuname){
            var mlc = new xgMail({
                auth_user: uuname,
                auth_wis: ixgWis.wis,
                subject: subject,
                content: content,
                readFromWeb_can: !canNotReadOnLine});
            mlc.save(function(){
                var mailOptions = {
                    from: "Websint <devtest.websint@gmail.com>",
                    to: reciver,
                    subject: subject,
                    html: jade.renderFile(jadef, { MailTitle:subject,tdlink:tdlink,content:content,
                        readonl: (canNotReadOnLine?undefined:"https://websint.org/dev/mailView/"+mlc._id.toString()) })
                };
                smtpTransport.sendMail(mailOptions, function(error, response){
                    if (error) {
                        console.log(error.stack);
                    } else {
                        console.log('Message sent: ' + reciver + " : " + subject);
                    }
                    smtpTransport.close();
                });
            });
        })
    }
};
