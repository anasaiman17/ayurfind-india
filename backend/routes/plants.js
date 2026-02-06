const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDb } = require('../db/init');
const { authenticateToken, requireAdmin, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Helper to parse JSON fields
function parsePlant(plant) {
  return {
    ...plant,
    medicinal_uses: plant.medicinal_uses ? JSON.parse(plant.medicinal_uses) : [],
    parts_used: plant.parts_used ? JSON.parse(plant.parts_used) : [],
    active_compounds: plant.active_compounds ? JSON.parse(plant.active_compounds) : [],
    precautions: plant.precautions ? JSON.parse(plant.precautions) : [],
    region_availability: plant.region_availability ? JSON.parse(plant.region_availability) : []
  };
}

// GET /api/plants - Get all plants
router.get('/', optionalAuth, (req, res) => {
  try {
    const db = getDb();
    const plants = db.prepare(`
      SELECT * FROM plants ORDER BY created_at DESC
    `).all();

    res.json(plants.map(parsePlant));
  } catch (error) {
    console.error('Get plants error:', error);
    res.status(500).json({ error: 'Failed to fetch plants' });
  }
});

// GET /api/plants/:id - Get single plant
router.get('/:id', optionalAuth, (req, res) => {
  try {
    const db = getDb();
    const plant = db.prepare('SELECT * FROM plants WHERE id = ?').get(req.params.id);

    if (!plant) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    res.json(parsePlant(plant));
  } catch (error) {
    console.error('Get plant error:', error);
    res.status(500).json({ error: 'Failed to fetch plant' });
  }
});

// POST /api/plants - Create new plant (admin only)
router.post('/', authenticateToken, requireAdmin, (req, res) => {
  try {
    const {
      english_name,
      scientific_name,
      hindi_name,
      tamil_name,
      telugu_name,
      family,
      description,
      medicinal_uses,
      parts_used,
      active_compounds,
      precautions,
      dosage,
      image_url,
      region_availability,
      medicine_category
    } = req.body;

    if (!english_name || !description) {
      return res.status(400).json({ error: 'English name and description are required' });
    }

    const db = getDb();
    const id = uuidv4();

    db.prepare(`
      INSERT INTO plants (
        id, english_name, scientific_name, hindi_name, tamil_name, telugu_name,
        family, description, medicinal_uses, parts_used, active_compounds,
        precautions, dosage, image_url, region_availability, medicine_category, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      english_name,
      scientific_name || null,
      hindi_name || null,
      tamil_name || null,
      telugu_name || null,
      family || null,
      description,
      JSON.stringify(medicinal_uses || []),
      JSON.stringify(parts_used || []),
      JSON.stringify(active_compounds || []),
      JSON.stringify(precautions || []),
      dosage || null,
      image_url || null,
      JSON.stringify(region_availability || []),
      medicine_category || null,
      req.user.id
    );

    const plant = db.prepare('SELECT * FROM plants WHERE id = ?').get(id);

    res.status(201).json(parsePlant(plant));
  } catch (error) {
    console.error('Create plant error:', error);
    res.status(500).json({ error: 'Failed to create plant' });
  }
});

// PUT /api/plants/:id - Update plant (admin only)
router.put('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM plants WHERE id = ?').get(req.params.id);

    if (!existing) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    const {
      english_name,
      scientific_name,
      hindi_name,
      tamil_name,
      telugu_name,
      family,
      description,
      medicinal_uses,
      parts_used,
      active_compounds,
      precautions,
      dosage,
      image_url,
      region_availability,
      medicine_category
    } = req.body;

    db.prepare(`
      UPDATE plants SET
        english_name = ?,
        scientific_name = ?,
        hindi_name = ?,
        tamil_name = ?,
        telugu_name = ?,
        family = ?,
        description = ?,
        medicinal_uses = ?,
        parts_used = ?,
        active_compounds = ?,
        precautions = ?,
        dosage = ?,
        image_url = ?,
        region_availability = ?,
        medicine_category = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `).run(
      english_name || existing.english_name,
      scientific_name || existing.scientific_name,
      hindi_name || existing.hindi_name,
      tamil_name || existing.tamil_name,
      telugu_name || existing.telugu_name,
      family || existing.family,
      description || existing.description,
      medicinal_uses ? JSON.stringify(medicinal_uses) : existing.medicinal_uses,
      parts_used ? JSON.stringify(parts_used) : existing.parts_used,
      active_compounds ? JSON.stringify(active_compounds) : existing.active_compounds,
      precautions ? JSON.stringify(precautions) : existing.precautions,
      dosage || existing.dosage,
      image_url || existing.image_url,
      region_availability ? JSON.stringify(region_availability) : existing.region_availability,
      medicine_category || existing.medicine_category,
      req.params.id
    );

    const plant = db.prepare('SELECT * FROM plants WHERE id = ?').get(req.params.id);
    res.json(parsePlant(plant));
  } catch (error) {
    console.error('Update plant error:', error);
    res.status(500).json({ error: 'Failed to update plant' });
  }
});

// DELETE /api/plants/:id - Delete plant (admin only)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  try {
    const db = getDb();
    const existing = db.prepare('SELECT * FROM plants WHERE id = ?').get(req.params.id);

    if (!existing) {
      return res.status(404).json({ error: 'Plant not found' });
    }

    db.prepare('DELETE FROM plants WHERE id = ?').run(req.params.id);

    res.json({ message: 'Plant deleted successfully' });
  } catch (error) {
    console.error('Delete plant error:', error);
    res.status(500).json({ error: 'Failed to delete plant' });
  }
});

// GET /api/plants/search/:query - Search plants
router.get('/search/:query', optionalAuth, (req, res) => {
  try {
    const db = getDb();
    const query = `%${req.params.query}%`;

    const plants = db.prepare(`
      SELECT * FROM plants 
      WHERE english_name LIKE ? 
         OR scientific_name LIKE ? 
         OR hindi_name LIKE ?
         OR tamil_name LIKE ?
         OR telugu_name LIKE ?
         OR description LIKE ?
      ORDER BY english_name
    `).all(query, query, query, query, query, query);

    res.json(plants.map(parsePlant));
  } catch (error) {
    console.error('Search plants error:', error);
    res.status(500).json({ error: 'Failed to search plants' });
  }
});

module.exports = router;
