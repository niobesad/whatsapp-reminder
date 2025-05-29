import express from 'express';
import * as Reminder from '../models/reminder.js';
import { scheduleReminderForUser } from '../services/schedulerServices.js';

const router = express.Router();

// Get all reminders
router.get('/', async (req, res) => {
    try {
        const { view, list_id } = req.query;
        const userId = req.session.userId;

        let reminders = await Reminder.getAll(userId);

        if (view === 'upcoming') {
            reminders = reminders.filter(r => !r.completed);
        } else if (view === 'completed') {
            reminders = reminders.filter(r => r.completed);
        }

        if (list_id) {
            reminders = await Promise.all(
                reminders.map(async r => {
                    const tags = await Reminder.getTags(r.id);
                    r.tags = tags;
                    return r;
                })
            );
            reminders = reminders.filter(r =>
                r.tags.some(tag => tag.id.toString() === list_id.toString())
            );
        }

        res.json(reminders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get single reminder
router.get('/:id', async (req, res) => {
    try {
        const userId = req.session.userId;
        const reminder = await Reminder.getById(req.params.id, userId);
        if (!reminder) return res.status(404).json({ error: 'Not found' });

        const tags = await Reminder.getTags(reminder.id);
        res.json({ ...reminder, tags });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create reminder
router.post('/', async (req, res) => {
    try {
        const userId = req.session.userId;
        const { title, description, due_date, list_id } = req.body;

        const id = await Reminder.create({
            title,
            description,
            due_date,
            completed: false
        }, userId);

        if (list_id) {
            await Reminder.addTag(id, list_id);
        }

        // Fetch the full reminder after creation to pass to scheduler
        const reminder = await Reminder.getById(id, userId);

        // Trigger scheduler
        if (reminder) {
            await scheduleReminderForUser(reminder);
        }

        res.status(201).json({ success: true, id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update reminder
router.put('/:id', async (req, res) => {
    try {
        const userId = req.session.userId;
        const updated = await Reminder.update(req.params.id, req.body, userId);
        if (!updated) return res.status(404).json({ error: 'Not found or not allowed' });

        // Fetch updated reminder
        const reminder = await Reminder.getById(req.params.id, userId);

        // Trigger scheduler if reminder exists and not completed
        if (reminder && !reminder.completed) {
            await scheduleReminderForUser(reminder);
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete reminder
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.session.userId;
        const deleted = await Reminder.remove(req.params.id, userId);
        if (!deleted) return res.status(404).json({ error: 'Not found or not allowed' });

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
