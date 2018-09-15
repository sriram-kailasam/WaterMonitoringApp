(function () {
	const socket = new WebSocket('ws://localhost:8000');

	socket.onopen = function() {
		console.log('Connected to server')
	}
	socket.onmessage = function(message) {
		console.log(message.data);

		let row = JSON.parse(message.data);
		let html = `<tr><td>${row['date']}</td>`
					+ `<td>${row['time']}</td>`
					+ `<td>${row['minimumTemperature']}</td>`
					+ `<td>${row['maximumTemperature']}</td></tr>`;

		$('#temperatureDataTable tbody').prepend(html);
	}

	socket.onclose = function() {
		console.log('Socket disconnected');
	}
})();