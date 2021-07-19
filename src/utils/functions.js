const path = require('path')
const client = require('./pgclient.js')
const mail = require(path.join(__dirname, 'mail'))
const fs = require('fs')
const fetch = require('node-fetch')
const secrets = require('../get_secrets')

module.exports.get_districts = async function (state) {
    try{
        let res = await client.query("SELECT name FROM districts WHERE state = $1", [state])
        return res.rows
    } catch(e){
        console.error(e)
        return e
    }
}

module.exports.check_group = async function (district) {
    try {
        let res = await client.query("SELECT * FROM districts WHERE name = $1", [district])
        return res.rows
    } catch(e){
        console.error(e)
        return e
    }
}

module.exports.make_query = async function (query, params) {
    try {
        let res = await client.query(query, params)
        return res.rows
    } catch(e){
        console.error(e)
        return e
    }
}

module.exports.request_channel = async function (name, email, telegram_uname) {
    if (email === '') {
        email = "Not Provided"
    }
    if (telegram_uname === '') {
        telegram_uname = "Not Provided"
    }

    district_data = await check_group(name)

    let json_data = {
        "embeds" : [
            {
                "title": "New District Request",
                "description": `**District requested:** \`${district_data[0].name} [ID: ${district_data[0].district_id}]\`\n**User Email:** \`${email}\` \n**User telegram username:** \`${telegram_uname}\``,
                "color": 0x0dc9de,
                "thumbnail" : {
                    "url": "https://media.discordapp.net/attachments/851069990256902145/851113209854427136/icon.png"
                },
                "footer" : {
                    "text" : mail.getFormattedDate(new Date()),
                    "icon_url" : "https://media.discordapp.net/attachments/794467787988008976/851115987461865552/Donut_pfp_wobble.gif?width=571&height=569"
                }
            }
        ]
    }

    await make_query("UPDATE districts SET is_requested = $1 WHERE district_id = $2", [true, district_data[0].district_id])

    let res = await fetch(
        `https://discord.com/api/webhooks/${secrets.WHID}/${secrets.WHTOKEN}`, 
        {
            method: 'POST', 
            headers: {"Content-Type": "application/json" },
            body : JSON.stringify(json_data)
        }
    ).catch(err => console.error(err))
} 

module.exports.get_states = function () {
    states = []
    let rawdata = fs.readFileSync(path.join(__dirname, '../', 'public', 'data', 'states.json'))
    let data = JSON.parse(rawdata)
    data.forEach(val => states.push(val.state_name))
    return states
}