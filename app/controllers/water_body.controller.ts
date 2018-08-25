import {Request, Response} from 'express';
import {DbClient} from '../server';
import {WaterBody} from '../models/water_body.model';
import {TemperatureInfo} from '../models/temperature_info.model';

export class WaterBodyController {
	static listAllWaterBodies(req: Request, res: Response) {
		const query = 'SELECT id, name FROM water_bodies';
		let waterBodyList: Array<WaterBody> = new Array();

		DbClient.query(query)
		.then(result => {
			for (let row of result.rows) {
				waterBodyList.push(new WaterBody(Number(row.id), row.name));
			}

			res.render('water_body_list', {waterBodyList: waterBodyList});
		})
		.catch(err => console.error(err));
	}

	static showWaterBody(req: Request, res: Response) {
		let id = req.params.id;

		const query =
			`SELECT water_bodies.id, `
			+ `water_bodies.name, `
			+ `temperature_data.minimum_temperature, `
			+ `temperature_data.maximum_temperature `
			+ `FROM water_bodies INNER JOIN temperature_data ON `
			+ `water_bodies.id=temperature_data.water_body_id `
			+ `AND temperature_data.water_body_id=${id}`;

		DbClient.query(query)
		.then(result => {

			let waterBody = new WaterBody(Number(result.rows[0].id), result.rows[0].name);
			let temperatureData: Array<TemperatureInfo> = Array();

			for (let row of result.rows) {
				let temperatureInfo =
				new TemperatureInfo(
					Number(row.minimum_temperature),
					Number(row.maximum_temperature),
					Number(id));
				temperatureData.push(temperatureInfo);
			}

			res.render('water_body', {waterBody: waterBody, temperatureData: temperatureData});
		})
		.catch(err => console.error(err));
	}
}