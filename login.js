document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const role     = document.querySelector('input[name="role"]:checked').value;
    const errorEl  = document.getElementById('login-error');

    // reset error
    errorEl.style.display = 'none';

    //call login api
    fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(async (res) => {
        let data;

        try {
            data = await res.json();
        } catch {
            throw new Error("Invalid server response");
        }

        if (!res.ok) {
            throw new Error(data.error || "Login failed");
        }

        return data;
    })
    .then(data => {
        console.log(data);

        alert("Login successful!");

        //save user
        localStorage.setItem("user", JSON.stringify({
            username: data.username
        }));

        //redirect
        window.location.href = "user-dashboard.html";
    })
    .catch(err => {
        console.error(err);

        errorEl.textContent = err.message;
        errorEl.style.display = 'block';
    });
});