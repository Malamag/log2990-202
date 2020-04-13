import { Injectable } from '@angular/core';
import { Point } from '../point';
import { Pixel } from './pixel';

@Injectable({
  providedIn: 'root'
})
export class FloodFillService {

  /* TODO: APA6e
    https://codepen.io/Geeyoam/pen/vLGZzG
    https://jamesonyu.wordpress.com/2015/05/01/flood-fill-algorithm-javascript/
  */
  floodFill(
    ctx: CanvasRenderingContext2D,
    startPoint: Point,
    color: number[],
    choosenColor: number[],
    tolerance: number): Point[] {

    const CANVAS_WIDTH = ctx.canvas.width;
    const CANVAS_HEIGHT = ctx.canvas.height;

    startPoint.x = Math.round(startPoint.x) - 1;
    startPoint.y = Math.round(startPoint.y) - 1;
    const POINTS_TO_COLOR: Pixel[] = [];
    const IMG_DATA: ImageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // we use an interface to save memory - we dont need a full Point() object...
    const PIXEL_STACK: Pixel[] = [];

    PIXEL_STACK.push(startPoint);

    while (PIXEL_STACK.length) {

      const nextPixel: Pixel | undefined = PIXEL_STACK.pop();
      if (!nextPixel) { return POINTS_TO_COLOR; }

      let goUp = true;
      let goDown = true;
      let goLeft = false;
      let goRight = false;

      while (goUp && nextPixel.y > 0) {
        nextPixel.y--;
        goUp = this.matchesTolerance(this.getColorAtPixel(IMG_DATA, nextPixel), tolerance, color, choosenColor);
      }

      while (goDown && nextPixel.y < CANVAS_HEIGHT) {
        this.colorPixels(IMG_DATA, nextPixel, choosenColor);
        POINTS_TO_COLOR.push({ x: nextPixel.x, y: nextPixel.y });

        if (nextPixel.x - 1 >= 0 &&
          this.matchesTolerance(this.getColorAtPixel(IMG_DATA, { x: nextPixel.x - 1, y: nextPixel.y }), tolerance, color, choosenColor)) {

          if (!goLeft) {
            goLeft = true;
            const NEXT_PIX: Pixel = { x: nextPixel.x - 1, y: nextPixel.y };
            PIXEL_STACK.push(NEXT_PIX);
          }
        } else {
          goLeft = false;
        }

        if (nextPixel.x + 1 < CANVAS_WIDTH &&
          this.matchesTolerance(this.getColorAtPixel(IMG_DATA, { x: nextPixel.x + 1, y: nextPixel.y }), tolerance, color, choosenColor)) {

          if (!goRight) {
            const NEXT_PIX: Pixel = { x: nextPixel.x + 1, y: nextPixel.y };
            PIXEL_STACK.push(NEXT_PIX);
            goRight = true;
          }
        } else {
          goRight = false;
        }
        nextPixel.y++;
        goDown = this.matchesTolerance(this.getColorAtPixel(IMG_DATA, { x: nextPixel.x, y: nextPixel.y }), tolerance, color, choosenColor);
        if (nextPixel.y === CANVAS_HEIGHT) {
          goDown = false;
        }
      }
    }
    return POINTS_TO_COLOR;
  }

  matchesTolerance(clickedColor: number[], tolerance: number, colorAtPixel: number[], choosenColor: number[]): boolean {
    if (
      choosenColor[0] === clickedColor[0] &&
      choosenColor[1] === clickedColor[1] &&
      choosenColor[2] === clickedColor[2]) {
      return false;
    }

    const BASIS = 255;

    const R_MATCHES = Math.abs((clickedColor[0] - colorAtPixel[0]) / BASIS) <= tolerance;
    const G_MATCHES = Math.abs((clickedColor[1] - colorAtPixel[1]) / BASIS) <= tolerance;
    const B_MATCHES = Math.abs((clickedColor[2] - colorAtPixel[2]) / BASIS) <= tolerance;

    return (R_MATCHES && G_MATCHES && B_MATCHES);

  }

  getColorAtPixel(imgData: ImageData, pixel: Pixel): number[] {
    const NEXT_INDEX = 4;
    const R = imgData.data[NEXT_INDEX * (imgData.width * pixel.y + pixel.x)];
    const G = imgData.data[NEXT_INDEX * (imgData.width * pixel.y + pixel.x) + 1];
    const B = imgData.data[NEXT_INDEX * (imgData.width * pixel.y + pixel.x) + 2];
    return [R, G, B];
  }

  colorPixels(imgData: ImageData, pixel: Pixel, fillColor: number[]): void {
    const NEXT_INDEX = 4;
    imgData.data[NEXT_INDEX * (imgData.width * pixel.y + pixel.x)] = fillColor[0];
    imgData.data[NEXT_INDEX * (imgData.width * pixel.y + pixel.x) + 1] = fillColor[1];
    imgData.data[NEXT_INDEX * (imgData.width * pixel.y + pixel.x) + 2] = fillColor[2];
  }

}
