async function send_mail() {
    let name = document.getElementById("name")
    let email = document.getElementById("email")
    let body = document.getElementById("message")

    let res = await fetch(
        '/sendmail', 
        {
            method: 'POST', 
            headers: {"Content-Type": "application/json" },
            body : JSON.stringify({
                name : name.value,
                email : email.value,
                text : body.value
            })
        }
    )

    alert("Submitted your query, Please wait a few days for the response")
    window.open('/index.html', '_self')
}