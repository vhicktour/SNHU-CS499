const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');
require('dotenv').config();

const Animal = require('../models/Animal');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cs499', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const results = [];

fs.createReadStream('../../data/aac_shelter_outcomes.csv')
  .pipe(csv())
  .on('data', (data) => {
    // Convert string dates to Date objects
    if (data.datetime) {
      data.datetime = new Date(data.datetime);
    }
    if (data.date_of_birth) {
      data.date_of_birth = new Date(data.date_of_birth);
    }
    
    // Convert string numbers to actual numbers
    if (data.age_upon_outcome_in_weeks) {
      data.age_upon_outcome_in_weeks = parseFloat(data.age_upon_outcome_in_weeks);
    }
    if (data.location_lat) {
      data.location_lat = parseFloat(data.location_lat);
    }
    if (data.location_long) {
      data.location_long = parseFloat(data.location_long);
    }
    
    results.push(data);
  })
  .on('end', async () => {
    try {
      // Clear existing data
      await Animal.deleteMany({});
      console.log('Existing data cleared');
      
      // Insert new data
      await Animal.insertMany(results);
      console.log(`${results.length} records imported successfully`);
      
      // Create indexes
      await Animal.createIndexes();
      console.log('Indexes created');
      
      mongoose.connection.close();
    } catch (error) {
      console.error('Error importing data:', error);
      mongoose.connection.close();
    }
  });