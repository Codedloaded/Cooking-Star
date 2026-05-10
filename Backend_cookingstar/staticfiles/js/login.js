// login.js

document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorEl  = document.getElementById('login-error');

    errorEl.style.display = 'none';

    if (!email || !password) {
        errorEl.textContent = '⚠️ Please enter your email and password.';
        errorEl.style.display = 'block';
        return;
    }

    try {
        const res = await apiFetch('/api/login/', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        let data;
        try { data = await res.json(); }
        catch { throw new Error('Invalid server response'); }

        if (!res.ok) throw new Error(data.error || 'Login failed');

        // Persist session and token
        setSession({
            username:  data.username,
            firstName: data.firstName,
            email:     data.email,
            role:      data.role,
            isAdmin:   data.isAdmin,
        });
        setToken(data.token);

        // Redirect based on role
        // FIX: admin redirect now goes to /admin-dashboard/, not /admin/
        if (data.isAdmin) {
            window.location.href = '/admin-dashboard/';
        } else {
            window.location.href = '/user-dashboard/';
        }

    } catch (err) {
        console.error(err);
        errorEl.textContent = err.message;
        errorEl.style.display = 'block';
    }
});
