import {Server, Socket} from 'socket.io';
import {DbClient} from './server';
import {TemperatureInfo} from './models/temperature_info.model';
import {HumidityInfo} from './models/humidity_info.model';

export class SocketEventDispactcher {
	async registerHandlers(server: Server) {
		await DbClient.query("LISTEN temperature_change_channel");
		
		server.on('connection', (socket) => {
			console.log('Socket client connected');
			DbClient.on('notification', (message) => {
				console.log(message);
				switch (message.channel) {
					case 'temperature_change_channel': {
						this.dispatchTemperatureChangeEvent(socket, JSON.stringify(message.payload));
						break;
					}
					case 'humidity_change_channel': {
						this.dispatchHumidityChangeEvent(socket, JSON.stringify(message.payload));
						break;
					}
				}
			});
		});
	}

	private dispatchTemperatureChangeEvent(socket: Socket, data: string) {
		let row = JSON.parse(data);

		console.log(row);

		let date: string = this.getDateFromPayload(data);
		let time: string = this.getTimeFromPayload(data);

		let temperatureInfo = new TemperatureInfo(
			date,
			time,
			Number(row["minimum_temperature"]),
			Number(row["maximum_temperature"]),
			Number(row["water_body_id"])
		);

	socket.emit('temperature_changed', temperatureInfo.toString());
		console.log(`Data sent: ${temperatureInfo.toString()}`);
	}

	private dispatchHumidityChangeEvent(socket: Socket, data: string) {
		let row = JSON.parse(data);

		let date: string = this.getDateFromPayload(data);
		let time: string = this.getTimeFromPayload(data);
		
		let humidityInfo = new HumidityInfo(
			date,
			time,
			Number(row.humdity),
			Number(row.water_body_id)
		);

		socket.emit('humidity_changed', humidityInfo.toString());
		console.log('Data sent');
	}

	private getDateFromPayload(payload: string): string {
		let dateRegex = new RegExp(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
		return dateRegex.exec(payload)![0].split('-').reverse().join('-');
	}

	private getTimeFromPayload(payload: string): string {
		let timeRegex = new RegExp(/[0-9]{2}:[0-9]{2}:[0-9]{2}/);
		return timeRegex.exec(payload)![0];
	}
}