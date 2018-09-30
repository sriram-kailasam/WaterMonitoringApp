import {WaterBody} from "./../models/water_body.model";
import {Request, Response, NextFunction} from "express";
import {DbClient} from "../server";
import {TemperatureInfo} from "../models/temperature_info.model";
import {HumidityInfo} from "../models/humidity_info.model";
import {QueryResult} from "pg";
import {TemperatureController} from "./temperature.contoller";
import {HumidityController} from "./humidity.controller";

export class WaterBodyController {
	static async listAllWaterBodies(req: Request, res: Response) {
		let waterBodyList = await WaterBodyController.getAllWaterBodies();

		res.render("water_body_list", {waterBodyList: waterBodyList});
	}

	static async showWaterBody(req: Request, res: Response, next: NextFunction) {
		let id = req.params.id;

		let name: string;
		try {
			name = await WaterBodyController.getWaterBodyName(id);
		} catch (error) {
			next();
			return;
		};

		let waterBody =
			new WaterBody(id, name);

		let temperatureData = await TemperatureController.getTemperatureData(id);
		let humidityData = await HumidityController.getHumidityData(id);

		res.render("water_body", {
			waterBody: waterBody, 
			temperatureData: temperatureData,
			humidityData: humidityData
		});
	}

	static async showWaterBodyTemperature(req: Request, res: Response) {
		let waterBodyId = req.params.id;

		let waterBodyName = await WaterBodyController.getWaterBodyName(waterBodyId);
		let temperatureData: Array<TemperatureInfo> = 
			await TemperatureController.getTemperatureData(waterBodyId);

		res.render('water_body_temperature', {
			waterBodyId: waterBodyId,
			waterBodyName: waterBodyName,
			temperatureData: temperatureData
		});
	}
	
	static async showWaterBodyHumidity(req: Request, res: Response) {
		let waterBodyId = req.params.id;

		let waterBodyName = await WaterBodyController.getWaterBodyName(waterBodyId);
		let humidityData: Array<HumidityInfo> = 
			await HumidityController.getHumidityData(waterBodyId);

		res.render('water_body_humidity', {
			waterBodyName: waterBodyName,
			humidityData: humidityData
		});
	}

	static async getWaterBodyJSON(req: Request, res: Response) {
		let waterBodyId: number = Number(req.params.id);
		let waterBody;
		try {
			waterBody = await WaterBodyController.getWaterBody(waterBodyId);
		} catch (error) {
			console.error(error);
			res.json({
				message: `Water body with id ${waterBodyId} not found`
			});

			return;
		}

		res.json(waterBody);
	}

	static async getWaterBodyTemperatureJSON(req: Request, res: Response) {
		let waterBodyId = Number(req.params.id);

		let waterBodyName = await WaterBodyController.getWaterBodyName(waterBodyId);
		let temperatureData = await TemperatureController.getTemperatureData(waterBodyId);

		res.json({
			name: waterBodyName,
			data: temperatureData
		});
	}

	private static async getWaterBody(waterBodyId: number) {
		const query = 
			`SELECT
			to_char(temperature_data.datetime, 'DD-MM-YYYY') AS date,
			to_char(temperature_data.datetime, 'HH:MI:SS') AS time, 
			temperature_data.temperature,
			humidity_data.humidity
			FROM water_bodies 
			INNER JOIN temperature_data ON water_bodies.id=temperature_data.water_body_id
			INNER JOIN humidity_data ON water_bodies.id=humidity_data.water_body_id
			AND temperature_data.datetime=humidity_data.datetime
			AND temperature_data.water_body_id=$1
			AND humidity_data.water_body_id=$1
			ORDER BY temperature_data.datetime DESC`;

		let queryResult: QueryResult = await DbClient.query(query, [waterBodyId]);

		let name = await WaterBodyController.getWaterBodyName(waterBodyId);
		let arr = [];

		for (let row of queryResult.rows) {
			arr.push(row);
		}

		return {
			name: name,
			data: arr
		}
	}

	private static async getWaterBodyName(waterBodyId: number): Promise<string> {
		const nameQuery = "SELECT id, name FROM water_bodies WHERE id=$1";
		let nameQueryResult: QueryResult = await DbClient.query(nameQuery, [waterBodyId]);

		if (nameQueryResult.rowCount == 0) {
			return Promise.reject<string>(`Cannot find name of water body with id ${waterBodyId}`);
		}

		return Promise.resolve(nameQueryResult.rows[0].name);
	}

	private static async getAllWaterBodies(): Promise<Array<WaterBody>> {
		const query = "SELECT id, name FROM water_bodies";
		let waterBodyList: Array<WaterBody> = new Array();

		let queryResult = await DbClient.query(query);
		for (let row of queryResult.rows) {
			waterBodyList.push(new WaterBody(Number(row.id), row.name));
		}

		return waterBodyList;
	}
}