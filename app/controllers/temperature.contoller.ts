import {TemperatureInfo} from '../models/temperature_info.model';
import {QueryResult} from 'pg';
import {DbClient} from '../server';

export class TemperatureController {
	static async getTemperatureData(waterBodyId: number): Promise<Array<TemperatureInfo>> {
		const temperatureQuery =
			`SELECT to_char(temperature_data.datetime, 'DD-MM-YYYY') AS date,
			to_char(temperature_data.datetime, 'HH:MI:SS') AS time,
			temperature_data.temperature
			FROM water_bodies INNER JOIN temperature_data ON
			water_bodies.id=temperature_data.water_body_id
			AND temperature_data.water_body_id=$1
			ORDER BY temperature_data.datetime DESC`;

		let temperatureQueryResult: QueryResult = await DbClient.query(temperatureQuery, [waterBodyId]);
		let temperatureData: Array<TemperatureInfo> = new Array();

		if (temperatureQueryResult.rowCount != 0) {
			for (let row of temperatureQueryResult.rows) {
				let temperatureInfo = new TemperatureInfo(
					row.date,
					row.time,
					Number(row.temperature),
					Number(row.water_body_id)
				);

				temperatureData.push(temperatureInfo);
			}
		}

		return Promise.resolve(temperatureData);
	}
}