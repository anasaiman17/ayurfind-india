const express = require('express');
const { getDb } = require('../db/init');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/identify - Mock plant identification
router.post('/', optionalAuth, (req, res) => {
  try {
    const { imageBase64, plants } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'No image provided' });
    }

    console.log('Plant identification request received');
    console.log(`Available plants for matching: ${plants?.length || 0}`);

    // Since we don't have a real AI, we'll return a mock response
    // that randomly selects from available plants with mock confidence scores
    
    const db = getDb();
    let availablePlants = plants || [];
    
    // If no plants provided, fetch from database
    if (availablePlants.length === 0) {
      const dbPlants = db.prepare('SELECT id, english_name, scientific_name FROM plants LIMIT 10').all();
      availablePlants = dbPlants.map(p => ({
        id: p.id,
        englishName: p.english_name,
        scientificName: p.scientific_name
      }));
    }

    // Simulate AI processing delay
    // In a real implementation, you would call an AI API here

    // Generate mock results
    const mockFeatures = [
      'Leaf shape matches',
      'Leaf texture similar',
      'Color pattern recognized',
      'Stem structure identified',
      'Overall morphology matches'
    ];

    // Select 1-3 random plants as matches
    const numMatches = Math.min(3, availablePlants.length);
    const shuffled = [...availablePlants].sort(() => 0.5 - Math.random());
    const selectedPlants = shuffled.slice(0, numMatches);

    const matches = selectedPlants.map((plant, index) => {
      // First match has highest confidence, decreasing for others
      const baseConfidence = 85 - (index * 20);
      const confidence = Math.max(30, baseConfidence + Math.floor(Math.random() * 10) - 5);
      
      // Select random features
      const numFeatures = Math.floor(Math.random() * 3) + 2;
      const features = [...mockFeatures].sort(() => 0.5 - Math.random()).slice(0, numFeatures);

      return {
        plantId: plant.id,
        confidence,
        matchedFeatures: features,
        reasoning: `This plant shows characteristics similar to ${plant.englishName || plant.english_name}. ${features[0].toLowerCase()} with the reference images.`
      };
    });

    // Sort by confidence
    matches.sort((a, b) => b.confidence - a.confidence);

    const response = {
      matches,
      plantDetected: true,
      imageQuality: Math.random() > 0.3 ? 'good' : 'poor',
      qualityIssues: Math.random() > 0.7 ? ['Image could be clearer', 'Better lighting recommended'] : []
    };

    // Add a note that this is a mock response
    console.log('Returning mock identification result');
    console.log('NOTE: This is a placeholder response. For real AI identification, integrate an AI API.');

    res.json(response);
  } catch (error) {
    console.error('Identify plant error:', error);
    res.status(500).json({ error: 'Failed to identify plant' });
  }
});

module.exports = router;
