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

// ============= Cache and Scoring =============

/**
 * Cache for storing rescue scores
 * Using Map for O(1) lookup performance
 * @type {Map<string, {score: number, timestamp: number}>}
 */
const rescueScoresCache = new Map();

/**
 * Cache TTL in milliseconds (5 minutes)
 */
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Scoring weights for different criteria
 */
const SCORING_WEIGHTS = {
    breedMatch: 0.35,
    ageMatch: 0.25,
    sexMatch: 0.20,
    healthScore: 0.20
};

/**
 * Calculate health score based on animal's medical history
 * @param {Object} animal - Animal document
 * @returns {number} Score between 0 and 1
 */
const calculateHealthScore = (animal) => {
    let score = 1.0;
    
    // Deduct points for health issues
    if (animal.medicalHistory) {
        if (animal.medicalHistory.includes('surgery')) score -= 0.2;
        if (animal.medicalHistory.includes('chronic')) score -= 0.3;
        if (animal.medicalHistory.includes('injury')) score -= 0.15;
    }
    
    // Ensure score stays between 0 and 1
    return Math.max(0, Math.min(1, score));
};

/**
 * Calculate breed match score
 * @param {string} breed - Animal breed
 * @param {string} rescueType - Type of rescue work
 * @returns {number} Score between 0 and 1
 */
const calculateBreedMatchScore = (breed, rescueType) => {
    const filters = RESCUE_TYPE_FILTERS[rescueType];
    if (!filters) return 0;

    // Check for exact matches first
    const exactMatch = filters.some(filter => 
        filter.breed.toString().slice(1, -2).toLowerCase() === breed.toLowerCase()
    );
    if (exactMatch) return 1;

    // Check for partial matches
    const partialMatch = filters.some(filter => 
        breed.toLowerCase().match(filter.breed)
    );
    return partialMatch ? 0.7 : 0;
};

/**
 * Calculate age match score
 * @param {number} age - Animal age in months
 * @param {Object} requirements - Rescue type requirements
 * @returns {number} Score between 0 and 1
 */
const calculateAgeMatchScore = (age, requirements) => {
    if (!requirements) return 0;
    const { minAge, maxAge } = requirements;
    
    // Perfect age range
    if (age >= minAge && age <= maxAge) return 1;
    
    // Calculate score based on distance from ideal range
    const distanceFromRange = age < minAge ? 
        minAge - age : 
        age - maxAge;
    
    // Score decreases linearly with distance from range
    return Math.max(0, 1 - (distanceFromRange / minAge));
};

/**
 * Calculate sex match score
 * @param {string} sex - Animal sex
 * @param {Object} requirements - Rescue type requirements
 * @returns {number} Score between 0 and 1
 */
const calculateSexMatchScore = (sex, requirements) => {
    if (!requirements || !requirements.sex) return 0;
    return sex === requirements.sex ? 1 : 0;
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
 * Get rescue-suitable animals with sophisticated scoring
 * @param {string} rescueType - Type of rescue work
 * @returns {Promise<Array>} Array of suitable animals with scores
 */
export const getRescueSuitableAnimals = async (rescueType) => {
    try {
        // Validate rescue type
        if (!RESCUE_TYPE_REQUIREMENTS[rescueType]) {
            throw new Error('Invalid rescue type');
        }

        // Get all potential animals
        const query = buildRescueTypeQuery(rescueType);
        const animals = await Animal.find(query);

        // Calculate and cache scores for each animal
        const scoredAnimals = await Promise.all(animals.map(async (animal) => {
            // Check cache first
            const cacheKey = `${animal._id}-${rescueType}`;
            const cachedScore = rescueScoresCache.get(cacheKey);
            
            if (cachedScore && (Date.now() - cachedScore.timestamp) < CACHE_TTL) {
                return {
                    ...animal.toObject(),
                    rescueScore: cachedScore.score
                };
            }

            // Calculate individual scores
            const breedScore = calculateBreedMatchScore(animal.breed, rescueType);
            const ageScore = calculateAgeMatchScore(animal.age, RESCUE_TYPE_REQUIREMENTS[rescueType]);
            const sexScore = calculateSexMatchScore(animal.sex, RESCUE_TYPE_REQUIREMENTS[rescueType]);
            const healthScore = calculateHealthScore(animal);

            // Calculate weighted total score
            const totalScore = (
                breedScore * SCORING_WEIGHTS.breedMatch +
                ageScore * SCORING_WEIGHTS.ageMatch +
                sexScore * SCORING_WEIGHTS.sexMatch +
                healthScore * SCORING_WEIGHTS.healthScore
            );

            // Cache the score
            rescueScoresCache.set(cacheKey, {
                score: totalScore,
                timestamp: Date.now()
            });

            // Return animal with score
            return {
                ...animal.toObject(),
                rescueScore: totalScore,
                scoreDetails: {
                    breedScore,
                    ageScore,
                    sexScore,
                    healthScore
                }
            };
        }));

        // Sort by score and filter out low-scoring animals
        return scoredAnimals
            .filter(animal => animal.rescueScore >= 0.6) // Only return animals with decent scores
            .sort((a, b) => b.rescueScore - a.rescueScore);
    } catch (error) {
        console.error('Error in getRescueSuitableAnimals:', error);
        throw error;
    }
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