const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db/init');
const { generateToken, authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/signup - Register new user
router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const db = getDb();

    // Check if user exists
    const existingUser = db.prepare('SELECT id FROM profiles WHERE email = ?').get(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Create user
    const userId = uuidv4();
    const passwordHash = bcrypt.hashSync(password, 10);

    db.prepare(`
      INSERT INTO profiles (id, email, password_hash, full_name)
      VALUES (?, ?, ?, ?)
    `).run(userId, email, passwordHash, fullName || null);

    // Assign default 'user' role
    db.prepare(`
      INSERT INTO user_roles (id, user_id, role)
      VALUES (?, ?, 'user')
    `).run(uuidv4(), userId);

    // Get created user
    const user = db.prepare(`
      SELECT p.id, p.email, p.full_name, p.created_at, r.role
      FROM profiles p
      LEFT JOIN user_roles r ON p.id = r.user_id
      WHERE p.id = ?
    `).get(userId);

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = getDb();

    // Find user
    const user = db.prepare(`
      SELECT p.id, p.email, p.password_hash, p.full_name, p.created_at, r.role
      FROM profiles p
      LEFT JOIN user_roles r ON p.id = r.user_id
      WHERE p.email = ?
    `).get(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// GET /api/auth/me - Get current user
router.get('/me', authenticateToken, (req, res) => {
  try {
    const db = getDb();
    
    const user = db.prepare(`
      SELECT p.id, p.email, p.full_name, p.created_at, r.role
      FROM profiles p
      LEFT JOIN user_roles r ON p.id = r.user_id
      WHERE p.id = ?
    `).get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// POST /api/auth/logout - Logout (client-side token removal)
router.post('/logout', (req, res) => {
  // JWT tokens are stateless, so logout is handled client-side
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
