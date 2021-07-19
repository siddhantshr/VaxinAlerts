const express = require('express')
const path = require('path')
const app = express()
const secrets = require('./get_secrets.js')

function check_env() {
    console.log('Checking ENVs')
    required = ['PORT', 'PGUSER', 'PGPASS', 'PGDB', 'PGPORT', 'REQSECRET', 'WHTOKEN', 'WHID', 'GMAIL_SECRET', 'GMAIL_AD', 'ADMIN_AD']
    required.forEach(val => {
        if (!(Object.keys(secrets).includes(val))) {
            console.log('ENV variables DO NOT contain ' + val)
            process.exit()
        }
    })
    console.log('ENVs checked!')
}

check_env()

// Middle Ware
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/css', express.static(path.join(__dirname, 'public', 'css')))
app.use('/data', express.static(path.join(__dirname, 'public', 'data')))
app.use('/javascript', express.static(path.join(__dirname, 'public', 'javascript')))
app.use('/images', express.static(path.join(__dirname, 'public', 'images')))

// Paths
require('./utils/routes')(app)

// 404 Path
app.use(
    (req, res) => {
        res.type('text/html')
        res.status(404)
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }
)

const _PORT = process.env.PORT || 5000

app.listen(_PORT, () => {
    console.log(`Listening to ${_PORT}`)
})