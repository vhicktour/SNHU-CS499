const express = require('express');
const router = express.Router();
const Animal = require('../models/Animal');

// Get all animals with optional limit
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const animals = await Animal.find().limit(limit);
    res.json(animals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get animals by rescue type
router.get('/rescue/:type', async (req, res) => {
  try {
    let animals;
    switch (req.params.type.toLowerCase()) {
      case 'water':
        animals = await Animal.getWaterRescue();
        break;
      case 'mountain':
        animals = await Animal.getMountainRescue();
        break;
      case 'disaster':
        animals = await Animal.getDisasterRescue();
        break;
      default:
        animals = await Animal.find().limit(100);
    }
    res.json(animals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get breed statistics
router.get('/stats/breeds', async (req, res) => {
  try {
    const stats = await Animal.aggregate([
      {
        $group: {
          _id: '$breed',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;