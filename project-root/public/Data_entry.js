// public/script.js

$(document).ready(function () {
  // Fetch stations and trains on page load
  fetchStations();
  fetchTrains();
  fetchDropStations();
  fetchRoutes(); 
  fetchSchedules();
  fetchTrainStaff();
  


  // Stations table Functions

  // Add station form submission
  $('#addStationForm').submit(function (e) {
    e.preventDefault();
    addStation();
  });

  function fetchStations() {
    // Fetch stations from the server
    $.get('/stations', function (data) {
      populateStationsTable(data);
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

  function fetchDropStations() {
    // Fetch stations from the server
    $.get('/stations', function (data) {
      // Populate dropdowns with station names
      populateDropdown('SourceStationID', data);
      populateDropdown('IntermediateStationID', data);
      populateDropdown('DestinationStationID', data);
    });
  }

  // train table Functions

  // Add train form submission
  $('#addTrainForm').submit(function (e) {
    e.preventDefault();
    addTrain();
  });
});



function fetchTrains() {
  // Fetch trains from the server
  $.get('/trains', function (data) {
    populateTrainsTable(data);
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

// Function for route table
$('#addRouteForm').submit(function (e) {
  e.preventDefault();
  addRoute();
});

function deleteRoute(routeId) {
  if (confirm('Are you sure you want to delete this route?')) {
    $.ajax({
      url: `/routes/${routeId}`,
      method: 'DELETE',
      success: function () {
        fetchRoutes(); // Refresh the route table after deleting a route
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
  fetchStations(function (stations) {
    // Fetch the route details
    $.get(`/routes/${routeId}`, function (route) {
      // Create a form with input fields for updated information
      const form = $('<form></form>');
      form.append(createLabelAndDropdown('Updated Source Station:', 'updatedSourceStation', stations, route.SourceStationID));
      form.append(createLabelAndDropdown('Updated Intermediate Station:', 'updatedIntermediateStation', stations, route.IntermediateStationID));
      form.append(createLabelAndDropdown('Updated Destination Station:', 'updatedDestinationStation', stations, route.DestinationStationID));

      // Show a dialog with the form
      showDialog('Update Route', form, function () {
        const updatedData = {
          SourceStationID: $('#updatedSourceStation').val(),
          IntermediateStationID: $('#updatedIntermediateStation').val(),
          DestinationStationID: $('#updatedDestinationStation').val(),
        };

        // Send data to the server
        updateRouteOnServer(routeId, updatedData);
      });
    });
  });
}

function createLabelAndDropdown(labelText, elementId, data, selectedValue) {
  const container = $('<div></div>');
  container.append(`<label for="${elementId}">${labelText}</label>`);
  container.append(`<select id="${elementId}" name="${elementId}" required></select>`);

  // Populate dropdown with data
  populateDropdown(elementId, data);

  // Set selected value based on the existing route
  $(`#${elementId}`).val(selectedValue);

  return container;
}

function populateDropdown(elementId, data) {
  const dropdown = $('#' + elementId);
  dropdown.empty();
  dropdown.append('<option value="" selected>Select Station</option>');
  $.each(data, function (key, entry) {
    dropdown.append($('<option></option>').attr('value', entry.StationID).text(entry.StationName));
  });
}

function showDialog(title, content, confirmCallback) {
  const dialog = $('<div></div>').append(content);
  $('body').append(dialog);

  dialog.dialog({
    title: title,
    modal: true,
    buttons: {
      'Update': function () {
        confirmCallback();
        $(this).dialog('close');
        dialog.remove();
      },
      'Cancel': function () {
        $(this).dialog('close');
        dialog.remove();
      }
    },
    close: function () {
      $(this).dialog('destroy').remove();
    }
  });
}

function updateRouteOnServer(routeId, updatedData) {
  $.ajax({
    url: `/routes/${routeId}`,
    method: 'PUT',
    contentType: 'application/json',
    data: JSON.stringify(updatedData),
    success: function (response) {
      if (response && response.message) {
        console.log('Route updated successfully:', response);
        alert(response.message);
        fetchRoutes(); // Refresh the route table after updating a route
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
}

function addRoute() {
  const formData = {
    RouteID: $('#RouteID').val(),
    SourceStationID: $('#SourceStationID').val(),
    IntermediateStationID: $('#IntermediateStationID').val(),
    DestinationStationID: $('#DestinationStationID').val(),
  };

  $.post('/routes', formData, function (data) {
    alert(data.message);
    $('#addRouteForm')[0].reset();
    fetchRoutes(); // Refresh the route table after adding a route
  });
}

function fetchRoutes() {
  $.get('/routes', function (data) {
    populateRoutesTable(data);
  });
}

function populateRoutesTable(routes) {
  $('#routesTable tbody').empty();

  $.get('/stations', function (stations) {
    const stationNameMap = {};
    stations.forEach(station => {
      stationNameMap[station.StationID] = station.StationName;
    });

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

// Function for Schedules table

// Submit form for adding a new schedule
$('#addScheduleForm').submit(function (e) {
  e.preventDefault();
  addSchedule();
});

// Function to delete a schedule
function deleteSchedule(scheduleId) {
  if (confirm('Are you sure you want to delete this schedule?')) {
    $.ajax({
      url: `/schedules/${scheduleId}`,
      method: 'DELETE',
      success: function () {
        fetchSchedules(); // Refresh the schedules table after deleting a schedule
      },
      error: function (error) {
        console.error('Error deleting schedule:', error);
        alert('Error deleting schedule');
      },
    });
  }
}

// Function to update a schedule
function updateSchedule(scheduleId) {
  // Fetch the train and route names for dropdowns
  fetchTrainsAndRoutes(function (trains, routes) {
    // Fetch the schedule details
    $.get(`/schedules/${scheduleId}`, function (schedule) {
      // Create a form with input fields for updated information
      const form = $('<form></form>');
      form.append(createLabelAndDropdownForScheduleTrain('Updated Train:', 'updatedTrain', trains, schedule.TrainID));
      form.append(createLabelAndDropdownForScheduleRoute('Updated Route:', 'updatedRoute', routes, schedule.RouteID));
      form.append('<label for="updatedDepartureTime">Updated Departure Time:</label>');
      form.append('<input type="datetime-local" id="updatedDepartureTime" name="updatedDepartureTime" required>');

      form.append('<label for="updatedArrivalTime">Updated Arrival Time:</label>');
      form.append('<input type="datetime-local" id="updatedArrivalTime" name="updatedArrivalTime" required>');

      // Set values based on the existing schedule
      $('#updatedDepartureTime').val(schedule.DepartureTime.replace(' ', 'T'));
      $('#updatedArrivalTime').val(schedule.ArrivalTime.replace(' ', 'T'));

      // Show a dialog with the form
      showDialog('Update Schedule', form, function () {
        const updatedData = {
          TrainID: $('#updatedTrain').val(),
          RouteID: $('#updatedRoute').val(),
          DepartureTime: $('#updatedDepartureTime').val(),
          ArrivalTime: $('#updatedArrivalTime').val(),
        };

        // Send data to the server
        updateScheduleOnServer(scheduleId, updatedData);
      });
    });
  });
}


// Function to add a new schedule
function addSchedule() {
  // Collect form data
  const formData = {
    ScheduleID: $('#ScheduleID').val(),
    TrainID: $('#TrainID').val(),
    RouteID: $('#RouteID').val(),
    DepartureTime: $('#DepartureTime').val(),
    ArrivalTime: $('#ArrivalTime').val(),
  };

  // Send data to the server
  $.post('/schedules', formData, function (data) {
    alert(data.message);
    // Clear the form after successful addition
    $('#addScheduleForm')[0].reset();
    fetchSchedules(); // Refresh the schedule table after adding a schedule
  });
}

// Function to fetch schedules from the server
function fetchSchedules() {
  $.get('/schedules', function (data) {
    populateSchedulesTable(data);
  });
}

// Function to populate the schedules table with data
function populateSchedulesTable(schedules) {
  // Clear existing schedule table rows
  $('#schedulesTable tbody').empty();

  // Fetch train and route names from the server
  fetchTrainsAndRoutes(function (trains, routes) {
    // Create mappings of train and route IDs to their names
    const trainNameMap = {};
    trains.forEach(train => {
      trainNameMap[train.TrainID] = train.TrainName;
    });

    const routeNameMap = {};
    routes.forEach(route => {
      routeNameMap[route.RouteID] = route.RouteName;
    });

    // Populate schedule table with schedules
    schedules.forEach(function (schedule) {
      const row = `<tr>
                      <td>${schedule.ScheduleID}</td>
                      <td>${trainNameMap[schedule.TrainID]}</td>
                      <td>${routeNameMap[schedule.RouteID]}</td>
                      <td>${formatDateTime(schedule.DepartureTime)}</td>
                      <td>${formatDateTime(schedule.ArrivalTime)}</td>
                      <td>
                        <button onclick="deleteSchedule(${schedule.ScheduleID})">Delete</button>
                        <button onclick="updateSchedule(${schedule.ScheduleID})">Update</button>
                      </td>
                  </tr>`;
      $('#schedulesTable tbody').append(row);
    });
  });
}

// Helper function to format datetime in a readable format
function formatDateTime(dateTimeString) {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return new Date(dateTimeString).toLocaleDateString(undefined, options);
}

// Function to fetch trains and routes from the server
function fetchTrainsAndRoutes(callback) {
  // Fetch trains
  $.get('/trains', function (trains) {
    // Fetch routes
    $.get('/routes', function (routes) {
      // Execute the callback with trains and routes
      callback(trains, routes);
    });
  });
}

function createLabelAndDropdownForScheduleTrain(labelText, elementId, data, selectedValue) {
  const container = $('<div></div>');
  container.append(`<label for="${elementId}">${labelText}</label>`);
  container.append(`<select id="${elementId}" name="${elementId}" required></select>`);

  // Populate dropdown with data
  populateDropdownForScheduleTrain(elementId, data);

  // Set selected value based on the existing route
  $(`#${elementId}`).val(selectedValue);

  return container;
}
function createLabelAndDropdownForScheduleRoute(labelText, elementId, data, selectedValue) {
  const container = $('<div></div>');
  container.append(`<label for="${elementId}">${labelText}</label>`);
  container.append(`<select id="${elementId}" name="${elementId}" required></select>`);

  // Populate dropdown with data
  populateDropdownForScheduleRoute(elementId, data);

  // Set selected value based on the existing route
  $(`#${elementId}`).val(selectedValue);

  return container;
}

function populateDropdownForScheduleTrain(elementId, data) {
  const dropdown = $('#' + elementId);
  dropdown.empty();
  dropdown.append('<option value="" selected>Select Train</option>');
  $.each(data, function (key, entry) {
    dropdown.append($('<option></option>').attr('value', entry.TrainID).text(entry.TrainName));
  });
}
function populateDropdownForScheduleRoute(elementId, data) {
  const dropdown = $('#' + elementId);
  dropdown.empty();
  dropdown.append('<option value="" selected>Select Train</option>');
  $.each(data, function (key, entry) {
    dropdown.append($('<option></option>').attr('value', entry.RouteID).text(entry.RouteID));
  });
}


// Helper function to format schedule option text
function formatScheduleOption(entry) {
  // Customize this based on the properties of your schedule data
  return `${entry.TrainName} - ${entry.RouteName} - ${formatDateTime(entry.DepartureTime)}`;
}


// Add this function to fetch Train Staff data
function fetchTrainStaff() {
  // Fetch Train Staff data from the server
  $.get('/trainstaff', function (data) {
    populateTrainStaffTable(data);
  });
}

// Add this function to populate the Train Staff table with data
function populateTrainStaffTable(trainStaff) {
  // Clear existing Train Staff table rows
  $('#trainStaffTable tbody').empty();

  // Populate Train Staff table with Train Staff data
  trainStaff.forEach(function (staff) {
    const row = `<tr>
                    <td>${staff.StaffID}</td>
                    <td>${staff.TrainID}</td>
                    <td>${staff.StaffName}</td>
                    <td>${staff.Designation}</td>
                    <!-- Add more columns as needed -->
                    <td>
                      <button onclick="deleteTrainStaff(${staff.StaffID})">Delete</button>
                      <button onclick="updateTrainStaff(${staff.StaffID})">Update</button>
                    </td>
                </tr>`;
    $('#trainStaffTable tbody').append(row);
  });
}

// Add this function to delete Train Staff
function deleteTrainStaff(staffId) {
  if (confirm('Are you sure you want to delete this Train Staff member?')) {
    $.ajax({
      url: `/trainstaff/${staffId}`,
      method: 'DELETE',
      success: function () {
        fetchTrainStaff(); // Refresh the Train Staff table after deleting a staff member
      },
      error: function (error) {
        console.error('Error deleting Train Staff member:', error);
        alert('Error deleting Train Staff member');
      },
    });
  }
}

// Add this function to update Train Staff information
function updateTrainStaff(staffId) {
  // Create a form with input fields for updated information
  const form = $('<form></form>');
  form.append('<label for="updatedStaffName">Updated Staff Name:</label>');
  form.append('<input type="text" id="updatedStaffName" name="updatedStaffName" required>');
  form.append('<label for="updatedDesignation">Updated Designation:</label>');
  form.append('<input type="text" id="updatedDesignation" name="updatedDesignation" required>');

  // Show a dialog with the form
  const dialog = $('<div></div>').append(form);
  $('body').append(dialog);

  dialog.dialog({
    title: 'Update Train Staff',
    modal: true,
    buttons: {
      'Update': function () {
        // Collect updated information from the form
        const updatedData = {
          StaffName: $('#updatedStaffName').val(),
          Designation: $('#updatedDesignation').val(),
          // Add more fields as needed
        };

        // Send data to the server
        $.ajax({
          url: `/trainstaff/${staffId}`,
          method: 'PUT',
          contentType: 'application/json',
          data: JSON.stringify(updatedData),
          success: function (data) {
            console.log('Train Staff member updated successfully:', data);
            alert(data.message);
            fetchTrainStaff(); // Refresh the Train Staff table after updating a staff member
          },
          error: function (xhr, status, error) {
            console.error('Error updating Train Staff member:', error);
            alert('Error updating Train Staff member. Check the console for details.');
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
}

