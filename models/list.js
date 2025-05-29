import db from '../db/connection.js';

export async function getAll(userId) {
    return db('custom_lists').where({ user_id: userId }).select('*');
}

export async function getById(id, userId) {
    return db('custom_lists').where({ id, user_id: userId }).first();
}

export async function create(data, userId) {
    const [id] = await db('custom_lists').insert({ ...data, user_id: userId });
    return id;
}

export async function remove(id, userId) {
    return db('custom_lists').where({ id, user_id: userId }).del();
}
