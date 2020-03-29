export class HtmlSvgFactory {

  static svgRectangle(id: string | null, className: string | null, startX: number, startY: number, width: number,
                      height: number, fill: string, stroke: string, strokeWidth: number, dashArray: number | null): string {
    let rectangle = '';
    rectangle += '<rect ';
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
    rectangle += '/>';

    return rectangle;
  }
  static svgDetailedCircle(nbOfLayers: number, centerX: number, centerY: number, radius: number[], fill: string[],
                           stroke: string[], strokeWidth: number[]): string {

    const LENGTH_TEST: number[] = [radius.length, fill.length, stroke.length, strokeWidth.length];
    const ALL_EQUALS: boolean = LENGTH_TEST.every((e) => e === nbOfLayers);

    if (!ALL_EQUALS) {
      const RAD = 10;
      return this.svgCircle(centerX, centerY, RAD, '255,20,147', '255,20,100', 2);
    }

    let detailedCircle = '';
    for (let i = 0; i < nbOfLayers; i++) {
      detailedCircle += this.svgCircle(centerX, centerY, radius[i], fill[i], stroke[i], strokeWidth[i]);
    }
    return detailedCircle;
  }
  static svgCircle(centerX: number, centerY: number, radius: number, fill: string, stroke: string, strokeWidth: number): string {
    let circle = '';
    circle += '<circle ';
    circle += `cx="${centerX}" cy="${centerY}"`;
    circle += `r="${radius}"`;
    circle += `fill="rgba(${fill})"`;
    circle += `stroke="rgba(${stroke})" stroke-width="${strokeWidth}"`;
    circle += '/>';
    return circle;
  }

  static svgPath(): string {
    return '';
  }
}
