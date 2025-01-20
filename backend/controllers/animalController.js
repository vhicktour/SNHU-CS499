/**
 * Animal Controller
 * Handles business logic for animal-related operations
 * @module controllers/animalController
 */

import Animal from '../models/Animal.js';
import mongoose from 'mongoose';

// ============= Constants =============

/**
 * Rescue type breed filters configuration
 */
const RESCUE_TYPE_FILTERS = {
    Water: [
        { breed: /lab/i },
        { breed: /chesa/i },
        { breed: /newf/i },
    ],
    Mountain: [
        { breed: /german/i },
        { breed: /mala/i },
        { breed: /old english/i },
        { breed: /husk/i },
        { breed: /rott/i },
    ],
    Disaster: [
        { breed: /german/i },
        { breed: /golden/i },
        { breed: /blood/i },
        { breed: /dober/i },
        { breed: /rott/i },
    ],
};

/**
 * Rescue type specific requirements
 */
const RESCUE_TYPE_REQUIREMENTS = {
    Water: {
        sex: 'Intact Female',
        minAge: 26.0,
        maxAge: 156.0
    },
    Mountain: {
        sex: 'Intact Male',
        minAge: 26.0,
        maxAge: 156.0
    },
    Disaster: {
        sex: 'Intact Male',
        minAge: 20.0,
        maxAge: 300.0
    }
};

// ============= Helper Functions =============

/**
 * Validates MongoDB ObjectId
 * @param {string} id - ID to validate
 * @returns {boolean} True if valid, false otherwise
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Builds query based on rescue type
 * @param {string} type - Rescue type
 * @returns {Object} MongoDB query object
 */
const buildRescueTypeQuery = (type) => {
    if (!type || !RESCUE_TYPE_FILTERS[type]) return {};

    const requirements = RESCUE_TYPE_REQUIREMENTS[type];
    return {
        $or: RESCUE_TYPE_FILTERS[type],
        sex_upon_outcome: requirements.sex,
        age_upon_outcome_in_weeks: {
            $gte: requirements.minAge,
            $lte: requirements.maxAge
        }
    };
};

// ============= Controller Methods =============

/**
 * Get all animals with optional filtering
 * @param {Object} queryParams - Query parameters including type and limit
 * @returns {Promise<Array>} Array of animal documents
 */
export const getAnimals = async ({ type, limit = 10000 }) => {
    const query = buildRescueTypeQuery(type);
    return await Animal.find(query).limit(Number(limit));
};

/**
 * Get single animal by ID
 * @param {string} id - Animal's MongoDB ObjectId
 * @returns {Promise<Object>} Animal document
 * @throws {Error} If ID is invalid or animal not found
 */
export const getAnimalById = async (id) => {
    if (!isValidObjectId(id)) {
        throw new Error('Invalid ID format');
    }

    const animal = await Animal.findById(id);
    if (!animal) {
        throw new Error('Animal not found');
    }

    return animal;
};

/**
 * Get breed statistics
 * @returns {Promise<Array>} Array of breed statistics
 */
export const getBreedStats = async () => {
    return await Animal.aggregate([
        { $group: { _id: '$breed', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
};

/**
 * Get animal location data
 * @returns {Promise<Array>} Array of location data
 */
export const getLocationData = async () => {
    return await Animal.find(
        { location_lat: { $exists: true }, location_long: { $exists: true } }
    ).select('location_lat location_long name breed -_id');
};

/**
 * Create new animal
 * @param {Object} animalData - Animal data according to schema
 * @returns {Promise<Object>} Created animal document
 */
export const createAnimal = async (animalData) => {
    const newAnimal = new Animal(animalData);
    return await newAnimal.save();
};

/**
 * Update animal by ID
 * @param {string} id - Animal's MongoDB ObjectId
 * @param {Object} updateData - Data to update
 * @param {boolean} partial - If true, performs partial update (PATCH)
 * @returns {Promise<Object>} Updated animal document
 * @throws {Error} If ID is invalid or animal not found
 */
export const updateAnimal = async (id, updateData, partial = false) => {
    if (!isValidObjectId(id)) {
        throw new Error('Invalid ID format');
    }

    const options = {
        new: true,
        runValidators: true
    };

    const animal = await Animal.findByIdAndUpdate(
        id,
        { $set: updateData },
        options
    );

    if (!animal) {
        throw new Error('Animal not found');
    }

    return animal;
};

/**
 * Delete animal by ID
 * @param {string} id - Animal's MongoDB ObjectId
 * @returns {Promise<Object>} Deleted animal document
 * @throws {Error} If ID is invalid or animal not found
 */
export const deleteAnimal = async (id) => {
    if (!isValidObjectId(id)) {
        throw new Error('Invalid ID format');
    }

    const animal = await Animal.findByIdAndDelete(id);
    if (!animal) {
        throw new Error('Animal not found');
    }

    return animal;
};

/**
 * Get rescue-suitable animals
 * @param {string} rescueType - Type of rescue work
 * @returns {Promise<Array>} Array of suitable animals
 */
export const getRescueSuitableAnimals = async (rescueType) => {
    return await Animal.findRescueSuitable(rescueType);
};

/**
 * Get animal statistics
 * @returns {Promise<Object>} Statistics object
 */
export const getAnimalStats = async () => {
    const [totalCount, breedStats, rescueTypeStats] = await Promise.all([
        Animal.countDocuments(),
        Animal.aggregate([
            { $group: { _id: '$breed', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]),
        Animal.aggregate([
            {
                $addFields: {
                    rescueType: {
                        $cond: [
                            { $eq: ['$rescueType', 'Not Suitable'] },
                            'Not Suitable',
                            '$rescueType'
                        ]
                    }
                }
            },
            { $group: { _id: '$rescueType', count: { $sum: 1 } } }
        ])
    ]);

    return {
        totalAnimals: totalCount,
        topBreeds: breedStats,
        rescueTypeCounts: rescueTypeStats
    };
};