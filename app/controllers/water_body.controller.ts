import {WaterBody} from './../models/water_body.model';
import {Request, Response} from 'express';
import {DbClient} from '../server';
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

		const nameQuery = 'SELECT id, name FROM water_bodies WHERE id=$1';
		const temperatureQuery =
			'SELECT temperature_data.minimum_temperature, '
			+ 'temperature_data.maximum_temperature '
			+ 'FROM water_bodies INNER JOIN temperature_data ON '
			+ 'water_bodies.id=temperature_data.water_body_id '
			+ 'AND temperature_data.water_body_id=$1';

		let nameQueryResult: QueryResult = await DbClient.query(nameQuery, [id]);
		let temperatureQueryResult: QueryResult = await DbClient.query(temperatureQuery, [id]);

		if (nameQueryResult.rowCount == 0) {
			res.status(404).end();
			console.error('Could not retreive name of water body');
			return;
		}

		let waterBody =
			new WaterBody(Number(nameQueryResult.rows[0].id), nameQueryResult.rows[0].name);

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

		res.render('water_body', {waterBody: waterBody, temperatureData: temperatureData});
	}
}