// public/script.js

$(document).ready(function () {
  // Fetch stations and trains on page load
  fetchStations();
  fetchTrains();
  fetchDropStations();
  fetchRoutes(); 

  // Add station form submission
  $('#addStationForm').submit(function (e) {
    e.preventDefault();
    addStation();
  });

  // Add train form submission
  $('#addTrainForm').submit(function (e) {
    e.preventDefault();
    addTrain();
  });
});

function fetchStations() {
  // Fetch stations from the server
  $.get('/stations', function (data) {
    populateStationsTable(data);
  });
}

function fetchTrains() {
  // Fetch trains from the server
  $.get('/trains', function (data) {
    populateTrainsTable(data);
  });
}

function addStation() {
  // Collect form data
  const formData = {
    StationID: $('#StationID').val(),
    StationName: $('#StationName').val(),
    Location: $('#Location').val(),
  };

  // Send data to the server
  $.post('/stations', formData, function (data) {
    alert(data.message);
    // Clear the form after successful addition
    $('#addStationForm')[0].reset();
    fetchStations();  // Refresh the station table after adding a station
    fetchDropStations();
  });
}

function addTrain() {
  // Collect form data
  const formData = {
    TrainID: $('#TrainID').val(),
    TrainName: $('#TrainName').val(),
    Capacity: $('#Capacity').val(),
  };

  // Send data to the server
  $.post('/trains', formData, function (data) {
    alert(data.message);
    // Clear the form after successful addition
    $('#addTrainForm')[0].reset();
    fetchTrains();  // Refresh the train table after adding a train
  });
}

// Function to delete a station
function deleteStation(stationId) {
  if (confirm('Are you sure you want to delete this station?')) {
    $.ajax({
      url: `/stations/${stationId}`,
      method: 'DELETE',
      success: function (data) {
        fetchStations();  // Refresh the station table after deleting a station
      },
      error: function (error) {
        console.error('Error deleting station:', error);
        alert('Error deleting station');
      },
    });
  }
}

// Function to delete a train
function deleteTrain(trainId) {
  if (confirm('Are you sure you want to delete this train?')) {
    $.ajax({
      url: `/trains/${trainId}`,
      method: 'DELETE',
      success: function (data) {
        fetchTrains();  // Refresh the train table after deleting a train
      },
      error: function (error) {
        console.error('Error deleting train:', error);
        alert('Error deleting train');
      },
    });
  }
}

function updateStation(stationId) {
  // Create a form with input fields for updated information
  const form = $('<form></form>');
  form.append('<label for="updatedStationName">Updated Station Name:</label>');
  form.append('<input type="text" id="updatedStationName" name="updatedStationName" required>');
  form.append('<label for="updatedLocation">Updated Location:</label>');
  form.append('<input type="text" id="updatedLocation" name="updatedLocation" required>');

  // Show a dialog with the form
  const dialog = $('<div></div>').append(form);
  $('body').append(dialog);  // Append the dialog to the body

  dialog.dialog({
    title: 'Update Station',
    modal: true,
    buttons: {
      'Update': function () {
        // Collect updated information from the form
        const updatedData = {
          StationName: $('#updatedStationName').val(),
          Location: $('#updatedLocation').val(),
        };

        // Send data to the server
        $.ajax({
          url: `/stations/${stationId}`,
          method: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify(updatedData),
          success: function (data) {
            console.log('Station updated successfully:', data);
            alert(data.message);
            fetchStations();  // Refresh the station table after updating a station
          },
          error: function (xhr, status, error) {
            console.error('Error updating station:', error);
            alert('Error updating station. Check the console for details.');
          },
        });

        // Close the dialog
        $(this).dialog('close');
        dialog.remove();  // Remove the dialog from the DOM
      },
      'Cancel': function () {
        // Close the dialog without updating
        $(this).dialog('close');
        dialog.remove();  // Remove the dialog from the DOM
      }
    },
    close: function () {
      // Remove the dialog from the DOM
      $(this).dialog('destroy').remove();
    }
  });
}


function updateTrain(trainId) {
  // Create a form with input fields for updated information
  const form = $('<form></form>');
  form.append('<label for="updatedTrainName">Updated Train Name:</label>');
  form.append('<input type="text" id="updatedTrainName" name="updatedTrainName" required>');
  form.append('<label for="updatedCapacity">Updated Capacity:</label>');
  form.append('<input type="text" id="updatedCapacity" name="updatedCapacity" required>');

  // Show a dialog with the form
  const dialog = $('<div></div>').append(form);
  $('body').append(dialog);  // Append the dialog to the body

  dialog.dialog({
    title: 'Update Train',
    modal: true,
    buttons: {
      'Update': function () {
        // Collect updated information from the form
        const updatedData = {
          TrainName: $('#updatedTrainName').val(),
          Capacity: $('#updatedCapacity').val(),
        };

        // Send data to the server
        $.ajax({
          url: `/trains/${trainId}`,
          method: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify(updatedData),
          success: function (data) {
            console.log('Train updated successfully:', data);
            alert(data.message);
            fetchTrains();  // Refresh the train table after updating a train
          },
          error: function (xhr, status, error) {
            console.error('Error updating train:', error);
            alert('Error updating train. Check the console for details.');
          },
        });

        // Close the dialog
        $(this).dialog('close');
        dialog.remove();  // Remove the dialog from the DOM
      },
      'Cancel': function () {
        // Close the dialog without updating
        $(this).dialog('close');
        dialog.remove();  // Remove the dialog from the DOM
      }
    },
    close: function () {
      // Remove the dialog from the DOM
      $(this).dialog('destroy').remove();
    }
  });
}


function populateStationsTable(stations) {
  // Clear existing station table rows
  $('#stationsTable tbody').empty();

  // Populate station table with stations
  stations.forEach(function (station) {
    const row = `<tr>
                    <td>${station.StationID}</td>
                    <td>${station.StationName}</td>
                    <td>${station.Location}</td>
                    <td>
                      <button onclick="deleteStation(${station.StationID})">Delete</button>
                      <button onclick="updateStation(${station.StationID})">Update</button>
                    </td>
                </tr>`;
    $('#stationsTable tbody').append(row);
  });
}

function populateTrainsTable(trains) {
  // Clear existing train table rows
  $('#trainTable tbody').empty();

  // Populate train table with trains
  trains.forEach(function (train) {
    const row = `<tr>
                    <td>${train.TrainID}</td>
                    <td>${train.TrainName}</td>
                    <td>${train.Capacity}</td>
                    <td>
                      <button onclick="deleteTrain(${train.TrainID})">Delete</button>
                      <button onclick="updateTrain(${train.TrainID})">Update</button>
                    </td>
                </tr>`;
    $('#trainTable tbody').append(row);
  });
}

 


function fetchDropStations() {
  // Fetch stations from the server
  $.get('/stations', function (data) {
    // Populate dropdowns with station names
    populateDropdown('SourceStationID', data);
    populateDropdown('IntermediateStationID', data);
    populateDropdown('DestinationStationID', data);
  });
}


// Function to delete a route
function deleteRoute(routeId) {
  if (confirm('Are you sure you want to delete this route?')) {
    $.ajax({
      url: `/routes/${routeId}`,
      method: 'DELETE',
      success: function (data) {
        fetchRoutes();  // Refresh the route table after deleting a route
      },
      error: function (error) {
        console.error('Error deleting route:', error);
        alert('Error deleting route');
      },
    });
  }
}

function updateRoute(routeId) {
  // Fetch the station names for dropdowns
  fetchStations(function () {
    // Fetch the route details
    $.get(`/routes/${routeId}`, function (route) {
      // Create a form with input fields for updated information
      const form = $('<form></form>');
      form.append('<label for="updatedSourceStation">Updated Source Station:</label>');
      form.append('<select id="updatedSourceStation" name="updatedSourceStation" required></select>');

      form.append('<label for="updatedIntermediateStation">Updated Intermediate Station:</label>');
      form.append('<select id="updatedIntermediateStation" name="updatedIntermediateStation" required></select>');

      form.append('<label for="updatedDestinationStation">Updated Destination Station:</label>');
      form.append('<select id="updatedDestinationStation" name="updatedDestinationStation" required></select>');

      // Populate dropdowns with existing route information
      populateDropdown('updatedSourceStation', stations);
      populateDropdown('updatedIntermediateStation', stations);
      populateDropdown('updatedDestinationStation', stations);

      // Set selected values based on the existing route
      $('#updatedSourceStation').val(route.SourceStationID);
      $('#updatedIntermediateStation').val(route.IntermediateStationID);
      $('#updatedDestinationStation').val(route.DestinationStationID);

      // Show a dialog with the form
      const dialog = $('<div></div>').append(form);
      $('body').append(dialog);

      dialog.dialog({
        title: 'Update Route',
        modal: true,
        buttons: {
          'Update': function () {
            // Collect updated information from the form
            const updatedData = {
              SourceStationID: $('#updatedSourceStation').val(),
              IntermediateStationID: $('#updatedIntermediateStation').val(),
              DestinationStationID: $('#updatedDestinationStation').val(),
            };

            // Send data to the server
            $.ajax({
              url: `/routes/${routeId}`,
              method: 'PUT',
              contentType: 'application/json',
              data: JSON.stringify(updatedData),
              success: function (response) {
                if (response && response.message) {
                  console.log('Route updated successfully:', response);
                  alert(response.message);
                  fetchRoutes();  // Refresh the route table after updating a route
                } else {
                  console.error('Invalid response format:', response);
                  alert('Error updating route. Invalid response format.');
                }
              },
              error: function (xhr, status, error) {
                console.error('Error updating route:', error);
                alert('Error updating route. Check the console for details.');
              },
            });

            // Close the dialog
            $(this).dialog('close');
            dialog.remove();
          },
          'Cancel': function () {
            // Close the dialog without updating
            $(this).dialog('close');
            dialog.remove();
          }
        },
        close: function () {
          // Remove the dialog from the DOM
          $(this).dialog('destroy').remove();
        }
      });
    });
  });
}


// Function to populate dropdown options
function populateDropdown(elementId, data) {
  const dropdown = $('#' + elementId);
  dropdown.empty();
  dropdown.append('<option value="" selected>Select Station</option>');
  $.each(data, function (key, entry) {
    dropdown.append($('<option></option>').attr('value', entry.StationID).text(entry.StationName));
  });
}

function addRoute() {
  // Collect form data
  const formData = {
    RouteID: $('#RouteID').val(),
    SourceStationID: $('#SourceStationID').val(),
    IntermediateStationID: $('#IntermediateStationID').val(),
    DestinationStationID: $('#DestinationStationID').val(),
  };

  // Send data to the server
  $.post('/routes', formData, function (data) {
    alert(data.message);
    // Clear the form after successful addition
    $('#addRouteForm')[0].reset();
    fetchRoutes();  // Refresh the route table after adding a route
  });
}

function fetchRoutes() {
  // Fetch routes from the server
  $.get('/routes', function (data) {
    populateRoutesTable(data);
  });
}

function populateRoutesTable(routes) {
  // Clear existing route table rows
  $('#routesTable tbody').empty();

  // Fetch station names from the server
  $.get('/stations', function (stations) {
    // Create a mapping of station IDs to station names
    const stationNameMap = {};
    stations.forEach(station => {
      stationNameMap[station.StationID] = station.StationName;
    });

    // Populate route table with routes
    routes.forEach(function (route) {
      const row = `<tr>
                      <td>${route.RouteID}</td>
                      <td>${stationNameMap[route.SourceStationID]}</td>
                      <td>${stationNameMap[route.IntermediateStationID]}</td>
                      <td>${stationNameMap[route.DestinationStationID]}</td>
                      <td>
                        <button onclick="deleteRoute(${route.RouteID})">Delete</button>
                        <button onclick="updateRoute(${route.RouteID})">Update</button>
                      </td>
                  </tr>`;
      $('#routesTable tbody').append(row);
    });
  });
}


// Function to fetch schedules
function fetchSchedules() {
  // Fetch schedules from the server
  $.get('/schedules', function (data) {
    populateSchedulesTable(data);
  });
}

// Function to fetch train staff
function fetchTrainStaff() {
  // Fetch train staff from the server
  $.get('/trainstaff', function (data) {
    populateTrainStaffTable(data);
  });
}

// Function to add a new schedule
function addSchedule() {
  // Collect form data
  const formData = {
    ScheduleID: $('#ScheduleID').val(),
    TrainID: $('#TrainID_schedule').val(),
    RouteID: $('#RouteID_schedule').val(),
    DepartureTime: $('#DepartureTime').val(),
    ArrivalTime: $('#ArrivalTime').val(),
  };

  // Send data to the server
  $.post('/schedules', formData, function (data) {
    alert(data.message);
    // Clear the form after successful addition
    $('#addScheduleForm')[0].reset();
    fetchSchedules();  // Refresh the schedule table after adding a schedule
  });
}

// Function to add new train staff
function addTrainStaff() {
  // Collect form data
  const formData = {
    StaffID: $('#StaffID').val(),
    TrainID_trainStaff: $('#TrainID_trainStaff').val(),
    StaffName: $('#StaffName').val(),
    Role: $('#Role').val(),
  };

  // Send data to the server
  $.post('/trainstaff', formData, function (data) {
    alert(data.message);
    // Clear the form after successful addition
    $('#addTrainStaffForm')[0].reset();
    fetchTrainStaff();  // Refresh the train staff table after adding a staff member
  });
}

// Function to delete a schedule
function deleteSchedule(scheduleId) {
  if (confirm('Are you sure you want to delete this schedule?')) {
    $.ajax({
      url: `/schedules/${scheduleId}`,
      method: 'DELETE',
      success: function (data) {
        fetchSchedules();  // Refresh the schedule table after deleting a schedule
      },
      error: function (error) {
        console.error('Error deleting schedule:', error);
        alert('Error deleting schedule');
      },
    });
  }
}

// Function to delete train staff
function deleteTrainStaff(staffId) {
  if (confirm('Are you sure you want to delete this train staff member?')) {
    $.ajax({
      url: `/trainstaff/${staffId}`,
      method: 'DELETE',
      success: function (data) {
        fetchTrainStaff();  // Refresh the train staff table after deleting a staff member
      },
      error: function (error) {
        console.error('Error deleting train staff member:', error);
        alert('Error deleting train staff member');
      },
    });
  }
}

// Function to update a schedule
function updateSchedule(scheduleId) {
  // Create a form with input fields for updated information
  const form = $('<form></form>');
  form.append('<label for="updatedDepartureTime">Updated Departure Time:</label>');
  form.append('<input type="text" id="updatedDepartureTime" name="updatedDepartureTime" required>');
  form.append('<label for="updatedArrivalTime">Updated Arrival Time:</label>');
  form.append('<input type="text" id="updatedArrivalTime" name="updatedArrivalTime" required>');

  // Show a dialog with the form
  const dialog = $('<div></div>').append(form);
  $('body').append(dialog);  // Append the dialog to the body

  dialog.dialog({
    title: 'Update Schedule',
    modal: true,
    buttons: {
      'Update': function () {
        // Collect updated information from the form
        const updatedData = {
          DepartureTime: $('#updatedDepartureTime').val(),
          ArrivalTime: $('#updatedArrivalTime').val(),
        };

        // Send data to the server
        $.ajax({
          url: `/schedules/${scheduleId}`,
          method: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify(updatedData),
          success: function (data) {
            console.log('Schedule updated successfully:', data);
            alert(data.message);
            fetchSchedules();  // Refresh the schedule table after updating a schedule
          },
          error: function (xhr, status, error) {
            console.error('Error updating schedule:', error);
            alert('Error updating schedule. Check the console for details.');
          },
        });

        // Close the dialog
        $(this).dialog('close');
        dialog.remove();  // Remove the dialog from the DOM
      },
      'Cancel': function () {
        // Close the dialog without updating
        $(this).dialog('close');
        dialog.remove();  // Remove the dialog from the DOM
      }
    },
    close: function () {
      // Remove the dialog from the DOM
      $(this).dialog('destroy').remove();
    }
  });
}

// Function to update train staff
function updateTrainStaff(staffId) {
  // Create a form with input fields for updated information
  const form = $('<form></form>');
  form.append('<label for="updatedStaffName">Updated Staff Name:</label>');
  form.append('<input type="text" id="updatedStaffName" name="updatedStaffName" required>');
  form.append('<label for="updatedRole">Updated Role:</label>');
  form.append('<input type="text" id="updatedRole" name="updatedRole" required>');

  // Show a dialog with the form
  const dialog = $('<div></div>').append(form);
  $('body').append(dialog);  // Append the dialog to the body

  dialog.dialog({
    title: 'Update Train Staff',
    modal: true,
    buttons: {
      'Update': function () {
        // Collect updated information from the form
        const updatedData = {
          StaffName: $('#updatedStaffName').val(),
          Role: $('#updatedRole').val(),
        };

        // Send data to the server
        $.ajax({
          url: `/trainstaff/${staffId}`,
          method: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify(updatedData),
          success: function (data) {
            console.log('Train staff member updated successfully:', data);
            alert(data.message);
            fetchTrainStaff();  // Refresh the train staff table after updating a staff member
          },
          error: function (xhr, status, error) {
            console.error('Error updating train staff member:', error);
            alert('Error updating train staff member. Check the console for details.');
          },
        });

        // Close the dialog
        $(this).dialog('close');
        dialog.remove();  // Remove the dialog from the DOM
      },
      'Cancel': function () {
        // Close the dialog without updating
        $(this).dialog('close');
        dialog.remove();  // Remove the dialog from the DOM
      }
    },
    close: function () {
      // Remove the dialog from the DOM
      $(this).dialog('destroy').remove();
    }
  });
}

// Function to populate the schedules table
function populateSchedulesTable(schedules) {
  // Clear existing schedules table rows
  $('#schedulesTable tbody').empty();

  // Populate schedules table with schedules
  schedules.forEach(function (schedule) {
    const row = `<tr>
                    <td>${schedule.ScheduleID}</td>
                    <td>${schedule.TrainID}</td>
                    <td>${schedule.RouteID}</td>
                    <td>${schedule.DepartureTime}</td>
                    <td>${schedule.ArrivalTime}</td>
                    <td>
                      <button onclick="deleteSchedule(${schedule.ScheduleID})">Delete</button>
                      <button onclick="updateSchedule(${schedule.ScheduleID})">Update</button>
                    </td>
                </tr>`;
    $('#schedulesTable tbody').append(row);
  });
}

// Function to populate the train staff table
function populateTrainStaffTable(trainStaff) {
  // Clear existing train staff table rows
  $('#trainStaffTable tbody').empty();

  // Populate train staff table with train staff
  trainStaff.forEach(function (staff) {
    const row = `<tr>
                    <td>${staff.StaffID}</td>
                    <td>${staff.TrainID}</td>
                    <td>${staff.StaffName}</td>
                    <td>${staff.Role}</td>
                    <td>
                      <button onclick="deleteTrainStaff(${staff.StaffID})">Delete</button>
                      <button onclick="updateTrainStaff(${staff.StaffID})">Update</button>
                    </td>
                </tr>`;
    $('#trainStaffTable tbody').append(row);
  });
}



