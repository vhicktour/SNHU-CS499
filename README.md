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