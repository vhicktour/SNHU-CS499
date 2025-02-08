/**
 * Animal Controller - Core Business Logic Handler
 * 
 * Manages all animal-related operations including CRUD, scoring, and analytics
 * Implements rescue suitability algorithms with caching and performance optimizations
 * 
 * @module controllers/animalController
 */

import Animal from '../models/Animal.js';
import mongoose from 'mongoose';

// Constants for rescue configuration
const RESCUE_CONFIG = {
  Water: {
    breeds: [/lab/i, /chesa/i, /newf/i],
    sex: 'Intact Female',
    ageRange: [26.0, 156.0]
  },
  Mountain: {
    breeds: [/german/i, /mala/i, /old english/i, /husk/i, /rott/i],
    sex: 'Intact Male',
    ageRange: [26.0, 156.0]
  },
  Disaster: {
    breeds: [/german/i, /golden/i, /blood/i, /dober/i, /rott/i],
    sex: 'Intact Male',
    ageRange: [20.0, 300.0]
  }
};

const SCORING_WEIGHTS = {
  breedMatch: 0.35,
  ageMatch: 0.25,
  sexMatch: 0.20,
  healthScore: 0.20
};

const CACHE_CONFIG = {
  TTL: 300000, // 5 minutes in milliseconds
  MIN_SCORE: 0.6
};

// Error Classes
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
  }
}

class NotFoundError extends Error {
  constructor(resource) {
    super(`${resource} not found`);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

class ScoringError extends Error {
  constructor(message) {
    super(`Scoring error: ${message}`);
    this.name = 'ScoringError';
    this.statusCode = 500;
  }
}

// Cache Instance with TTL cleanup
const scoreCache = new Map();
setInterval(() => cleanupCache(), CACHE_CONFIG.TTL);

/**
 * Cache Maintenance - Removes expired entries
 */
const cleanupCache = () => {
  const now = Date.now();
  for (const [key, value] of scoreCache.entries()) {
    if (now - value.timestamp > CACHE_CONFIG.TTL) {
      scoreCache.delete(key);
    }
  }
};

/**
 * Validates MongoDB ObjectID format
 * @param {string} id - ID to validate
 * @throws {ValidationError} For invalid ID format
 */
const validateObjectId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ValidationError('Invalid resource identifier');
  }
};

/**
 * Constructs rescue-specific query parameters
 * @param {string} rescueType - One of: Water, Mountain, Disaster
 * @returns {Object} MongoDB query object
 * @throws {ValidationError} For invalid rescue types
 */
const buildRescueQuery = (rescueType) => {
  const config = RESCUE_CONFIG[rescueType];
  if (!config) {
    throw new ValidationError(`Invalid rescue type: ${rescueType}`);
  }

  return {
    $or: config.breeds.map(breed => ({ breed: { $regex: breed } })),
    sex_upon_outcome: config.sex,
    age_upon_outcome_in_weeks: {
      $gte: config.ageRange[0],
      $lte: config.ageRange[1]
    }
  };
};

/**
 * Health Scoring Algorithm
 * @param {string[]} medicalHistory - Animal's medical records
 * @returns {number} Normalized health score 0-1
 */
const calculateHealthScore = (medicalHistory = []) => {
  const deductions = {
    surgery: 0.2,
    chronic: 0.3,
    injury: 0.15
  };

  const totalDeduction = medicalHistory.reduce(
    (sum, condition) => sum + (deductions[condition] || 0),
    0
  );

  return Math.max(0, 1 - totalDeduction);
};

/**
 * Breed Match Scoring Logic
 * @param {string} breed - Animal breed
 * @param {RegExp[]} breedPatterns - Rescue-specific patterns
 * @returns {number} Match score 0-1
 */
const calculateBreedMatch = (breed, breedPatterns) => {
  const cleanBreed = breed.toLowerCase().trim();
  
  // Exact match check
  const exactMatch = breedPatterns.some(pattern => 
    pattern.test(cleanBreed) && 
    cleanBreed === pattern.toString().slice(1, -2)
  );

  if (exactMatch) return 1;

  // Partial match check
  return breedPatterns.some(pattern => pattern.test(cleanBreed)) ? 0.7 : 0;
};

/**
 * Age Match Scoring Algorithm
 * @param {number} age - Animal age in weeks
 * @param {number[]} idealRange - [min, max] age range
 * @returns {number} Normalized age score 0-1
 */
const calculateAgeMatch = (age, [min, max]) => {
  if (age >= min && age <= max) return 1;
  
  const distance = age < min ? min - age : age - max;
  return Math.max(0, 1 - (distance / min));
};

/**
 * Composite Scoring System
 * @param {Object} animal - Animal document
 * @param {string} rescueType - Rescue operation type
 * @returns {Object} Scoring results
 */
const calculateRescueScore = (animal, rescueType) => {
  try {
    const config = RESCUE_CONFIG[rescueType];
    
    return {
      breed: calculateBreedMatch(animal.breed, config.breeds),
      age: calculateAgeMatch(animal.age_upon_outcome_in_weeks, config.ageRange),
      sex: animal.sex_upon_outcome === config.sex ? 1 : 0,
      health: calculateHealthScore(animal.medicalHistory)
    };
  } catch (error) {
    throw new ScoringError(`Failed to calculate scores: ${error.message}`);
  }
};

// Core Controller Methods

export const getAnimals = async ({ type, limit = 10000 }) => {
  const query = type ? buildRescueQuery(type) : {};
  return Animal.find(query).limit(Math.min(Number(limit), 10000));
};

export const getAnimalById = async (id) => {
  validateObjectId(id);
  const animal = await Animal.findById(id);
  if (!animal) throw new NotFoundError('Animal');
  return animal;
};

export const createAnimal = async (data) => {
  const animal = new Animal(data);
  await animal.validate();
  return animal.save();
};

export const updateAnimal = async (id, updates) => {
  validateObjectId(id);
  const options = { new: true, runValidators: true };
  const animal = await Animal.findByIdAndUpdate(id, updates, options);
  if (!animal) throw new NotFoundError('Animal');
  return animal;
};

export const deleteAnimal = async (id) => {
  validateObjectId(id);
  const animal = await Animal.findByIdAndDelete(id);
  if (!animal) throw new NotFoundError('Animal');
  return animal;
};

export const getRescueCandidates = async (rescueType) => {
  const query = buildRescueQuery(rescueType);
  const animals = await Animal.find(query);
  const now = Date.now();

  const scoredAnimals = await Promise.all(
    animals.map(async animal => {
      const cacheKey = `${animal._id}-${rescueType}`;
      const cached = scoreCache.get(cacheKey);

      if (cached && (now - cached.timestamp < CACHE_CONFIG.TTL)) {
        return { ...animal.toObject(), ...cached };
      }

      const scores = calculateRescueScore(animal, rescueType);
      const weightedScore = Object.entries(scores).reduce(
        (total, [key, value]) => total + (value * SCORING_WEIGHTS[`${key}Match`]),
        0
      );

      const result = {
        ...animal.toObject(),
        rescueScore: weightedScore,
        scoreComponents: scores,
        timestamp: now
      };

      scoreCache.set(cacheKey, result);
      return result;
    })
  );

  return scoredAnimals
    .filter(animal => animal.rescueScore >= CACHE_CONFIG.MIN_SCORE)
    .sort((a, b) => b.rescueScore - a.rescueScore);
};

export const getAnimalAnalytics = async () => {
  const [total, breeds, rescues] = await Promise.all([
    Animal.countDocuments(),
    Animal.aggregate([
      { $group: { _id: '$breed', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]),
    Animal.aggregate([
      { $project: { 
        rescueType: { 
          $cond: [
            { $eq: ['$rescueType', 'Not Suitable'] }, 
            'Not Suitable', 
            '$rescueType' 
          ] 
        } 
      }},
      { $group: { _id: '$rescueType', count: { $sum: 1 } } }
    ])
  ]);

  return {
    totalAnimals: total,
    topBreeds: breeds,
    rescueDistribution: rescues
  };
};