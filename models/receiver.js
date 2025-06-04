// models/receiver.js
import db from '../db/connection.js';

export async function getAll(userId) {
    return db('receivers_lists').where({ user_id: userId }).select('*');
}

export async function create(phoneNumber, userId) {
    const [id] = await db('receivers_lists').insert({ phone_number: phoneNumber, user_id: userId });
    return id;
}

export async function remove(id, userId) {
    return db('receivers_lists').where({ id, user_id: userId }).del();
}
