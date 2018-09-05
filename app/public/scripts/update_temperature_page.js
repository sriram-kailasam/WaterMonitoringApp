(function () {
    const socket = io({transports: ['websocket', 'polling'], upgrade: true});

    socket.on('message', console.log);
    socket.on('temperature_changed', function(row) {
        console.log(row);

        let html = `<tr>${row.minimumTemperature}</tr>
                    <tr>${row.maximumTemperature}</tr>`;

        $('#temperatureDataTable').append(html);
    });
})();