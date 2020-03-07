// Only for pencil and brush
export class AerosolAttributes {
    emissionPerSecond: number
    diameter: number // only for the brush

    constructor(emissionPerSecond: number, diameter: number) {
        this.emissionPerSecond = emissionPerSecond
        this.diameter = diameter
    }
}