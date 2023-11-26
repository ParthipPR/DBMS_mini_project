#!/bin/bash

# Install Node.js and npm
sudo apt update
sudo apt install -y nodejs npm

# Install required Node.js modules
npm install express mysql

# MySQL database credentials
DB_USER="Railway"
DB_PASSWORD="password"
DB_NAME="RailwaySystem"

# MySQL commands
MYSQL_CMD="sudo mysql"

# Create MySQL user and grant permissions
$MYSQL_CMD << EOF
CREATE USER '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON *.* TO '$DB_USER'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EOF

# Create MySQL database and switch to it
$MYSQL_CMD -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
$MYSQL_CMD -e "USE $DB_NAME;"

# Execute SQL script to create tables
$MYSQL_CMD $DB_NAME < create_tables.sql

# Create folder structure
mkdir -p project-root/public

# Create server.js
echo "// server.js

const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static('public'));

// Example route to fetch stations
app.get('/stations', (req, res) => {
  const query = 'SELECT * FROM Stations';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
});

// Example route to add a new station
app.post('/stations', (req, res) => {
  const { StationID, StationName, Location } = req.body;
  const query = 'INSERT INTO Stations (StationID, StationName, Location) VALUES (?, ?, ?)';

  db.query(query, [StationID, StationName, Location], (err) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ message: 'Station added successfully' });
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

" > project-root/server.js

# Create db.js
echo "// db.js

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: '$DB_USER',
  password: '$DB_PASSWORD',
  database: '$DB_NAME',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    throw err;
  }
  console.log('Connected to MySQL database');
});

module.exports = connection;
" > project-root/db.js

# Create public folder
mkdir -p project-root/public

# Create public/index.html
echo "<!-- public/index.html -->

<!DOCTYPE html>
<html lang=\"en\">
<head>
  <meta charset=\"UTF-8\">
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
  <link rel=\"stylesheet\" href=\"style.css\">
  <title>Railway System</title>
</head>
<body>
  <div class=\"container\">
    <h2>Stations</h2>

    <!-- Form to add a new station -->
    <form id=\"addStationForm\">
      <div class=\"form-group\">
        <label for=\"StationID\">Station ID:</label>
        <input type=\"text\" id=\"StationID\" name=\"StationID\" required>
      </div>
      <div class=\"form-group\">
        <label for=\"StationName\">Station Name:</label>
        <input type=\"text\" id=\"StationName\" name=\"StationName\" required>
      </div>
      <div class=\"form-group\">
        <label for=\"Location\">Location:</label>
        <input type=\"text\" id=\"Location\" name=\"Location\" required>
      </div>
      <button type=\"button\" onclick=\"addStation()\">Add Station</button>
    </form>

    <!-- Table to display stations -->
    <table id=\"stationsTable\">
      <thead>
        <tr>
          <th>Station ID</th>
          <th>Station Name</th>
          <th>Location</th>
        </tr>
      </thead>
      <tbody>
        <!-- Data will be populated dynamically using JavaScript -->
      </tbody>
    </table>
  </div>

  <script src=\"https://code.jquery.com/jquery-3.3.1.min.js\"></script>
  <script src=\"script.js\"></script>
</body>
</html>
" > project-root/public/index.html

# Create public/style.css
echo "/* public/style.css */

body {
  font-family: Arial, sans-serif;
}

.container {
  max-width: 600px;
  margin: 50px auto;
}

form {
  margin-bottom: 20px;
}

form .form-group {
  margin-bottom: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

table, th, td {
  border: 1px solid #ddd;
}

th, td {
  padding: 10px;
  text-align: left;
}
" > project-root/public/style.css

# Create public/script.js
echo "// public/script.js

\$(document).ready(function () {
  // Fetch stations on page load
  fetchStations();

  // Add station form submission
  \$('#addStationForm').submit(function (e) {
    e.preventDefault();
    addStation();
  });
});

function fetchStations() {
  // Fetch stations from the server
  \$.get('/stations', function (data) {
    populateStationsTable(data);
  });
}

function addStation() {
  // Collect form data
  const formData = {
    StationID: \$('#StationID').val(),
    StationName: \$('#StationName').val(),
    Location: \$('#Location').val(),
  };

  // Send data to the server
  \$.post('/stations', formData, function (data) {
    alert(data.message);
    fetchStations();  // Refresh the table after adding a station
  });
}

function populateStationsTable(stations) {
  // Clear existing table rows
  \$('#stationsTable tbody').empty();

  // Populate table with stations
  stations.forEach(function (station) {
    const row = \`<tr>
                    <td>\${station.StationID}</td>
                    <td>\${station.StationName}</td>
                    <td>\${station.Location}</td>
                </tr>\`;
    \$('#stationsTable tbody').append(row);
  });
}
" > project-root/public/script.js

# Display instructions
echo "Project structure created successfully! Follow these steps:

1. Change directory to project-root: cd project-root
2. Run the Node.js server: node server.js
3. Open your browser and go to http://localhost:3000/ to view the interface.
"

