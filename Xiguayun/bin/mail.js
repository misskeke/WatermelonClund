var path = require('path');
var config = {
    mail: {
        from: {
            name: 'Yoghour',
            service: 'smtp.126.com',
            auth: {
                user: '8a4d5fd7c8ac828',
                pass: '8a4d5fd7c8ac828'
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
module.exports = function(subject, content, reciver, username, tdlink) {
    var mailOptions = {
        from: "Websint <devtest.websint@gmail.com>",
        to: reciver,
        subject: subject,
        html: jade.renderFile(jadef, { MailTitle:subject,tdlink:tdlink,content:content })
    };
    smtpTransport.sendMail(mailOptions, function(error, response){
        if (error) {
            console.log(error.stack);
        } else {
            console.log('Message sent: ' + response.message);
        }
        smtpTransport.close();
    });
};
