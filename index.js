import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import dotenv from 'dotenv';
import { startScheduler } from './services/schedulerServices.js';
import remindersRouter from './routes/reminders.js';
import listsRouter from './routes/lists.js';
import authRoutes from './routes/auths.js';
import { startWhatsApp, sendWhatsAppMessage } from './services/whatsappServices.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Session config
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
}));

// Authentication check middleware
function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    }
    return res.redirect('/');
}

// API routes
app.use('/api/reminders', remindersRouter);
app.use('/api/lists', listsRouter);
app.use('/api/auth', authRoutes);

// Public access routes (login and register pages only)
app.use('/login.html', express.static(path.join(__dirname, 'public', 'login.html')));
app.use('/register.html', express.static(path.join(__dirname, 'public', 'register.html')));

// Root route — if logged in, go to / otherwise show login
app.get('/', (req, res) => {
    if (req.session && req.session.userId) {
        res.sendFile(path.join(__dirname, 'protected', 'index.html'));
    } else {
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
    }
});

// Optional: logout route
app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

startWhatsApp();
startScheduler();

// Catch-all for static assets (e.g., CSS/JS used by public pages)
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
