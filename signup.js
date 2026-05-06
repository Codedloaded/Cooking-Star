// Auto-save form draft as user types
['first-name', 'last-name', 'username', 'email'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    // Restore draft
    const draft = getFormDraft();
    if (draft[id]) el.value = draft[id];
    // Save on input
    el.addEventListener('input', () => {
        saveFormDraft({ ...getFormDraft(), [id]: el.value });
    });
});

document.getElementById('signup-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const firstName       = document.getElementById('first-name').value.trim();
    const lastName        = document.getElementById('last-name').value.trim();
    const username        = document.getElementById('username').value.trim();
    const email           = document.getElementById('email').value.trim();
    const password        = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const roleInput       = document.querySelector('input[name="role"]:checked');
    const genderInput     = document.querySelector('input[name="gender"]:checked');
    const role            = roleInput  ? roleInput.value  : 'user';
    const gender          = genderInput ? genderInput.value : '';
    const errorEl         = document.getElementById('signup-error');

    // ── Client-side validation ──────────────────────────────────────────
    if (password !== confirmPassword) {
        errorEl.textContent = '⚠️ Passwords do not match.';
        errorEl.style.display = 'block';
        return;
    }
    if (password.length < 6) {
        errorEl.textContent = '⚠️ Password must be at least 6 characters.';
        errorEl.style.display = 'block';
        return;
    }

    // ── Call the signup API ─────────────────────────────────────────────
    fetch("http://127.0.0.1:8000/api/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username,
            email,
            password,
            role,
            firstName,
            lastName,
            gender,
        })
    })
    .then(async (res) => {
        let data;
        try {
            data = await res.json();
        } catch {
            throw new Error("Invalid server response");
        }
        if (!res.ok) throw new Error(data.error || "Signup failed");
        return data;
    })
    .then(data => {
        // ── Persist session in localStorage so the navbar sees it ────────
        setSession({
            username:  data.username,
            firstName: data.firstName,
            email:     data.email,
            role:      data.role,        // user or admin
            isAdmin:   data.isAdmin,
        });

        // ── Persist the auth token for future API calls ──────────────────
        localStorage.setItem('cookingStar_token', data.token);

        errorEl.style.display = 'none';
        clearFormDraft();

        // ── Redirect based on role ───────────────────────────────────────
        if (data.isAdmin) {
            window.location.href = "admin.html";
        } else {
            window.location.href = "user-dashboard.html";
        }
    })
    .catch(err => {
        console.error(err);
        errorEl.textContent = err.message;
        errorEl.style.display = 'block';
    });
});