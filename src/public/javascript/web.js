async function get_states () {
    let res = await fetch(
        '/getstates', 
        { 
            method: 'POST', 
            headers: {"Content-Type": "application/json" },
        }
    )
    let result = await res.json()
    return result
}

window.onload = function () {
    get_states()
    .then(_states => {
        let st = document.getElementById("state")
        _states.data.forEach(val => {
            let newoption = document.createElement('option')
    
            newoption.value = val.toLowerCase()
            newoption.innerHTML = val
            st.options.add(newoption)
        })
    })
}

async function get_districts (state) {
    let res = await fetch(
        '/getdata', 
        { 
            method: 'POST', 
            headers: {"Content-Type": "application/json" },
            body : JSON.stringify({
                state : state
            })
        }
    )
    let result = await res.json()
    return result
}

async function populate(_s1, _s2) {
    let s1 = document.getElementById(_s1)
    let s2 = document.getElementById(_s2)

    s2.innerHTML = ""

    let districts = []
    let raw_districts = await get_districts(s1.options[s1.selectedIndex].text)

    raw_districts.data.forEach(dict => districts.push(dict['name']))

    districts = districts.sort()
    districts.forEach(dt => {
        let pair = [dt.toLowerCase(), dt]
        let newoption = document.createElement('option')

        newoption.value = pair[0]
        newoption.innerHTML = pair[1]
        s2.options.add(newoption)
    })

    let opt = document.createElement('option')
    opt.value = "null"
    opt.innerHTML = "-- Enter your district --"
    opt.disabled  = true
    opt.selected = true
    s2.options.add(opt)

    let dt = document.getElementById("district")
    let my_str = dt.value
    if (my_str == "null") {
        let btn = document.getElementById("join__btn")
        btn.disabled = true
    }
}

async function get_district_data() {
    let dt = document.getElementById("district")
    let name = dt.options[dt.selectedIndex].text
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

async function get_btn() {
    res = await get_district_data()
    let btn = document.getElementById("join__btn")
    if (res.has_group === false) {
        btn.innerHTML = "Request a new group"
    } else {
	btn.innerHTML = "Join the telegram"
    }
    btn.disabled = false
}

async function open_url() {
    let btn = document.getElementById("join__btn")
    res = await get_district_data()
    if (btn.innerHTML == "Request a new group") {  
        window.open(`/request_ch?district_id=${res.district_id}`, '_self')
    } else {
        try {
            window.open(res.invite, '_blank')
        }
        catch (err) {
            window.open(res.invite, '_self')
        }
	    window.open(res.invite, '_self')
    }
}