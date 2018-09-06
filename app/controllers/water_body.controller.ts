import {WaterBody} from './../models/water_body.model';
import {Request, Response} from 'express';
import {DbClient, SocketServer} from '../server';
import {TemperatureInfo} from '../models/temperature_info.model';
import {QueryResult} from 'pg';

export class WaterBodyController {
	static async listAllWaterBodies(req: Request, res: Response) {
		const query = 'SELECT id, name FROM water_bodies';
		let waterBodyList: Array<WaterBody> = new Array();

		let queryResult = await DbClient.query(query);
		for (let row of queryResult.rows) {
			waterBodyList.push(new WaterBody(Number(row.id), row.name));
		}

		res.render('water_body_list', {waterBodyList: waterBodyList});
	}

	static async showWaterBody(req: Request, res: Response) {
		let id = req.params.id;

		await DbClient.query('LISTEN temperature_change_channel');

		let name: string;
		try {
			name = await WaterBodyController.getWaterBodyName(id);
		} catch (error) {
			console.error(error);
			res.status(404).end();
			return;
		};

		let waterBody =
			new WaterBody(id, name);

		let temperatureData = await WaterBodyController.getTemperatureData(id);

		DbClient.on('notification', (message) => {
			console.log(message);
			let row = JSON.parse(String(message.payload));

			temperatureData.push(new TemperatureInfo(
				Number(row.maximum_temperature),
				Number(row.minimum_temperature),
				Number(row.id)));

			SocketServer.sockets.emit('temperature_changed', row);
		});

		res.render('water_body', {waterBody: waterBody, temperatureData: temperatureData});
	}

	private static async getWaterBodyName(waterBodyId: number): Promise<string> {
		const nameQuery = 'SELECT id, name FROM water_bodies WHERE id=$1';
		let nameQueryResult: QueryResult = await DbClient.query(nameQuery, [waterBodyId]);

		if (nameQueryResult.rowCount == 0) {
			return Promise.reject<string>(`Cannot find name of water body with id ${waterBodyId}`);
		}

		return Promise.resolve(nameQueryResult.rows[0].name);
	}

	private static async getTemperatureData(waterBodyId: number): Promise<Array<TemperatureInfo>> {
		const temperatureQuery =
			'SELECT temperature_data.minimum_temperature, '
			+ 'temperature_data.maximum_temperature '
			+ 'FROM water_bodies INNER JOIN temperature_data ON '
			+ 'water_bodies.id=temperature_data.water_body_id '
			+ 'AND temperature_data.water_body_id=$1';

		let temperatureQueryResult: QueryResult = await DbClient.query(temperatureQuery, [waterBodyId]);
		let temperatureData: Array<TemperatureInfo> = new Array();

		if (temperatureQueryResult.rowCount != 0) {
			for (let row of temperatureQueryResult.rows) {
				let temperatureInfo = new TemperatureInfo(
					Number(row.minimum_temperature),
					Number(row.maximum_temperature),
					Number(row.water_body_id)
				);

				temperatureData.push(temperatureInfo);
			}
		}

		return Promise.resolve(temperatureData);
	}
}