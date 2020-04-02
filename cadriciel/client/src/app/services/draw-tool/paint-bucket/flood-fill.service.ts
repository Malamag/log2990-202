import { Injectable } from '@angular/core';
import { Point } from '../point';

@Injectable({
  providedIn: 'root'
})
export class FloodFillService {

  ctx: CanvasRenderingContext2D;
  colorBelow: number[];
  tolerance: number;

  imageMap: Map<Point, number[]>;
  private readonly basis: number = 255;

  constructor() {
    this.imageMap = new Map();
  }

  floodFill(point: Point, color: number[], targetColor: number[]): void {
    this.colorBelow = this.checkColorDataAtPoint(point);

    if (this.respectsTolerance() && this.isColor(color)) {
      return;
    }

    if (!this.isColor(targetColor)) {
      return;
    }

    this.imageMap.set(point, color);

    this.floodFill(new Point(point.x + 1, point.y), color, targetColor);
    this.floodFill(new Point(point.x - 1, point.y), color, targetColor);
    this.floodFill(new Point(point.x, point.y - 1), color, targetColor);
    this.floodFill(new Point(point.x, point.y + 1), color, targetColor);
  }

  fillRegion(): void {
    /* Fills the determined region with some svg stuff*/
  }

  checkColorDataAtPoint(position: Point): number[] {
    const COLOR_NUMS: number[] = [];
    const COLOR_ARR = this.ctx.getImageData(position.x, position.y, 1, 1).data;
    COLOR_ARR.forEach((colorNum: number) => {
      COLOR_NUMS.push(colorNum);
    });

    return COLOR_NUMS;
  }

  respectsTolerance(): boolean {
    return (
      this.colorBelow[0] / this.basis < this.tolerance &&
      this.colorBelow[1] / this.basis < this.tolerance &&
      this.colorBelow[2] / this.basis < this.tolerance);
  }

  isColor(color: number[]): boolean {
    return (
      this.colorBelow[0] === color[0] &&
      this.colorBelow[1] === color[1] &&
      this.colorBelow[2] === color[2]);
  }

}
