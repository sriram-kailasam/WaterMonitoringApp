(function () {
	const socket = io({
		transports: ['websocket', 'polling'],
		upgrade: true
	});

	socket.on('humidity_changed', function(message) {
		let row = JSON.parse(message);
		let html = `<tr><td>${row['date']}</td>`
					+ `<td>${row['time']}</td>`
					+ `<td>${row['humidity']}</td></tr>`;

		$('#humidityDataTable tbody').prepend(html);

		let timeRegex = new RegExp(/[0-9]{2}:[0-9]{2}/);
		HumidityChart.data.labels.push(timeRegex.exec(row['time'])[0]);
		HumidityChart.data.datasets[0].data.push(row['humidity']);

		HumidityChart.update();
	});
})();