import {DbClient} from '../server';
import {HumidityInfo} from '../models/humidity_info.model';

export class HumidityController {
	static async getHumidityData(waterBodyId: number): Promise<Array<HumidityInfo>> {
		let humidityQuery = 
		"SELECT to_char(humidity_data.datetime, 'DD-MM-YYYY') AS date, "
		+ "to_char(humidity_data.datetime, 'HH24:MI:SS') AS time, "
		+ "humidity_data.humidity " 
		+ "FROM water_bodies INNER JOIN humidity_data ON "
		+ "water_bodies.id=humidity_data.water_body_id "
		+ "AND humidity_data.water_body_id=$1 "
		+ "ORDER BY humidity_data.datetime DESC";

		let queryResult = await DbClient.query(humidityQuery, [waterBodyId]);
		let humidityData = new Array<HumidityInfo>();

		if (queryResult.rowCount != 0) {
			for (let row of queryResult.rows) {
				let humidityInfo = new HumidityInfo(
					row.date,
					row.time,
					row.humidity,
					waterBodyId
				);

				humidityData.push(humidityInfo);
			}
		}

		return Promise.resolve(humidityData);
	}
}