// routes/receivers.js
import express from 'express';
import * as Receiver from '../models/receiver.js';

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

router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        const receivers = await Receiver.getAll(userId);
        res.json(receivers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        const { phone_number } = req.body;
        if (!phone_number) return res.status(400).json({ error: 'Phone number is required' });

        const standardPhone = normalizePhoneNumber(phone_number);
        const id = await Receiver.create(standardPhone, userId);
        res.status(201).json({ success: true, id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const userId = req.session.userId;
        const deleted = await Receiver.remove(req.params.id, userId);
        if (!deleted) return res.status(404).json({ error: 'Not found or not allowed' });

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
