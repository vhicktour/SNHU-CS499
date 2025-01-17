const mongoose = require('mongoose');

const AnimalSchema = new mongoose.Schema({
  age_upon_outcome: String,
  age_upon_outcome_in_weeks: Number,
  animal_id: String,
  animal_type: String,
  breed: String,
  color: String,
  date_of_birth: Date,
  datetime: Date,
  location_lat: Number,
  location_long: Number,
  monthyear: String,
  name: String,
  outcome_subtype: String,
  outcome_type: String,
  sex_upon_outcome: String
}, {
  timestamps: true
});

// Indexes for better query performance
AnimalSchema.index({ breed: 1 });
AnimalSchema.index({ sex_upon_outcome: 1 });
AnimalSchema.index({ age_upon_outcome_in_weeks: 1 });

// Static methods for filtering rescue types
AnimalSchema.statics.getWaterRescue = function() {
  return this.find({
    $or: [
      { breed: { $regex: /lab/i } },
      { breed: { $regex: /chesa/i } },
      { breed: { $regex: /newf/i } }
    ],
    sex_upon_outcome: "Intact Female",
    age_upon_outcome_in_weeks: { $gte: 26.0, $lte: 156.0 }
  });
};

AnimalSchema.statics.getMountainRescue = function() {
  return this.find({
    $or: [
      { breed: { $regex: /german/i } },
      { breed: { $regex: /mala/i } },
      { breed: { $regex: /old english/i } },
      { breed: { $regex: /husk/i } },
      { breed: { $regex: /rott/i } }
    ],
    sex_upon_outcome: "Intact Male",
    age_upon_outcome_in_weeks: { $gte: 26.0, $lte: 156.0 }
  });
};

AnimalSchema.statics.getDisasterRescue = function() {
  return this.find({
    $or: [
      { breed: { $regex: /german/i } },
      { breed: { $regex: /golden/i } },
      { breed: { $regex: /blood/i } },
      { breed: { $regex: /dober/i } },
      { breed: { $regex: /rott/i } }
    ],
    sex_upon_outcome: "Intact Male",
    age_upon_outcome_in_weeks: { $gte: 20.0, $lte: 300.0 }
  });
};

module.exports = mongoose.model('Animal', AnimalSchema);