# Grazioso Salvare Animal Dashboard

## Project Overview
A full-stack MERN (MongoDB, Express.js, React, Node.js) application for Grazioso Salvare to track and analyze animal shelter data for rescue training potential. This application helps identify and categorize shelter animals based on their suitability for different types of rescue work.

## Features
- Interactive data filtering for different rescue types:
  - Water Rescue
  - Mountain/Wilderness Rescue
  - Disaster/Individual Tracking
- Real-time data visualization with charts and maps
- Searchable and sortable data tables
- Geolocation mapping for animal locations
- Breed distribution analytics

## Technology Stack
### Frontend
- React 18
- Material-UI for component styling
- Recharts for data visualization
- React-Leaflet for mapping
- Axios for API requests

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- RESTful API architecture

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/vhicktour/SNHU-CS499.git
cd grazioso-salvare-dashboard
```

### 2. Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your MongoDB connection string
# Example: MONGODB_URI=mongodb://localhost:27017/grazioso_db

# Start the server
npm run dev
```

### 3. Frontend Setup
```bash
# Navigate to client directory
cd ../client

# Install dependencies
npm install

# Start the development server
npm start
```

### 4. Import Initial Data
```bash
# In the server directory
node scripts/import-data.js
```

## Project Structure
```
grazioso-salvare-dashboard/
├── client/                     # Frontend React application
│   ├── public/
│   └── src/
│       ├── components/        # React components
│       ├── assets/           # Static assets
│       └── App.js
├── server/                    # Backend Node.js/Express application
│   ├── config/               # Configuration files
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── scripts/            # Data import scripts
│   └── app.js
└── data/                     # Sample data and resources
```

## API Endpoints

### Animals
- GET `/api/animals` - Get all animals (paginated)
- GET `/api/animals/rescue/:type` - Get animals by rescue type
- GET `/api/animals/stats/breeds` - Get breed distribution statistics

## Rescue Type Criteria

### Water Rescue
- Breed: Labrador, Chesapeake Bay Retriever, Newfoundland
- Sex: Intact Female
- Age: 26 weeks to 156 weeks

### Mountain/Wilderness Rescue
- Breed: German Shepherd, Malamute, Old English Sheepdog, Rottweiler, Siberian Husky
- Sex: Intact Male
- Age: 26 weeks to 156 weeks

### Disaster Rescue/Individual Tracking
- Breed: German Shepherd, Golden Retriever, Bloodhound, Rottweiler
- Sex: Intact Male
- Age: 20 weeks to 300 weeks

## Development

### Running Tests
```bash
# Frontend tests
cd client
npm test

# Backend tests
cd server
npm test
```

### Building for Production
```bash
# Build frontend
cd client
npm run build

# Start production server
cd ../server
npm start
```

## Deployment
The application can be deployed using various platforms:

### Server Deployment
- Deploy the Node.js backend to platforms like:
  - Heroku
  - AWS Elastic Beanstalk
  - Digital Ocean

### Client Deployment
- Deploy the React frontend to:
  - Netlify
  - Vercel
  - AWS S3

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments
- Original Python/Dash application developed for CS-499
- Data provided by Austin Animal Center
- Grazioso Salvare for the project requirements and specifications

## Support
For support, please open an issue in the GitHub repository or contact the development team.
