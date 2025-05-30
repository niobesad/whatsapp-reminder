import express from 'express';
import * as Auth from '../models/auth.js';

const router = express.Router();

// Function to normalize phone number format to the Indonesian international format (62)
function normalizePhoneNumber(phone) {
    phone = phone.replace(/[\s\-()]/g, '');

    if (phone.startsWith('+62')) {
        return phone.slice(1);
    } else if (phone.startsWith('0')) {
        return '62' + phone.slice(1);
    } else if (phone.startsWith('62')) {
        return phone;
    } else {
        throw new Error('Invalid phone number format');
    }
}

router.post('/register', async (req, res) => {
    try {
        const { username, email, password, phone } = req.body;
        const standardPhone = normalizePhoneNumber(phone);
        const id = await Auth.registerUser({ username, email, password, phone: standardPhone });
        res.status(201).json({ success: true, id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user } = await Auth.loginUser({ email, password });

        // Set user ID in session here:
        req.session.userId = user.id || user._id;

        // Respond with success, no token needed for session auth
        res.json({ success: true, user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.redirect('/login.html');
    });
});

export default router;
