# Grazioso Salvare Dashboard (V2)

## Project Overview
This project is a modern web application dashboard for Grazioso Salvare, rebuilt using React and Node.js. It provides an interactive interface for managing and visualizing animal shelter data, with enhanced features for tracking animal locations and outcomes.

## New Features in V2
- **Complete Data Display**: All animal data fields are now visible and sortable in the table
- **Interactive Maps**: 
  - Clickable rows to display individual animal locations
  - Automatic map centering on selected animals
- **Enhanced UI**:
  - Centered logo placement
  - Improved breed distribution visualization
  - Better organized layout with responsive design
- **Location Data**:
  - Clear longitude and latitude display
  - Interactive map markers with animal details

## Installation
1. Clone the repository
2. Install dependencies for both client and server:
    ```sh
    # Install server dependencies
    cd server
    npm install

    # Install client dependencies
    cd ../client
    npm install
    ```
3. Start the development servers:
    ```sh
    # Start server (from server directory)
    npm start

    # Start client (from client directory)
    npm start
    ```

## Features
### Data Display
- Comprehensive table with all animal details:
  - ID and Name
  - Animal Type and Breed
  - Color and Sex
  - Age (both in weeks and human-readable format)
  - Outcome details
  - Location coordinates
  - Birth date and outcome dates

### Interactive Features
- Sortable columns
- Clickable rows for location display
- Real-time map updates
- Breed distribution chart
- Filter panel for different animal types

### Maps and Location
- OpenStreetMap integration
- Auto-centering on selected animals
- Popup details for each location
- Clear coordinate display

## Technology Stack
- **Frontend**:
  - React
  - Tailwind CSS
  - React-Leaflet for maps
  - Chart.js for visualizations
- **Backend**:
  - Node.js
  - Express
  - MongoDB

## Data Structure
The application handles the following data fields:
- `age_upon_outcome`: Age at outcome
- `animal_id`: Unique identifier
- `animal_type`: Type of animal
- `breed`: Animal breed
- `color`: Color/pattern
- `date_of_birth`: Birth date
- `datetime`: Outcome event timestamp
- `monthyear`: Month/year of outcome
- `name`: Animal name
- `outcome_subtype`: Detailed outcome
- `outcome_type`: General outcome
- `sex_upon_outcome`: Sex and reproductive status
- `location_lat`: Latitude
- `location_long`: Longitude
- `age_upon_outcome_in_weeks`: Age in weeks

## Authors
Victor Udeh

## License
Open source under the MIT License.
