document.getElementById('login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const email    = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const role     = document.querySelector('input[name="role"]:checked').value;
            const errorEl  = document.getElementById('login-error');

            const result = loginUser(email, password, role);

            if (!result.ok) {
                errorEl.textContent = '⚠️ ' + result.error;
                errorEl.style.display = 'block';
                return;
            }

            errorEl.style.display = 'none';
            setSession(result.user);
            showToast(`Welcome back, ${result.user.firstName}! 🍰`);

            setTimeout(() => {
                window.location.href = result.user.isAdmin ? 'admin.html' : 'user-dashboard.html';
            }, 1000);
        });