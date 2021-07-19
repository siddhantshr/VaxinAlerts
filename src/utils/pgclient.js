const {Client} = require('pg')
const secrets = require('../get_secrets');

const client = new Client({
    user: secrets.PGUSER,
    host: 'localhost',
    database: secrets.PGDB,
    password: secrets.PGPASS,
    port: secrets.PGPORT,
})

client.connect()
module.exports = client