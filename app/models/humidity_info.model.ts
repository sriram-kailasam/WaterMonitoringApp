export class HumidityInfo {
	date: string;
	time: string;
	humidity: number;
	waterBodyId: number;

	constructor(date: string,
				time: string,
				humidity: number,
				waterBodyId: number) {
					this.date = date;
					this.time = time;
					this.humidity = humidity;
					this.waterBodyId = waterBodyId;
				}

	toString() {
		return JSON.stringify({
			date: this.date,
			time: this.time,
			humidity: this.humidity,
			waterBodyId: this.waterBodyId
		});
	}
}