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

		let timeRegex = new RegExp(/[0-9]{2}:[0-9]{2}/);
		TemperatureChart.data.labels.push(timeRegex.exec(row['time'])[0]);
		TemperatureChart.data.datasets[0].data.push(row['temperature']);

		HumidityChart.data.labels.push(timeRegex.exec(row['time'])[0]);
		HumidityChart.data.datasets[0].data.push(row['humidity']);

		TemperatureChart.update();
		HumidityChart.update();
	});
})();