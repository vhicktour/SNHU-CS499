#!/bin/bash

# Create temporary backup of current project
echo "Creating backup of current project..."
mkdir ../grazioso-salvare-backup
cp -r * ../grazioso-salvare-backup/

# Create new directory structure
echo "Creating new MERN project structure..."

# Client setup
mkdir -p client/public/assets
mkdir -p client/src/components
mkdir -p client/src/pages
mkdir -p client/src/services

# Server setup
mkdir -p server/config
mkdir -p server/models
mkdir -p server/routes
mkdir -p server/services

# Move existing assets
echo "Moving existing assets..."
mv assets/grazioso-logo.png client/public/assets/
mv data ./

# Initialize npm projects
echo "Initializing npm projects..."

# Client initialization
cd client
npm init -y
npm install react react-dom react-router-dom @mui/material @mui/icons-material axios
npm install --save-dev @babel/core @babel/preset-react @babel/preset-env
npm install --save-dev webpack webpack-cli webpack-dev-server babel-loader css-loader style-loader

# Update package.json scripts for client
sed -i '' 's/"test": "echo \\"Error: no test specified\\" && exit 1"/"start": "webpack serve --mode development",\
  "build": "webpack --mode production",\
  "test": "echo \\"Error: no test specified\\" && exit 1"/' package.json

# Create basic React files
echo "Creating basic React files..."
echo 'import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));' > src/index.js

echo 'import React from "react";

function App() {
  return (
    <div>
      <h1>Grazioso Salvare Dashboard</h1>
    </div>
  );
}

export default App;' > src/App.js

echo '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grazioso Salvare Dashboard</title>
</head>
<body>
    <div id="root"></div>
    <script src="bundle.js"></script>
</body>
</html>' > public/index.html

# Server initialization
cd ../server
npm init -y
npm install express mongoose cors dotenv morgan
npm install --save-dev nodemon

# Update package.json scripts for server
sed -i '' 's/"test": "echo \\"Error: no test specified\\" && exit 1"/"start": "node app.js",\
  "dev": "nodemon app.js",\
  "test": "echo \\"Error: no test specified\\" && exit 1"/' package.json

# Create basic Express server file
echo "Creating basic Express server file..."
echo 'const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));' > app.js

# Create .env file
echo "Creating .env file..."
echo 'MONGODB_URI=your_mongodb_connection_string
PORT=5000' > .env

# Create .gitignore
cd ..
echo "Creating .gitignore..."
echo 'node_modules/
.env
.DS_Store
build/
dist/
venv/
**/__pycache__/' > .gitignore

echo "MERN project structure created successfully!"
echo "Next steps:"
echo "1. Update the MongoDB connection string in server/.env"
echo "2. cd into server and run 'npm install' then 'npm run dev'"
echo "3. cd into client and run 'npm install' then 'npm start'"