import express from 'express';
import * as List from '../models/list.js';

const router = express.Router();

// Get all lists for user
router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        const lists = await List.getAll(userId);
        res.json(lists);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new list for user
router.post('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        const { name } = req.body;

        if (!name) return res.status(400).json({ error: 'Name is required' });

        const id = await List.create({ name }, userId);
        res.status(201).json({ success: true, id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete list if owned by user
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.session.userId;
        const deleted = await List.remove(req.params.id, userId);
        if (!deleted) return res.status(404).json({ error: 'Not found or not allowed' });

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
