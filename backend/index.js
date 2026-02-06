const express = require('express');
const cors = require('cors');
const path = require('path');

// Initialize database
const { initDatabase } = require('./db/init');

// Routes
const authRoutes = require('./routes/auth');
const plantRoutes = require('./routes/plants');
const userRoutes = require('./routes/users');
const identifyRoutes = require('./routes/identify');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Initialize database
initDatabase();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'MedFind Backend is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/users', userRoutes);
app.use('/api/identify', identifyRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║   🌿 MedFind Backend Server                            ║
║   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   ║
║                                                        ║
║   Server running at: http://localhost:${PORT}            ║
║   Database: SQLite (backend/data/medfind.db)           ║
║                                                        ║
║   API Endpoints:                                       ║
║   • GET  /api/health        - Health check             ║
║   • POST /api/auth/login    - User login               ║
║   • POST /api/auth/signup   - User registration        ║
║   • GET  /api/plants        - Get all plants           ║
║   • POST /api/plants        - Add new plant (admin)    ║
║   • GET  /api/users         - Get all users (admin)    ║
║   • POST /api/identify      - Identify plant (mock)    ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
