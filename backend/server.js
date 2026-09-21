require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');

const app = express();
const PORT = process.env.PORT || 3001;

// Behind the Vite dev proxy / Replit edge — needed for correct secure-cookie
// handling and protocol detection.
app.set('trust proxy', 1);

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
}));

app.use('/auth', authRoutes);
app.use('/api', employeeRoutes);

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Beanstalk backend running on port ${PORT}`));
