import {WaterBody} from "./../models/water_body.model";
import {Request, Response} from "express";
import {DbClient, SocketServer} from "../server";
import {TemperatureInfo} from "../models/temperature_info.model";
import {QueryResult} from "pg";

export class WaterBodyController {
	static async listAllWaterBodies(req: Request, res: Response) {
		const query = "SELECT id, name FROM water_bodies";
		let waterBodyList: Array<WaterBody> = new Array();

		let queryResult = await DbClient.query(query);
		for (let row of queryResult.rows) {
			waterBodyList.push(new WaterBody(Number(row.id), row.name));
		}

		res.render("water_body_list", {waterBodyList: waterBodyList});
	}

	static async showWaterBody(req: Request, res: Response) {
		let id = req.params.id;

		await DbClient.query("LISTEN temperature_change_channel");

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

		res.render("water_body", {waterBody: waterBody, temperatureData: temperatureData});

		SocketServer.once('connection', (socket) => {
			console.log('Socket client connected');
			DbClient.on("notification", (message) => {
				DbClient.removeAllListeners();
				let row = JSON.parse(String(message.payload));

				// Ugly way to get date and time from the payload using regular expressions 
				let dateRegex = new RegExp(/[0-9]{4}-[0-9]{2}-[0-9]{2}/);
				let timeRegex = new RegExp(/[0-9]{2}:[0-9]{2}:[0-9]{2}/);

				// Supppress null warnings
				let date = dateRegex.exec(row.datetime)![0].split('-').reverse().join('-');
				let time = timeRegex.exec(row.datetime)![0];

				let temperatureInfo = new TemperatureInfo(
					date,
					time,
					Number(row.minimum_temperature),
					Number(row.maximum_temperature),
					Number(row.water_body_id));

				if (socket.readyState == socket.OPEN) {
					socket.send(temperatureInfo.toString());
				}
			});		
		});
	}

	private static async getWaterBodyName(waterBodyId: number): Promise<string> {
		const nameQuery = "SELECT id, name FROM water_bodies WHERE id=$1";
		let nameQueryResult: QueryResult = await DbClient.query(nameQuery, [waterBodyId]);

		if (nameQueryResult.rowCount == 0) {
			return Promise.reject<string>(`Cannot find name of water body with id ${waterBodyId}`);
		}

		return Promise.resolve(nameQueryResult.rows[0].name);
	}

	private static async getTemperatureData(waterBodyId: number): Promise<Array<TemperatureInfo>> {
		const temperatureQuery =
			"SELECT to_char(temperature_data.datetime, 'DD-MM-YYYY') AS date, "
			+ "to_char(temperature_data.datetime, 'HH:MI:SS') AS time, " 
			+ "temperature_data.minimum_temperature, "
			+ "temperature_data.maximum_temperature "
			+ "FROM water_bodies INNER JOIN temperature_data ON "
			+ "water_bodies.id=temperature_data.water_body_id "
			+ "AND temperature_data.water_body_id=$1 "
			+ "ORDER BY temperature_data.datetime DESC";

		let temperatureQueryResult: QueryResult = await DbClient.query(temperatureQuery, [waterBodyId]);
		let temperatureData: Array<TemperatureInfo> = new Array();

		if (temperatureQueryResult.rowCount != 0) {
			for (let row of temperatureQueryResult.rows) {
				let temperatureInfo = new TemperatureInfo(
					row.date,
					row.time,
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