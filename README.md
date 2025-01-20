# Animal Rescue Management System (V3)

A comprehensive web application for managing animal rescue operations, built with React and Node.js. This version includes enhanced features for tracking, managing, and visualizing animal rescue data.

## 🚀 Features

### Dashboard
- Real-time statistics and metrics
- Interactive data visualization
- Quick access to key information
- Light/Dark mode support

### Map View
- Geographic visualization of rescue locations
- Interactive markers with animal details
- Clustering for multiple rescues in the same area

### Statistics
- Comprehensive analytics
- Breed distribution charts
- Rescue type breakdown
- Adoption rate tracking
- Age distribution visualization

### Smart Filtering
- Multi-criteria filtering system
- Dynamic breed selection based on animal type
- Age range slider
- Rescue type categorization
- Outcome status filtering

## 🛠 Technology Stack

### Frontend
- React.js
- Chakra UI for modern, accessible components
- React Router for navigation
- Axios for API communication
- Recharts for data visualization

### Backend
- Node.js
- Express.js
- MongoDB for data storage
- RESTful API architecture

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vhicktour/SNHU-CS499.git
   cd SNHU-CS499
   git checkout V3
   ```

2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. Set up environment variables:
   Create `.env` files in both frontend and backend directories with necessary configurations.

4. Start the application:
   ```bash
   # Start backend server
   cd backend
   npm start

   # Start frontend development server
   cd ../frontend
   npm start
   ```

## 🔑 Environment Variables

### Backend
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

### Frontend
```env
REACT_APP_API_URL=http://localhost:5000
```

## 📊 API Endpoints

### Animals
- `GET /api/animals` - Get all animals
- `GET /api/animals/stats/overview` - Get overview statistics
- `GET /api/animals/stats/breed` - Get breed statistics
- `GET /api/animals/stats/location` - Get location statistics

## 🎨 Features & Improvements in V3

1. **Enhanced UI/UX**
   - Modern, responsive design
   - Intuitive navigation
   - Improved accessibility
   - Dark mode support

2. **Advanced Filtering**
   - Dynamic breed filtering
   - Multi-criteria search
   - Real-time filter updates

3. **Optimized Performance**
   - Client-side filtering
   - Memoized components
   - Efficient data handling

4. **Improved Data Visualization**
   - Interactive charts
   - Real-time statistics
   - Geographic mapping

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- SNHU CS-499 Course
- Animal Rescue Community
- Open Source Contributors

## 📫 Contact

Victor Hickman - [@vhicktour](https://github.com/vhicktour)
