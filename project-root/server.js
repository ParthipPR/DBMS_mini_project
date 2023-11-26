// server.js

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

// Example route to delete a station by StationID
app.delete('/stations/:id', (req, res) => {
  const stationId = req.params.id;
  const query = 'DELETE FROM Stations WHERE StationID = ?';

  db.query(query, [stationId], (err, result) => {
    if (err) {
      console.error('Error executing DELETE query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Station not found' });
    } else {
      res.json({ message: 'Station deleted successfully' });
    }
  });
});

// Example route to update a station by StationID
app.put('/stations/:id', (req, res) => {
  const stationId = req.params.id;
  const { StationName, Location } = req.body;
  const query = 'UPDATE Stations SET StationName = ?, Location = ? WHERE StationID = ?';

  db.query(query, [StationName, Location, stationId], (err, result) => {
    if (err) {
      console.error('Error executing UPDATE query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Station not found' });
    } else {
      res.json({ message: 'Station updated successfully' });
    }
  });
});


// Example route to fetch trains
app.get('/trains', (req, res) => {
  const query = 'SELECT * FROM Trains';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
});

// Example route to add a new train
app.post('/trains', (req, res) => {
  const { TrainID, TrainName, Capacity } = req.body;
  const query = 'INSERT INTO Trains (TrainID, TrainName, Capacity) VALUES (?, ?, ?)';

  db.query(query, [TrainID, TrainName, Capacity], (err) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ message: 'Train added successfully' });
  });
});

// Example route to delete a train by TrainID
app.delete('/trains/:id', (req, res) => {
  const trainId = req.params.id;
  const query = 'DELETE FROM Trains WHERE TrainID = ?';

  db.query(query, [trainId], (err, result) => {
    if (err) {
      console.error('Error executing DELETE query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Train not found' });
    } else {
      res.json({ message: 'Train deleted successfully' });
    }
  });
});

// Example route to update a train by TrainID
app.put('/trains/:id', (req, res) => {
  const trainId = req.params.id;
  const { TrainName, Capacity } = req.body;
  const query = 'UPDATE Trains SET TrainName = ?, Capacity = ? WHERE TrainID = ?';

  db.query(query, [TrainName, Capacity, trainId], (err, result) => {
    if (err) {
      console.error('Error executing UPDATE query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Train not found' });
    } else {
      res.json({ message: 'Train updated successfully' });
    }
  });
});

// Example route to fetch routes
app.get('/routes', (req, res) => {
  const query = 'SELECT * FROM Routes';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
});
// Example route to get details of a specific route by RouteID
app.get('/routes/:id', (req, res) => {
  const routeId = req.params.id;
  const query = 'SELECT * FROM Routes WHERE RouteID = ?';

  db.query(query, [routeId], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ error: 'Route not found' });
    } else {
      res.json(results[0]);
    }
  });
});


// Add this route to handle the creation of routes
app.post('/routes', (req, res) => {
  const { RouteID, SourceStationID, IntermediateStationID, DestinationStationID } = req.body;
  const query = 'INSERT INTO Routes (RouteID, SourceStationID, IntermediateStationID, DestinationStationID) VALUES (?, ?, ?, ?)';

  db.query(query, [RouteID, SourceStationID, IntermediateStationID, DestinationStationID], (err) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ message: 'Route added successfully' });
  });
});


// Example route to delete a route by RouteID
app.delete('/routes/:id', (req, res) => {
  const routeId = req.params.id;
  const query = 'DELETE FROM Routes WHERE RouteID = ?';

  db.query(query, [routeId], (err, result) => {
    if (err) {
      console.error('Error executing DELETE query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Route not found' });
    } else {
      res.json({ message: 'Route deleted successfully' });
    }
  });
});

// Example route to update a route by RouteID
app.put('/routes/:id', (req, res) => {
  const routeId = req.params.id;
  const { SourceStationID, IntermediateStationID, DestinationStationID } = req.body;
  const query = 'UPDATE Routes SET SourceStationID = ?, IntermediateStationID = ?, DestinationStationID = ? WHERE RouteID = ?';

  db.query(query, [SourceStationID, IntermediateStationID, DestinationStationID, routeId], (err, result) => {
    if (err) {
      console.error('Error executing UPDATE query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Route not found' });
    } else {
      res.json({ message: 'Route updated successfully' });
    }
  });
});

// Example route to fetch schedules
app.get('/schedules', (req, res) => {
  const query = 'SELECT * FROM Schedules';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
});

// Example route to add a new schedule
app.post('/schedules', (req, res) => {
  const { ScheduleID, TrainID, RouteID, DepartureTime, ArrivalTime } = req.body;
  const query = 'INSERT INTO Schedules (ScheduleID, TrainID, RouteID, DepartureTime, ArrivalTime) VALUES (?, ?, ?, ?, ?)';

  db.query(query, [ScheduleID, TrainID, RouteID, DepartureTime, ArrivalTime], (err) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ message: 'Schedule added successfully' });
  });
});

// Example route to delete a schedule by ScheduleID
app.delete('/schedules/:id', (req, res) => {
  const scheduleId = req.params.id;
  const query = 'DELETE FROM Schedules WHERE ScheduleID = ?';

  db.query(query, [scheduleId], (err, result) => {
    if (err) {
      console.error('Error executing DELETE query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Schedule not found' });
    } else {
      res.json({ message: 'Schedule deleted successfully' });
    }
  });
});

// Example route to update a schedule by ScheduleID
app.put('/schedules/:id', (req, res) => {
  const scheduleId = req.params.id;
  const { TrainID, RouteID, DepartureTime, ArrivalTime } = req.body;
  const query = 'UPDATE Schedules SET TrainID = ?, RouteID = ?, DepartureTime = ?, ArrivalTime = ? WHERE ScheduleID = ?';

  db.query(query, [TrainID, RouteID, DepartureTime, ArrivalTime, scheduleId], (err, result) => {
    if (err) {
      console.error('Error executing UPDATE query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Schedule not found' });
    } else {
      res.json({ message: 'Schedule updated successfully' });
    }
  });
});

// Example route to fetch train staff
app.get('/trainstaff', (req, res) => {
  const query = 'SELECT * FROM TrainStaff';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json(results);
  });
});

// Example route to add a new train staff
app.post('/trainstaff', (req, res) => {
  const { StaffID, TrainID, StaffName, Role } = req.body;
  const query = 'INSERT INTO TrainStaff (StaffID, TrainID, StaffName, Role) VALUES (?, ?, ?, ?)';

  db.query(query, [StaffID, TrainID, StaffName, Role], (err) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    res.json({ message: 'Train staff added successfully' });
  });
});

// Example route to delete train staff by StaffID
app.delete('/trainstaff/:id', (req, res) => {
  const staffId = req.params.id;
  const query = 'DELETE FROM TrainStaff WHERE StaffID = ?';

  db.query(query, [staffId], (err, result) => {
    if (err) { 
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Train staff not found' });
    } else {
      res.json({ message: 'Train staff deleted successfully' });
    }
  });
});

// Example route to update train staff by StaffID
app.put('/trainstaff/:id', (req, res) => {
  const staffId = req.params.id;
  const { TrainID, StaffName, Role } = req.body;
  const query = 'UPDATE TrainStaff SET TrainID = ?, StaffName = ?, Role = ? WHERE StaffID = ?';

  db.query(query, [TrainID, StaffName, Role, staffId], (err, result) => {
    if (err) {
      console.error('Error executing UPDATE query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Train staff not found' });
    } else {
      res.json({ message: 'Train staff updated successfully' });
    }
  });
});




app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

