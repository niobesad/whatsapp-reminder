// scheduler.js
import db from '../db/connection.js';
import { sendWhatsAppMessage } from './whatsappServices.js';

// Track scheduled reminder jobs to avoid duplicates
const scheduledReminders = new Map();
// With format { [reminderId]: { jobIndexesSent: Set<number> } }

function scheduleReminder(reminder, phone) {
    // offsets in ms and labels for messages: 5 min before, at due, 5 min after
    const times = [
        { offset: -5 * 60 * 1000, label: 'in 5 minutes' },
        { offset: 0, label: 'now' },
        { offset: 5 * 60 * 1000, label: '5 minutes ago' },
    ];

    const now = Date.now();
    const due = new Date(reminder.due_date).getTime();

    if (!scheduledReminders.has(reminder.id)) {
        scheduledReminders.set(reminder.id, { jobIndexesSent: new Set() });
    }

    const reminderRecord = scheduledReminders.get(reminder.id);

    times.forEach(({ offset }, index) => {
        // If this message already scheduled/sent, skip
        if (reminderRecord.jobIndexesSent.has(index)) return;

        const sendTime = due + offset;
        const delay = sendTime - now;

        // Skip if it's way too late
        if (delay < -60 * 1000) return;

        // If delay negative but within 1 min, send immediately with zero delay
        const effectiveDelay = delay > 0 ? delay : 0;

        setTimeout(async () => {
            try {
                // Re-check if reminder is completed before sending
                const latestReminder = await db('reminders').where('id', reminder.id).first();
                if (!latestReminder || latestReminder.completed) {
                    console.log(`Skipping reminder ${reminder.id} at index ${index} (already completed).`);
                    return;
                }

                const message =
                    `📌 *Reminder*\n` +
                    `🔔 Title: ${reminder.title}\n` +
                    `📝 Message: ${reminder.description}\n` +
                    `⏰ Due: ${new Date(reminder.due_date).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}\n` +
                    `🆔 ID: ${reminder.id}\n` +
                    `🕑 The reminder is due ${times[index].label}.\n\n` +
                    `Reply "Complete" to mark it as done.`;

                await sendWhatsAppMessage(phone, message);

                // Mark this job index as done to prevent duplicates
                reminderRecord.jobIndexesSent.add(index);
            } catch (error) {
                console.error(`Error sending reminder ${reminder.id}:`, error);
            }
        }, effectiveDelay);
    });
}

// On startup, find all active reminders and schedule them
async function initialScanAndSchedule() {
    try {
        const now = new Date();
        // No time range limit, schedule all incomplete reminders regardless of due_date
        const reminders = await db('reminders')
            .join('users', 'reminders.user_id', '=', 'users.id')
            .select('reminders.id', 'reminders.title', 'reminders.description', 'reminders.due_date', 'users.phone', 'reminders.completed')
            .where('reminders.completed', 0);

        for (const reminder of reminders) {
            scheduleReminder(reminder, reminder.phone);
        }
        console.log(`Initial scan scheduled ${reminders.length} reminders.`);
    } catch (error) {
        console.error('Error in initial scan:', error);
    }
}

// Called when a new or updated reminder is saved
export async function scheduleReminderForUser(reminder) {
    try {
        if (reminder.completed) {
            return;
        }

        let phone = reminder.phone;
        if (!phone) {
            const user = await db('users').where('id', reminder.user_id).first();
            if (!user || !user.phone) {
                console.warn(`Cannot schedule reminder ${reminder.id}: user phone not found`);
                return;
            }
            phone = user.phone;
        }

        // Pass it to scheduler
        scheduleReminder(reminder, phone);
    } catch (error) {
        console.error('Error scheduling reminder for user:', error);
    }
}

// Entry point for scheduler
export async function startScheduler() {
    await initialScanAndSchedule();
    console.log('Scheduler started and initial scan done.');
}

