import {WaterBody} from "./../models/water_body.model";
import {Request, Response} from "express";
import {DbClient} from "../server";
import {TemperatureInfo} from "../models/temperature_info.model";
import {HumidityInfo} from "../models/humidity_info.model";
import {QueryResult} from "pg";
import {TemperatureController} from "./temperature.contoller";
import {HumidityController} from "./humidity.controller";

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

		let temperatureData = await TemperatureController.getTemperatureData(id);

		res.render("water_body", {
			waterBody: waterBody, 
			temperatureData: temperatureData
		});
	}

	static async showWaterBodyTemperature(req: Request, res: Response) {
		let waterBodyId = req.params.id;

		let waterBodyName = await WaterBodyController.getWaterBodyName(waterBodyId);
		let temperatureData: Array<TemperatureInfo> = 
			await TemperatureController.getTemperatureData(waterBodyId);

		res.render('water_body_temperature', {
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

	private static async getWaterBodyName(waterBodyId: number): Promise<string> {
		const nameQuery = "SELECT id, name FROM water_bodies WHERE id=$1";
		let nameQueryResult: QueryResult = await DbClient.query(nameQuery, [waterBodyId]);

		if (nameQueryResult.rowCount == 0) {
			return Promise.reject<string>(`Cannot find name of water body with id ${waterBodyId}`);
		}

		return Promise.resolve(nameQueryResult.rows[0].name);
	}
}