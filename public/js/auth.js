// auth.js

// Register form elements
const regForm = document.getElementById('register-form');
const errorMsgReg = document.getElementById('error-msg');
const successMsg = document.getElementById('success-msg');

// Login form elements
const loginForm = document.getElementById('login-form');
const errorMsgLog = document.getElementById('error-msg');

// Register form handler
if (regForm) {
    regForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMsgReg.textContent = '';
        successMsg.textContent = '';

        const username = regForm.username.value.trim();
        const email = regForm.email.value.trim();
        const password = regForm.password.value;
        const phone = regForm.phone.value.trim();

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, phone }),
            });

            const data = await res.json();
            if (!res.ok) {
                errorMsgReg.textContent = data.error || 'Registration failed';
                return;
            }

            successMsg.textContent = 'Registration successful! You can now login.';
            regForm.reset();
        } catch {
            errorMsgReg.textContent = 'Network error. Try again later.';
        }
    });
}

// Login form handler
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorMsgLog.textContent = '';

        const email = loginForm.email.value.trim();
        const password = loginForm.password.value;

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                errorMsgLog.textContent = data.error || 'Login failed';
                return;
            }

            window.location.href = '/';
        } catch {
            errorMsgLog.textContent = 'Network error. Try again later.';
        }
    });
}
