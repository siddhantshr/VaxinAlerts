async function get_district_data(name) {
    let res = await fetch(
        '/checkgroups', 
        { 
            method: 'POST', 
            headers: {"Content-Type": "application/json" },
            body : JSON.stringify({
                name : name
            })
        }
    )
    let result = await res.json()
    return result.data[0]
}

async function send_channel_request() {
    let district_name = document.getElementById("name")
    let username = document.getElementById("username")
    let email = document.getElementById("email")

    let channelResult = await get_district_data(district_name.placeholder)

    if (channelResult.is_requested === true) {
        alert("This channel is already request within the last 24 hours, Please check back later.")
        window.open('/index.html', '_self')
        return
    }

    await fetch(
        '/request_channel',
        {
            method: 'POST', 
            headers: {"Content-Type": "application/json" },
            body : JSON.stringify({
                district_name : district_name.placeholder,
                email : email.value,
                username : username.value
            })
        }
    )

    alert("Request Initiated, Please wait for around 1-3 days.")
    window.open('/index.html', '_self')
}