// Auto-save form draft as user types
        ['first-name','last-name','username','email'].forEach(id => {
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

        document.getElementById('signup-form').addEventListener('submit', function(e) {
            e.preventDefault();

            const firstName       = document.getElementById('first-name').value.trim();
            const lastName        = document.getElementById('last-name').value.trim();
            const username        = document.getElementById('username').value.trim();
            const email           = document.getElementById('email').value.trim();
            const password        = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const role            = document.querySelector('input[name="role"]:checked').value;
            const gender          = document.querySelector('input[name="gender"]:checked').value;
            const errorEl         = document.getElementById('signup-error');

            // Validation
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

            const result = registerUser({ firstName, lastName, username, email, password, role, gender });

            if (!result.ok) {
                errorEl.textContent = '⚠️ ' + result.error;
                errorEl.style.display = 'block';
                return;
            }

            errorEl.style.display = 'none';
            clearFormDraft(); // wipe saved draft on success

            // Auto-login
            const loginResult = loginUser(email, password, role);
            if (loginResult.ok) setSession(loginResult.user);

            showToast(`Welcome to Cooking-Star, ${firstName}! 🎉`);

            setTimeout(() => {
                window.location.href = role === 'admin' ? 'admin.html' : 'user-dashboard.html';
            }, 1000);
        });