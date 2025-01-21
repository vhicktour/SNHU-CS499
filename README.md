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
- POST /api/animals - Add new animal
- PUT /api/animals/:id - Update animal
- DELETE /api/animals/:id - Remove animal

## Contact

Victor Udeh
- GitHub: [@vhicktour](https://github.com/vhicktour)
- LinkedIn: [Victor Udeh](https://www.linkedin.com/in/victorudeh/)