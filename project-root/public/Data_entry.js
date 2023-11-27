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

// Add route form submission
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
