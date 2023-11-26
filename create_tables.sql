-- Create Database
CREATE DATABASE IF NOT EXISTS RailwaySystem;
USE RailwaySystem;

-- Create Stations Table
CREATE TABLE Stations (
    StationID INT PRIMARY KEY,
    StationName VARCHAR(255) NOT NULL,
    Location VARCHAR(255) NOT NULL
);

-- Create Trains Table
CREATE TABLE Trains (
    TrainID INT PRIMARY KEY,
    TrainName VARCHAR(255) NOT NULL,
    Capacity INT NOT NULL
);

-- Create Routes Table
CREATE TABLE Routes (
    RouteID INT PRIMARY KEY,
    SourceStationID INT,
    IntermediateStationID INT,
    DestinationStationID INT,
    FOREIGN KEY (SourceStationID) REFERENCES Stations(StationID),
    FOREIGN KEY (IntermediateStationID) REFERENCES Stations(StationID),
    FOREIGN KEY (DestinationStationID) REFERENCES Stations(StationID)
);

-- Create Schedules Table
CREATE TABLE Schedules (
    ScheduleID INT PRIMARY KEY,
    TrainID INT,
    RouteID INT,
    DepartureTime DATETIME,
    ArrivalTime DATETIME,
    FOREIGN KEY (TrainID) REFERENCES Trains(TrainID),
    FOREIGN KEY (RouteID) REFERENCES Routes(RouteID)
);

-- Create TrainStaff Table
CREATE TABLE TrainStaff (
    StaffID INT PRIMARY KEY,
    TrainID INT,
    StaffName VARCHAR(255) NOT NULL,
    Role VARCHAR(255),
    FOREIGN KEY (TrainID) REFERENCES Trains(TrainID)
);

