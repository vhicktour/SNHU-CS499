const express = require('express');
const router = express.Router();
const Animal = require('../models/Animal');

// Get all animals with pagination
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [animals, total] = await Promise.all([
      Animal.find()
        .select('-__v')
        .skip(skip)
        .limit(limit)
        .lean(),
      Animal.countDocuments()
    ]);

    res.json({
      animals,
      totalCount: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get animals by rescue type
router.get('/rescue/:type', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query;
    switch (req.params.type.toLowerCase()) {
      case 'water':
        query = Animal.getWaterRescue();
        break;
      case 'mountain':
        query = Animal.getMountainRescue();
        break;
      case 'disaster':
        query = Animal.getDisasterRescue();
        break;
      case 'wilderness':
        query = Animal.getWildernessRescue();
        break;
      default:
        return res.status(400).json({ message: 'Invalid rescue type' });
    }

    const [animals, total] = await Promise.all([
      query
        .select('-__v')
        .skip(skip)
        .limit(limit)
        .lean(),
      Animal.countDocuments(query.getQuery())
    ]);

    res.json({
      animals,
      totalCount: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });
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