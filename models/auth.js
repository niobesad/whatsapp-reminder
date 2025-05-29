import db from '../db/connection.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;

export async function registerUser({ username, email, password, phone }) {
    if (!username || !email || !password || !phone) {
        throw new Error('All forms are required');
    }

    // Check if user already exists by email or username
    const existingUser = await db('users')
        .where('email', email)
        .orWhere('username', username)
        .first();

    if (existingUser) {
        throw new Error('User with that email or username already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert user
    const [id] = await db('users').insert({
        username,
        email,
        password: hashedPassword,
        phone,
    });

    return id;
}

export async function loginUser({ email, password }) {
    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const user = await db('users').where({ email }).first();

    if (!user) {
        throw new Error('Invalid email or password');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        throw new Error('Invalid email or password');
    }

    // Create JWT token payload (you can customize this)
    const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { token, user: payload };
}