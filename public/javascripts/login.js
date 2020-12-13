const form = document.forms[0];

form &&
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const login = this.closest("#login");
        const formData = {};

        for (const { name, value } of form.elements) {
            value && (formData[name] = value);
        }

        try {
            const response = await fetch("/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-requested-with": "XMLHttpRequest"
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                return (window.location.href = "/chat");
            }

            login.classList.add("alert-danger");
            form.reset();
        } catch (e) {
            console.error(e);
        }
    });
