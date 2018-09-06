(function () {
    const socket = io({transports: ['websocket', 'polling'], upgrade: true});

    socket.on('temperature_changed', function(row) {
        let html = `<tr><td>${row['minimum_temperature']}</td>
                    <td>${row['maximum_temperature']}</td></tr>`;

        $('#temperatureDataTable').append(html);
    });
})();