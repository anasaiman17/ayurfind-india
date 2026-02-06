const express = require('express');
const { getDb } = require('../db/init');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/users - Get all users (admin only)
router.get('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const db = getDb();
    
    const users = db.prepare(`
      SELECT p.id, p.email, p.full_name, p.created_at, r.role
      FROM profiles p
      LEFT JOIN user_roles r ON p.id = r.user_id
      ORDER BY p.created_at DESC
    `).all();

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/users/profiles - Get all profiles
router.get('/profiles', authenticateToken, requireAdmin, (req, res) => {
  try {
    const db = getDb();
    
    const profiles = db.prepare(`
      SELECT id, email, full_name, created_at
      FROM profiles
      ORDER BY created_at DESC
    `).all();

    res.json(profiles);
  } catch (error) {
    console.error('Get profiles error:', error);
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

// GET /api/users/roles - Get all roles
router.get('/roles', authenticateToken, requireAdmin, (req, res) => {
  try {
    const db = getDb();
    
    const roles = db.prepare(`
      SELECT * FROM user_roles
    `).all();

    res.json(roles);
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

// PUT /api/users/:id/role - Update user role (admin only)
router.put('/:id/role', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { role } = req.body;
    const userId = req.params.id;

    if (!role || !['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Valid role (admin or user) is required' });
    }

    // Prevent admin from changing their own role
    if (userId === req.user.id) {
      return res.status(400).json({ error: 'Cannot change your own role' });
    }

    const db = getDb();

    // Check if user exists
    const user = db.prepare('SELECT id FROM profiles WHERE id = ?').get(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update role
    db.prepare(`
      UPDATE user_roles SET role = ? WHERE user_id = ?
    `).run(role, userId);

    res.json({ message: 'Role updated successfully', userId, role });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

module.exports = router;
