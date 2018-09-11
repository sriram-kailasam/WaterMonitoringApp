(function () {
	const socket = io({transports: ['websocket', 'polling'], upgrade: false, reconnection: false});

	socket.on('connect', function() {
		console.log('Connected to server');
	})
	socket.on('temperature_changed', function(row) {
		console.log(row);
		let html = `<tr><td>${row['date']}</td>`
					+ `<td>${row['time']}</td>`
					+ `<td>${row['minimumTemperature']}</td>`
					+ `<td>${row['maximumTemperature']}</td></tr>`;

		$('#temperatureDataTable tbody').prepend(html);
	});
})();