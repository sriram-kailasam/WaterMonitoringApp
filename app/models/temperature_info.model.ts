export class TemperatureInfo {
    date: string;
    time: string;
    minimumTemperature: number;
    maximumTemperature: number;
    waterBodyId: number;
    constructor (date: string, time: string, minimum_temperature: number, maximum_temperature: number, waterBodyId: number) {
        this.date = date;
        this.time = time;
        this.minimumTemperature = minimum_temperature;
        this.maximumTemperature = maximum_temperature;
        this.waterBodyId = waterBodyId;
    }

    toString() {
        return JSON.stringify({
            date: this.date,
            time: this.time,
            minimumTemperature: this.minimumTemperature,
            maximumTemperature: this.maximumTemperature,
            waterBodyId: this.waterBodyId
        });
    }
}