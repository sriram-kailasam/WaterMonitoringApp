(function () {
	const socket = io({
		transports: ['websocket', 'polling'],
		upgrade: true
	});

	socket.on('connection', function() {
		console.log('Connected to server');
	});

	socket.on('temperature_changed', function(message) {
		console.log(message);

		let row = JSON.parse(message);
		let html = `<tr><td>${row['date']}</td>`
					+ `<td>${row['time']}</td>`
					+ `<td>${row['minimumTemperature']}</td>`
					+ `<td>${row['maximumTemperature']}</td></tr>`;

		$('#temperatureDataTable tbody').prepend(html);
	});

	socket.on('disconnect', function() {
		console.log('Socket disconnected');
	});
})();