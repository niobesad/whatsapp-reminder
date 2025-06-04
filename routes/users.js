// routes/user.js
import express from 'express';
import * as User from '../models/user.js';

const router = express.Router();

router.get('/phone', async (req, res) => {
    try {
        const userId = req.session.userId;
        const phone = await User.getPhoneNumber(userId);

        res.json({ phone_number: phone });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/phone', async (req, res) => {
    try {
        const userId = req.session.userId;
        const { phone_number } = req.body;
        if (!phone_number) return res.status(400).json({ error: 'Phone number is required' });

        await User.updatePhoneNumber(userId, phone_number);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/broadcast-mode', async (req, res) => {
    try {
        const userId = req.session.userId;
        const mode = await User.getBroadcastMode(userId);
        res.json({ broadcast_mode: mode });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/broadcast-mode', async (req, res) => {
    try {
        const userId = req.session.userId;
        const { broadcast_mode } = req.body;

        if (![0, 1].includes(broadcast_mode)) {
            return res.status(400).json({ error: 'Invalid broadcast mode' });
        }

        await User.setBroadcastMode(userId, broadcast_mode);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export async function getBroadcastMode(userId) {
    const user = await db('users').where({ id: userId }).first('broadcast_mode');
    return user ? user.broadcast_mode : 0;
}

export async function setBroadcastMode(userId, mode) {
    // mode should be 0 or 1
    return db('users').where({ id: userId }).update({ broadcast_mode: mode });
}

export default router;
