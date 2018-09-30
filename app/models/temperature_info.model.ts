export class TemperatureInfo {
    date: string;
    time: string;
    temperature: number;
    waterBodyId: number;
    constructor (date: string, time: string, temperature: number, waterBodyId: number) {
        this.date = date;
        this.time = time;
        this.temperature = temperature;
        this.waterBodyId = waterBodyId;
    }

    toString() {
        return JSON.stringify({
            date: this.date,
            time: this.time,
            temperature: this.temperature,
            waterBodyId: this.waterBodyId
        });
    }
}