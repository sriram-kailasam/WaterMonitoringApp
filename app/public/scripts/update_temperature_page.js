(function () {
	const socket = io({
		transports: ['websocket', 'polling'],
		upgrade: true
	});

	socket.on('temperature_changed', function(message) {
		let row = JSON.parse(message);
		let html = `<tr><td>${row['date']}</td>
					<td>${row['time']}</td>
					<td>${row['temperature']}</td></tr>`;

		$('#temperatureDataTable tbody').prepend(html);

		TemperatureChart.data.labels.push(row['time']);
		TemperatureChart.data.datasets[0].data.push(row['temperature']);

		TemperatureChart.update();
	});
})();