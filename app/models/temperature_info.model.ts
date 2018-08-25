export class TemperatureInfo {
    minimumTemperature: number;
    maximumTemperature: number;
    waterBodyId: number;
    constructor (minimum_temperature: number, maximum_temperature: number, waterBodyId: number) {
        this.minimumTemperature = minimum_temperature;
        this.maximumTemperature = maximum_temperature;
        this.waterBodyId = waterBodyId;
    }
}