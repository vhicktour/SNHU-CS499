/**
 * Animal Schema Definition
 * Defines the data structure for animal records in the shelter system
 * @module models/Animal
 */

import mongoose from 'mongoose';

// ============= Constants =============

/**
 * Rescue type criteria configuration
 */
const RESCUE_CRITERIA = {
    Water: {
        sex: 'Intact Female',
        ageRange: { min: 26, max: 156 },
        breedPattern: /lab|chesa|newf/i
    },
    Mountain: {
        sex: 'Intact Male',
        ageRange: { min: 26, max: 156 },
        breedPattern: /german|mala|old english|husk|rott/i
    },
    Disaster: {
        sex: 'Intact Male',
        ageRange: { min: 20, max: 300 },
        breedPattern: /german|golden|blood|dober|rott/i
    }
};

/**
 * Valid sex upon outcome values
 */
const VALID_SEX_VALUES = [
    'Intact Male',
    'Intact Female',
    'Neutered Male',
    'Spayed Female',
    'Unknown'
];

// ============= Schema Definition =============

const AnimalSchema = new mongoose.Schema({
    // Basic Information
    name: {
        type: String,
        required: true,
        trim: true
    },
    animal_id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    animal_type: {
        type: String,
        required: true,
        trim: true
    },

    // Physical Characteristics
    breed: {
        type: String,
        required: true,
        trim: true
    },
    color: {
        type: String,
        required: true,
        trim: true
    },
    sex_upon_outcome: {
        type: String,
        required: true,
        enum: VALID_SEX_VALUES
    },

    // Age Information
    age_upon_outcome: {
        type: String,
        required: true
    },
    age_upon_outcome_in_weeks: {
        type: Number,
        required: true,
        min: 0
    },
    date_of_birth: {
        type: Date,
        required: true
    },

    // Outcome Information
    outcome_type: {
        type: String,
        required: true,
        trim: true
    },
    outcome_subtype: {
        type: String,
        default: null,
        trim: true
    },

    // Temporal Information
    datetime: {
        type: Date,
        required: true,
        default: Date.now
    },
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: true,
        min: 1900
    },

    // Location Information
    location_lat: {
        type: Number,
        min: -90,
        max: 90
    },
    location_long: {
        type: Number,
        min: -180,
        max: 180
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ============= Indexes =============

/**
 * Performance optimization indexes
 */
AnimalSchema.index({ animal_id: 1 }, { unique: true });
AnimalSchema.index({ breed: 1 });
AnimalSchema.index({ sex_upon_outcome: 1 });
AnimalSchema.index({ age_upon_outcome_in_weeks: 1 });

// ============= Virtuals =============

/**
 * Determines the rescue type suitability of an animal
 * @returns {string} 'Water', 'Mountain', 'Disaster', or 'Not Suitable'
 */
AnimalSchema.virtual('rescueType').get(function() {
    for (const [type, criteria] of Object.entries(RESCUE_CRITERIA)) {
        if (
            this.sex_upon_outcome === criteria.sex &&
            this.age_upon_outcome_in_weeks >= criteria.ageRange.min &&
            this.age_upon_outcome_in_weeks <= criteria.ageRange.max &&
            criteria.breedPattern.test(this.breed)
        ) {
            return type;
        }
    }
    return 'Not Suitable';
});

// ============= Instance Methods =============

/**
 * Checks if the animal is suitable for any type of rescue work
 * @returns {boolean} True if suitable for rescue, false otherwise
 */
AnimalSchema.methods.isSuitableForRescue = function() {
    return this.rescueType !== 'Not Suitable';
};

// ============= Static Methods =============

/**
 * Finds animals suitable for a specific type of rescue work
 * @param {string} rescueType - The type of rescue ('Water', 'Mountain', 'Disaster')
 * @returns {Promise<Array>} Promise resolving to array of matching animals
 */
AnimalSchema.statics.findRescueSuitable = function(rescueType) {
    const criteria = RESCUE_CRITERIA[rescueType];
    if (!criteria) return this.find({});

    return this.find({
        sex_upon_outcome: criteria.sex,
        age_upon_outcome_in_weeks: {
            $gte: criteria.ageRange.min,
            $lte: criteria.ageRange.max
        },
        breed: { $regex: criteria.breedPattern }
    });
};

// ============= Middleware =============

/**
 * Pre-save middleware to handle data normalization
 */
AnimalSchema.pre('save', function(next) {
    // Convert string dates to Date objects
    if (this.date_of_birth && typeof this.date_of_birth === 'string') {
        this.date_of_birth = new Date(this.date_of_birth);
    }

    if (this.datetime && typeof this.datetime === 'string') {
        this.datetime = new Date(this.datetime);
    }

    // Ensure strings are trimmed
    if (this.name) this.name = this.name.trim();
    if (this.breed) this.breed = this.breed.trim();
    if (this.color) this.color = this.color.trim();
    if (this.outcome_type) this.outcome_type = this.outcome_type.trim();
    if (this.outcome_subtype) this.outcome_subtype = this.outcome_subtype.trim();

    next();
});

/**
 * Create and export the Animal model
 * Uses 'shelter_outcomes' as the collection name
 */
const Animal = mongoose.model('Animal', AnimalSchema, 'shelter_outcomes');

export default Animal;