function drawTemperatureChart(canvas, labels, dataset) {
	let ctx = canvas.getContext('2d');

	var TemperatureChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: labels,
			datasets: [{
				label: "Temperature",
				fill: false,
				borderColor: '#7FFF00',
				backgroundColor: '#7FFF00',
				data: dataset
			}]
		},
		options: {
			title: {
				display: true,
				text: 'Variation of temperature with time'
			}
		}
	});
}

function drawHumidityChart(canvas, labels, dataset) {
	let ctx = canvas.getContext('2d');

	var HumidityChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: labels,
			datasets: [{
				label: "Humidity",
				fill: false,
				borderColor: '#FF7F50',
				backgroundColor: '#FF7F50',
				data: dataset
			}]
		},
		options: {
			title: {
				display: true,
				text: 'Variation of humidity with time'
			}
		}
	});
}