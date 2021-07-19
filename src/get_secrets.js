require('dotenv').config()

let SECRETS = {
    PORT : parseInt(process.env['PORT']),
    GMAIL_SECRET : process.env['GMAIL_SECRET'],
    GMAIL_AD : process.env['GMAIL_AD'],
    ADMIN_AD : process.env['ADMIN_AD'],
    PGUSER : process.env['PGUSER'],
    PGPASS : process.env['PGPASS'],
    PGDB : process.env['PGDB'],
    PGPORT : parseInt(process.env['PGPORT']),
    REQSECRET : process.env['REQSECRET'],
    WHTOKEN : process.env['WHTOKEN'],
    WHID : process.env['WHID'],
}

module.exports = SECRETS