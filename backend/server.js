require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDatabase = require('./config/database');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const logger = require('./utils/logger');

const authRoutes    = require('./routes/authRoutes');
const bookRoutes    = require('./routes/bookRoutes');
const studentRoutes = require('./routes/studentRoutes');
const issueRoutes   = require('./routes/issueRoutes');

const app = express();

connectDatabase();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

app.get('/api/health', (req, res) => res.json({ success: true, message: 'Library API is running.', timestamp: new Date().toISOString() }));

app.use('/api/auth',     authRoutes);
app.use('/api/books',    bookRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/issues',   issueRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`));

module.exports = app;
