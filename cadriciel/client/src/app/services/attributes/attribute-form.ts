export class FormsAttribute{
    poltType:number // 0:contour, 1:plein, 2: les deux
    lineThickness: number
    numberOfCorners: number // only for the polygone
    constructor(plotType: number, lineThickness:number, numberOfCorners: number){
        this.poltType = plotType
        this.lineThickness =lineThickness
        this.numberOfCorners =numberOfCorners
    } 
}