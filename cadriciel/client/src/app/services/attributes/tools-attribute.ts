// Only for pencil and brush
export class ToolsAttributes {
    lineThickness: number
    texture: number // only for the brush

    constructor(lineThickness: number, texture: number) {
        this.lineThickness = lineThickness
        this.texture = texture
    }
}
