var dbc, mon;
var path = require('path');
var nodemailer = require('nodemailer');
var jade = require('jade');
var jadef=path.join(__dirname, '..', 'views', 'mailT.jade');
module.exports = function(dbcc,monc,passR){
    var smtpTransport = nodemailer.createTransport({
        name: 'Yoghour',
        service: 'Gmail',
        auth: {
            user: 'devtest.websint@gmail.com',
            pass: passR.MailPass
        }
    });
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
                console.info(mailOptions.html);
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
