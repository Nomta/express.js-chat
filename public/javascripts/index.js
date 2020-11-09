var login = document.getElementById('login')
var logout = document.getElementById('logout')

logout && logout.addEventListener('click', async function(e) {
    e.preventDefault()
    
    try {
        var response = await fetch('/logout', {
            method: 'POST'
        })

        if (response.ok) {
            window.location.href = '/'
        }
    }
    catch(err) {
        console.error(err)
    }
})