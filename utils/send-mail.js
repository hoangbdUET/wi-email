const nodemailer = require('nodemailer');
const config = require('config');

function sendMail(data, callback) {
    data.fromAddress = data.fromAddress ? data.fromAddress : "no-reply@i2g.cloud";
    let transporter = nodemailer.createTransport({ // config mail server
        host: config.Smtp.host,
        port: config.Smtp.port,
        secure: config.Smtp.secure, // true for 465, false for other ports
        auth: {
            user: config.Smtp.user, // generated ethereal user
            pass: config.Smtp.password // generated ethereal password
        }
    });
    let mainOptions = {
        from: '"I2G Support Team" <' + data.fromAddress + '>',
        to: data.toAddress,
        subject: data.subject,
        text: data.text,
        html: data.html
    };
    transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
            console.log(err);
            callback(err, null);
        } else {
            console.log('Message sent: ' + info.response);
            callback(null, info);
        }
    });
}

module.exports = {sendMail};