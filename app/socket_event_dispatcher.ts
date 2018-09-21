import {Server, Socket} from 'socket.io';
import {DbClient} from './server';
import {TemperatureInfo} from './models/temperature_info.model';
import {HumidityInfo} from './models/humidity_info.model';

export class SocketEventDispactcher {
	async registerHandlers(server: Server) {
		server.on('connection', (socket) => {
			DbClient.on('notification', (message) => {
				switch (message.channel) {
					case 'temperature_change_channel':
						this.dispatchTemperatureChangeEvent(socket, JSON.stringify(message.payload));
					case 'humidity_change_channel':
						this.dispatchHumidityChangeEvent(socket, JSON.stringify(message.payload));
				}
			});
		});
	}

	private async dispatchTemperatureChangeEvent(socket: Socket, data: string) {
		let row = JSON.parse(data);

		let date: string = this.getDateFromPayload(row);
		let time: string = this.getTimeFromPayload(row);

		let temperatureInfo = new TemperatureInfo(
			date,
			time,
			Number(row.minimum_temperature),
			Number(row.maximum_temperature),
			Number(row.water_body_id));

		socket.emit('temperature_changed', temperatureInfo.toString());
	}

	private async dispatchHumidityChangeEvent(socket: Socket, data: string) {
		let row = JSON.parse(data);

		let date: string = this.getDateFromPayload(row);
		let time: string = this.getTimeFromPayload(row);
		
		let humidityInfo = new HumidityInfo(
			date,
			time,
			Number(row.humdity),
			Number(row.water_body_id)
		);

		socket.emit('humidity_changed', humidityInfo.toString());
	}

	private getDateFromPayload(payload: any): string {
		let dateRegex = new RegExp(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
		return dateRegex.exec(payload.datetime)![0].split('-').reverse().join('-');
	}

	private getTimeFromPayload(payload: any): string {
		let timeRegex = new RegExp(/[0-9]{2}:[0-9]{2}:[0-9]{2}/);
		return timeRegex.exec(payload.datetime)![0];
	}
}