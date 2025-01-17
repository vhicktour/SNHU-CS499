const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Animal = require('../models/Animal');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cs499', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected, starting import...');
  importData();
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

async function importData() {
  try {
    // Clear existing data
    await Animal.deleteMany({});
    console.log('Cleared existing data');

    const results = [];
    const csvPath = path.join(__dirname, '../../data/aac_shelter_outcomes.csv');

    fs.createReadStream(csvPath)
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
          await Animal.insertMany(results);
          console.log(`Successfully imported ${results.length} records`);
          mongoose.connection.close();
        } catch (err) {
          console.error('Error importing data:', err);
        }
      });
  } catch (err) {
    console.error('Error in import process:', err);
  }
}