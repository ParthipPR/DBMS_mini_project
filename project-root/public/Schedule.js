$(document).ready(function () {
    $('#submitTrainQuery').click(function () {
        const trainName = $('#trainNameInput').val();

        // Make AJAX request to fetch schedule based on the entered train name
        $.ajax({
            url: `/scheduleByTrainName/${trainName}`,
            method: 'GET',
            success: function (result) {
                displayTrainResult(result);
            },
            error: function (error) {
                console.error('Error fetching schedule:', error);
                alert('Error fetching schedule. Check the console for details.');
            }
        });
    });

    $('#submitLocationQuery').click(function () {
        const location = $('#locationInput').val();

        // Make AJAX request to fetch schedule based on the entered location
        $.ajax({
            url: `/scheduleByLocation`,
            method: 'GET',
            data: { location: location },
            success: function (result) {
                displayLocationResult(result);
            },
            error: function (error) {
                console.error('Error fetching schedule:', error);
                alert('Error fetching schedule. Check the console for details.');
            }
        });
    });

    function displayTrainResult(result) {
        const resultContainer = $('#trainResultContainer');
        resultContainer.empty();

        if (result.length === 0) {
            resultContainer.append('<p>No schedule data found.</p>');
            return;
        }

        const table = $('<table></table>').addClass('result-table');
        const headerRow = '<tr><th>Station Name</th><th>Arrival Time</th><th>Departure Time</th></tr>';
        table.append(headerRow);

        result.forEach(function (entry) {
            const row = `<tr><td>${entry.StationName}</td><td>${entry.ArrivalTime}</td><td>${entry.DepartureTime}</td></tr>`;
            table.append(row);
        });

        resultContainer.append(table);
    }

    function displayLocationResult(result) {
        const resultContainer = $('#locationResultContainer');
        resultContainer.empty();

        if (result.length === 0) {
            resultContainer.append('<p>No schedule data found.</p>');
            return;
        }

        const table = $('<table></table>').addClass('result-table');
        const headerRow = '<tr><th>Train Name</th><th>Station Name</th><th>Arrival Time</th><th>Departure Time</th></tr>';
        table.append(headerRow);

        result.forEach(function (entry) {
            const row = `<tr><td>${entry.TrainName}</td><td>${entry.StationName}</td><td>${entry.ArrivalTime}</td><td>${entry.DepartureTime}</td></tr>`;
            table.append(row);
        });

        resultContainer.append(table);
    }
});
