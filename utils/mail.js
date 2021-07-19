const nodemailer = require('nodemailer')
const secrets = require('../get_secrets')

module.exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: secrets.GMAIL_AD,
        pass: secrets.GMAIL_SECRET
    }
});

module.exports.get_formatted_date = function (obj) {
    let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    day = days[obj.getDay()]
    month = months[obj.getMonth()]

    return `${day}, ${month} ${('0' + obj.getDate()).slice(-2)}, ${obj.getFullYear()} at ${('0' + obj.getHours()).slice(-2)}:${('0' + obj.getMinutes()).slice(-2)}:${('0' + obj.getSeconds()).slice(-2)}`;
}

module.exports.get_options = function (name, email, body, type, getFormattedDate) {
    let time = new Date();
    let mailOptions = null;
    if (type == "confirm") {
        mailOptions = {
            from: secrets.GMAIL_AD,
            to: email,
            subject: 'Confirmation from Cowin Alerts',
            html: `<h4>Hello ${name} we have received your query from the supports page of our website ( cowin alerts ). We will be shortly replying to your request within 7 business days. Please be patient</h4> \n\n<strong>${getFormattedDate(time)} You Wrote:</strong> \n${body}`
        };
    } else if (type == "send") {
        mailOptions = {
            from: secrets.GMAIL_SECRET,
            to: secrets.ADMIN_AD,
            subject: 'Cowin Alerts Support Query',
            html: `<strong>${getFormattedDate(time)}, ${name} [${email}] wrote:</strong> \n\n${body}`
        }; 
    } else {
        return "wrong type";
    }

    return mailOptions;
};

module.exports.send_mail = function (transporter, mailOptions) {
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        }
    })
}