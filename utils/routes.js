const helpers = require('./functions')
const path = require('path')

module.exports = function (app) {
    app.get(
        ['', '/index', '/home', '/home.html', '/index.html'], 
        (req, res) => {
            res.type('text/html')
            res.status(200)
            res.sendFile(path.join(__dirname, '../', 'views/index.html'))
        }
    )
    
    app.get(
        ['/support', '/support.html', '/contact', '/contact.html'],
        (req, res) => {
            res.type('text/html')
            res.status(200)
            res.sendFile(path.join(__dirname, '../', 'views/contact.html'))
        }
    )
    
    app.get(
        ['/privacypolicy', '/privacypolicy.html', '/policy', '/policy.html'],
        (req, res) => {
            res.type('text/html')
            res.status(200)
            res.sendFile(path.join(__dirname, '../', 'views/policy.html'))
        }
    )
    
    app.get(
        ['/request_ch', '/request', '/request_ch.html', '/request_ch.hbs'],
        async (req, res) => {
            res.type('text/html')
            res.status(200)
            if (req.query.district_id !== undefined) {
                let _id = parseInt(req.query.district_id)
                if (isNaN(_id)) {
                    res.sendFile(path.join(__dirname, '../', 'views/index.html'))   
                } else {
                    let query = await helpers.make_query("SELECT * FROM districts WHERE district_id = $1", [_id])
                    if (query.length != 0) {
                        res.render(
                            path.join(__dirname, '../', 'views/request_ch.hbs'),
                            {data : query[0].name}
                        )
                    } else {
                        res.sendFile(path.join(__dirname, '../', 'views/index.html'))
                    }
                }
            } else {
                res.sendFile(path.join(__dirname, '../', 'views/index.html'))
            }
        }
    )
    
    app.get(
        ['/about', '/about.html'], 
        (req, res) => {
            res.type('text/html')
            res.status(200)
            res.sendFile(path.join(__dirname, '../', 'views/about.html'))
        }
    )
    
    app.post("/getdata", async (req, res) => {
        let data = await helpers.get_districts(req.body.state)
        if (data === []) {
            res.json({status: "error", error: "invalid state bruh"})
            return
        }
        res.json({status: "ok", data : data})
    })
    
    app.post("/request_channel", async (req, res) => {
        await helpers.request_channel(
            req.body.district_name,
            req.body.email, 
            req.body.username
        )
        res.json({status: "ok"})
    })
    
    app.post("/getstates", async (req, res) => {
        let data = helpers.get_states()
        res.json({status: "ok", data : data})
    })
    
    app.post("/checkgroups", async (req, res) => {
        let data = await helpers.check_group(req.body.name)
        if (data === []) {
            res.json({status: "error", error: "invalid state bruh"})
            return
        }
        res.json({status: "ok", data : data})
    })
    
    app.post("/sendmail", (req, res) => {
        let transporter = mail.transporter
        let getFormattedDate = mail.getFormattedDate
        let getOptions_1 = mail.get_options(req.body.name, req.body.email, req.body.text, "confirm", getFormattedDate)
        let getOptions_2 = mail.get_options(req.body.name, req.body.email, req.body.text, "send", getFormattedDate)

        mail.send_mail(transporter, getOptions_1)
        mail.send_mail(transporter, getOptions_2)
    
        res.json({status: "ok"})
    })
}