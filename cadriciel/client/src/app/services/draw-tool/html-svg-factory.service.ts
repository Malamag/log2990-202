export class HtmlSvgFactory {

  static svgRectangle(id: string | null, className: string | null, startX: number, startY: number, width: number,
    height: number, fill: string, stroke: string, strokeWidth: number, dashArray: number | null) {
    let rectangle = "";
    rectangle += "<rect ";
    if (id) {
      rectangle += `id="${id}"`;
    }
    if (className) {
      rectangle += `class="${className}"`;
    }
    rectangle += `x="${startX}" y="${startY}"`;
    rectangle += `width="${width}" height="${height}"`;
    rectangle += `fill="rgba(${fill})"`;
    rectangle += `stroke="rgba(${stroke})" stroke-width="${strokeWidth}"`;
    if (dashArray) {
      rectangle += `stroke-dasharray="${dashArray},${dashArray}"`;
    }
    rectangle += "/>";

    return rectangle;
  }
  static svgDetailedCircle(nbOfLayers: number, centerX: number, centerY: number, radius: number[], fill: string[],
    stroke: string[], strokeWidth: number[]) {

    let lengthTest: number[] = [radius.length, fill.length, stroke.length, strokeWidth.length];
    let allEquals: boolean = lengthTest.every(e => e == nbOfLayers);

    if (!allEquals) {
      return this.svgCircle(centerX, centerY, 10, "255,20,147", "255,20,100", 2);
    }

    let detailedCircle = "";
    for (let i = 0; i < nbOfLayers; i++) {
      detailedCircle += this.svgCircle(centerX, centerY, radius[i], fill[i], stroke[i], strokeWidth[i]);
    }
    return detailedCircle;
  }
  static svgCircle(centerX: number, centerY: number, radius: number, fill: string, stroke: string, strokeWidth: number) {
    let circle = "";
    circle += "<circle ";
    circle += `cx="${centerX}" cy="${centerY}"`;
    circle += `r="${radius}"`;
    circle += `fill="rgba(${fill})"`;
    circle += `stroke="rgba(${stroke})" stroke-width="${strokeWidth}"`;
    circle += "/>";
    return circle;
  }

  static svgPath() {
    return "";
  }
}
