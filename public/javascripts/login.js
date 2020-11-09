var form = document.forms[0]

form && form.addEventListener('submit', async function(e) {
    e.preventDefault()
    
    var login = this.closest('#login')
    var formData = {}

    for (var { name, value } of form.elements) {
        value && (formData[name] = value)
    }
    
    try {
        var response = await fetch('/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-requested-with': 'XMLHttpRequest'
            },
            body: JSON.stringify(formData)
        })

        if (response.ok) {
            return window.location.href = '/'
        }

        login.classList.add('alert-danger')
        form.reset()
    }
    catch(e) {
        console.error(e)
    }
})