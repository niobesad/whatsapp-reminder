import db from '../db/connection.js';

export async function getAll(userId) {
    return db('reminders').where({ user_id: userId });
}

export async function getById(id, userId) {
    return db('reminders').where({ id, user_id: userId }).first();
}

export async function create(data, userId) {
    const [id] = await db('reminders').insert({ ...data, user_id: userId });
    return id;
}

export async function update(id, data, userId) {
    return db('reminders').where({ id, user_id: userId }).update(data);
}

export async function remove(id, userId) {
    return db('reminders').where({ id, user_id: userId }).del();
}

export async function getTags(reminderId) {
    return db('custom_lists')
        .join('reminder_tags', 'custom_lists.id', 'reminder_tags.custom_list_id')
        .where('reminder_tags.reminder_id', reminderId)
        .select('custom_lists.id', 'custom_lists.name');
}

export async function addTag(reminderId, tagId) {
    return db('reminder_tags').insert({ reminder_id: reminderId, custom_list_id: tagId });
}

export async function removeTag(reminderId, tagId) {
    return db('reminder_tags')
        .where({ reminder_id: reminderId, custom_list_id: tagId })
        .del();
}
