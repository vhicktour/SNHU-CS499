# Animal Rescue Management System

## Overview
A comprehensive web application for managing animal rescue operations. This platform helps rescue organizations track, manage, and visualize their rescue operations efficiently.

## Key Features

### Dashboard
- Real-time statistics and metrics
- Interactive data visualization
- Dark/Light mode support
- Lottie animations for enhanced user experience
- Responsive design for all devices

### Statistics
- Track rescue operations by type:
  - Water Rescue
  - Mountain Rescue
  - Disaster Rescue
- View success rates and trends
- Monitor rescue outcomes
- Export capabilities

### Smart Filtering
- Multi-criteria search system
- Dynamic breed selection
- Age range filtering
- Status tracking

### Advanced Rescue Matching System
- Sophisticated scoring algorithm for optimal animal-rescue pairing
- Multi-factor analysis including:
  - Breed compatibility (35%)
  - Age appropriateness (25%)
  - Sex requirements (20%)
  - Health assessment (20%)
- Performance optimized with caching and database indexing
- Detailed scoring breakdown for transparency
- Automatic filtering of unsuitable matches

### Animal Health Tracking
- Comprehensive medical history tracking
- Training progress monitoring
- Assessment history
- Real-time status updates
- Geolocation support for rescue operations

## Tech Stack

### Frontend
- React.js
- Chakra UI for modern, accessible components
- Lottie for animations
- React Router for navigation
- Axios for API communication

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/vhicktour/SNHU-CS499.git
cd SNHU-CS499
```

2. Install dependencies:
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

3. Start the development servers:
```bash
# Frontend
cd frontend
npm start

# Backend
cd backend
npm start
```

## Environment Setup
Create `.env` files in both frontend and backend directories:

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

## Build and Deployment

This project consists of two main parts: a React frontend and a Node.js/Express backend. Here's how to build and run the application:

### Development Mode

1. Start the Frontend Development Server:
```bash
cd frontend
npm install
npm start
```
The frontend will run on http://localhost:3000

2. Start the Backend Server (in a new terminal):
```bash
cd backend
npm install
npm start
```
The backend will run on http://localhost:5000

### Production Mode

1. Build the Frontend:
```bash
cd frontend
npm install
npm run build
```
This will create a production build in the `frontend/build` directory.

2. Start the Production Server:
```bash
cd backend
npm install
npm start
```
The application will be available at http://localhost:5000

### Environment Variables

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
```

#### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

### Deployment Tips

1. Make sure all dependencies are installed in both frontend and backend:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. For production deployment:
   - Build the frontend first
   - The backend will serve the static files from the frontend build
   - Set environment variables according to your production setup

3. Common issues:
   - Ensure MongoDB is running and accessible
   - Check if all environment variables are properly set
   - Verify the API URL in frontend matches your backend URL

## API Endpoints

### Animals
- GET /api/animals - Fetch all animals
- GET /api/animals/stats - Get statistics
- GET /api/animals/rescue/:type - Get rescue-suitable animals with scores
- POST /api/animals - Add new animal
- PUT /api/animals/:id - Update animal
- DELETE /api/animals/:id - Remove animal

### Rescue Matching
- GET /api/animals/rescue/suitable/:type - Get scored animals for specific rescue type
- GET /api/animals/rescue/stats - Get rescue matching statistics
- GET /api/animals/rescue/history - Get historical rescue matching data

## Technical Features

### Performance Optimizations
- In-memory caching with 5-minute TTL
- Strategic database indexing
  - Single-field indexes for common queries
  - Compound indexes for complex queries
  - Geospatial indexing for location-based searches
- Asynchronous score calculations
- Efficient data structures for quick lookups

### Data Models

#### Animal Schema
```javascript
{
  // Basic Information
  name: String,
  breed: String,
  age: Number,
  sex: String,
  
  // Health and Training
  medicalHistory: [String],
  trainingProgress: Map,
  lastAssessment: {
    date: Date,
    score: Number,
    assessor: String,
    notes: String
  },
  
  // Rescue Status
  status: String,
  location: {
    type: String,
    coordinates: [Number]
  }
}
```

## Contact

Victor Udeh
- GitHub: [@vhicktour](https://github.com/vhicktour)
- LinkedIn: [Victor Udeh](https://www.linkedin.com/in/victorudeh/)