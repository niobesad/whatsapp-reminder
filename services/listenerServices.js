// listenerServices.js
import knex from '../db/connection.js';

export async function markReminderAsComplete(reminderId) {
    try {
        const updated = await knex('reminders')
            .where({ id: reminderId })
            .update({ completed: '1' });
        return updated > 0;
    } catch (err) {
        console.error('Error updating reminder:', err);
        throw err;
    }
}

export async function getLastPendingReminderByUser(phone) {
    const trimPhone = phone.split('@')[0];
    return await knex('reminders')
        .join('users', 'reminders.user_id', 'users.id')
        .where('users.phone', trimPhone)
        .andWhere('reminders.completed', 0)
        .orderBy('reminders.due_date', 'desc')
        .select('reminders.*')
}


export async function handleIncomingMessage(message, client) {
    try {
        const from = message.key.remoteJid;
        const messageContent =
            message.message?.conversation ||
            message.message?.extendedTextMessage?.text || '';

        const normalizedMsg = messageContent.trim();

        // 1. Check for "complete <id>"
        const completeWithIdMatch = normalizedMsg.match(/complete\s+(\w+)/i);
        if (completeWithIdMatch) {
            const reminderId = completeWithIdMatch[1];
            const success = await markReminderAsComplete(reminderId);
            const replyText = success
                ? `✅ Reminder ${reminderId} marked as complete.`
                : `❌ Reminder ${reminderId} not found or already completed.`;
            await client.sendMessage(from, { text: replyText }, { quoted: message });
            return;
        }

        // 2. Quoted reply *with actual quoted text*
        const contextInfo = message.message?.extendedTextMessage?.contextInfo;
        const quotedText = contextInfo?.quotedMessage?.conversation;

        if (contextInfo && quotedText && /complete/i.test(normalizedMsg)) {
            const idMatch = quotedText.match(/ID:\s?(\w+)/i);

            if (idMatch && idMatch[1]) {
                const reminderId = idMatch[1];
                const success = await markReminderAsComplete(reminderId);
                const replyText = success
                    ? `✅ Reminder ${reminderId} marked as complete.`
                    : `❌ Reminder ${reminderId} not found or already completed.`;
                await client.sendMessage(from, { text: replyText }, { quoted: message });
            } else {
                await client.sendMessage(from, {
                    text: `❌ Could not find reminder ID in your reply.`,
                }, { quoted: message });
            }
            return;
        }

        // 3. Plain "complete"
        if (/^complete$/i.test(normalizedMsg)) {
            const lastReminder = await getLastPendingReminderByUser(from);
            if (!lastReminder) {
                await client.sendMessage(from, {
                    text: `❌ No pending reminders found.`,
                }, { quoted: message });
                return;
            }
            const success = await markReminderAsComplete(lastReminder.id);
            const replyText = success
                ? `✅ Last reminder (ID: ${lastReminder.id}) marked as complete.`
                : `❌ Could not mark the last reminder as complete.`;
            await client.sendMessage(from, { text: replyText }, { quoted: message });
            return;
        }

    } catch (err) {
        console.error('Error in handleIncomingMessage:', err);
    }
}

