/**
 * Animal Routes
 * Handles routing for animal-related operations
 * @module routes/animals
 */

import express from 'express';
import * as animalController from '../controllers/animalController.js';

const router = express.Router();

// ============= READ Operations =============

/**
 * @route   GET /api/animals
 * @desc    Get all animals with optional rescue type filtering
 */
router.get('/', async (req, res) => {
    try {
        const animals = await animalController.getAnimals(req.query);
        res.status(200).json(animals);
    } catch (err) {
        console.error('Error in GET /api/animals:', err);
        res.status(500).json({ message: err.message });
    }
});

/**
 * @route   GET /api/animals/:id
 * @desc    Get a single animal by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const animal = await animalController.getAnimalById(req.params.id);
        res.status(200).json(animal);
    } catch (err) {
        console.error('Error in GET /api/animals/:id:', err);
        if (err.message === 'Invalid ID format' || err.message === 'Animal not found') {
            res.status(404).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'Server Error' });
        }
    }
});

/**
 * @route   GET /api/animals/stats/breed
 * @desc    Get breed statistics for visualization
 */
router.get('/stats/breed', async (req, res) => {
    try {
        const breedStats = await animalController.getBreedStats();
        res.status(200).json(breedStats);
    } catch (err) {
        console.error('Error in GET /api/animals/stats/breed:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

/**
 * @route   GET /api/animals/location/coordinates
 * @desc    Get animal locations for map visualization
 */
router.get('/location/coordinates', async (req, res) => {
    try {
        const locations = await animalController.getLocationData();
        res.status(200).json(locations);
    } catch (err) {
        console.error('Error in GET /api/animals/location/coordinates:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

/**
 * @route   GET /api/animals/stats/overview
 * @desc    Get comprehensive animal statistics
 */
router.get('/stats/overview', async (req, res) => {
    try {
        const stats = await animalController.getAnimalStats();
        res.status(200).json(stats);
    } catch (err) {
        console.error('Error in GET /api/animals/stats/overview:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// ============= WRITE Operations =============

/**
 * @route   POST /api/animals
 * @desc    Add a new animal
 */
router.post('/', async (req, res) => {
    try {
        const animal = await animalController.createAnimal(req.body);
        res.status(201).json(animal);
    } catch (err) {
        console.error('Error in POST /api/animals:', err);
        if (err.name === 'ValidationError') {
            res.status(400).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'Server Error' });
        }
    }
});

/**
 * @route   PUT /api/animals/:id
 * @desc    Update all fields of an animal
 */
router.put('/:id', async (req, res) => {
    try {
        const animal = await animalController.updateAnimal(req.params.id, req.body, false);
        res.status(200).json(animal);
    } catch (err) {
        console.error('Error in PUT /api/animals/:id:', err);
        if (err.message === 'Invalid ID format' || err.message === 'Animal not found') {
            res.status(404).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'Server Error' });
        }
    }
});

/**
 * @route   PATCH /api/animals/:id
 * @desc    Update specific fields of an animal
 */
router.patch('/:id', async (req, res) => {
    try {
        const animal = await animalController.updateAnimal(req.params.id, req.body, true);
        res.status(200).json(animal);
    } catch (err) {
        console.error('Error in PATCH /api/animals/:id:', err);
        if (err.message === 'Invalid ID format' || err.message === 'Animal not found') {
            res.status(404).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'Server Error' });
        }
    }
});

/**
 * @route   DELETE /api/animals/:id
 * @desc    Delete an animal
 */
router.delete('/:id', async (req, res) => {
    try {
        await animalController.deleteAnimal(req.params.id);
        res.status(200).json({ message: 'Animal removed' });
    } catch (err) {
        console.error('Error in DELETE /api/animals/:id:', err);
        if (err.message === 'Invalid ID format' || err.message === 'Animal not found') {
            res.status(404).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'Server Error' });
        }
    }
});

/**
 * @route   GET /api/animals/stats/overview
 * @desc    Get overview statistics for dashboard
 * @access  Public
 */
router.get('/stats/overview', async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [totalCount, dogCount, catCount, ageStats, adoptions, newArrivals] = await Promise.all([
            Animal.countDocuments({}),
            Animal.countDocuments({ animal_type: /^dog$/i }),
            Animal.countDocuments({ animal_type: /^cat$/i }),
            Animal.aggregate([
                {
                    $group: {
                        _id: null,
                        avgAge: { $avg: '$age_upon_outcome_in_weeks' }
                    }
                }
            ]),
            Animal.countDocuments({
                datetime: { $gte: thirtyDaysAgo },
                outcome_type: /^adoption$/i
            }),
            Animal.countDocuments({
                datetime: { $gte: thirtyDaysAgo }
            })
        ]);

        res.status(200).json({
            total: totalCount,
            dogs: dogCount,
            cats: catCount,
            avgAge: ageStats[0]?.avgAge ? (ageStats[0].avgAge / 52) : 0, // Convert weeks to years
            adoptionsLastMonth: adoptions,
            newArrivalsLastMonth: newArrivals
        });
    } catch (err) {
        console.error('Error in GET /api/animals/stats/overview:', err);
        res.status(500).json({ message: 'Server Error' });
    }
});

export default router;