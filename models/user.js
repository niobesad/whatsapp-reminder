// models/user.js
import db from '../db/connection.js';

export async function getPhoneNumber(userId) {
    const user = await db('users').where({ id: userId }).first('phone');
    return user ? user.phone : null;
}

export async function updatePhoneNumber(userId, phoneNumber) {
    return db('users').where({ id: userId }).update({ phone_number: phoneNumber });
}

export async function getBroadcastMode(userId) {
    const user = await db('users').where({ id: userId }).first('broadcast_mode');
    return user ? user.broadcast_mode : 0;
}

export async function setBroadcastMode(userId, mode) {
    // mode should be 0 or 1
    return db('users').where({ id: userId }).update({ broadcast_mode: mode });
}
