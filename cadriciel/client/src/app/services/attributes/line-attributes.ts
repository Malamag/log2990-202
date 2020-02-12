export class LineAttributes {
    junction: boolean
    lineThickness: number
    junctionDiameter: number

    constructor(junction: boolean, lineThickness: number, junctionDiameter: number) {
        this.junction = junction
        this.lineThickness = lineThickness
        this.junctionDiameter = junctionDiameter
    }
}
