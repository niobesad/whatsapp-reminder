import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import dotenv from 'dotenv';

import { startScheduler } from './services/schedulerServices.js';
import { startWhatsApp } from './services/whatsappServices.js';

import remindersRouter from './routes/reminders.js';
import listsRouter from './routes/lists.js';
import authRoutes from './routes/auths.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
}));

// Auth middleware
function isAuthenticated(req, res, next) {
    if (req.session?.userId) return next();
    return res.redirect('/login.html');
}

// API routes (protected)
app.use('/api/reminders', isAuthenticated, remindersRouter);
app.use('/api/lists', isAuthenticated, listsRouter);

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Root route
app.get('/', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'protected', 'index.html'));
});

// Serve static assets
app.use(express.static(path.join(__dirname, 'public')));

// Background services
startWhatsApp();
startScheduler();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
