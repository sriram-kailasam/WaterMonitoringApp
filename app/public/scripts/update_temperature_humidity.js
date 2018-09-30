(function() {
	const socket = io({
		transports: ['websocket', 'polling'],
		upgrade: true
	});

	socket.on('temperature_humidity_changed', function(message) {
		let row = JSON.parse(message);
		let html = `<tr><td>${row['date']}</td>
					<td>${row['time']}</td>
					<td>${row['temperature']}</td>
					<td>${row['humidity']}</td></tr>`;

		$('#temperatureHumidityDataTable tbody').prepend(html);
	});
})();