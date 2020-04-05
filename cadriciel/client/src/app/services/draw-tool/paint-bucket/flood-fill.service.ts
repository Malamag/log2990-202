import { Injectable } from '@angular/core';
import { Point } from '../point';
import { Pixel } from './pixel';

@Injectable({
  providedIn: 'root'
})
export class FloodFillService {

  /* TODO: APA6e
    https://jamesonyu.wordpress.com/2015/05/01/flood-fill-algorithm-javascript/
  */
  floodFill(
    ctx: CanvasRenderingContext2D,
    startPoint: Point,
    color: number[],
    targetColor: number[],
    tolerance: number): Point[] | undefined {

    const CANVAS_WIDTH = ctx.canvas.width;
    const CANVAS_HEIGHT = ctx.canvas.height;

    startPoint.x = Math.round(startPoint.x) - 1;
    startPoint.y = Math.round(startPoint.y) - 1;
    const EXTREME_POINTS: Point[] = [];
    const IMG_DATA: ImageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const PIXEL_STACK: Pixel[] = [];
    PIXEL_STACK.push(startPoint);

    while (PIXEL_STACK.length) {

      const nextPixel: Pixel | undefined = PIXEL_STACK.pop();
      if (!nextPixel) { return; }

      let goUp = true;
      let goDown = true;
      let goLeft = false;
      let goRight = false;

      // RGBA has a length of 4. We need to invrement 4 times to get the next pixel's position in the image data array

      while (goUp && nextPixel.y > 0) {
        nextPixel.y--;
        goUp = this.matchesTolerance(this.getColorAtPixel(IMG_DATA, nextPixel), tolerance, color);
      }

      while (goDown && nextPixel.y < CANVAS_HEIGHT) {

        this.colorPixels(IMG_DATA, nextPixel, color);
        if (nextPixel.x - 1 >= 0 &&
          this.matchesTolerance(this.getColorAtPixel(IMG_DATA, { x: nextPixel.x - 1, y: nextPixel.y }), tolerance, color)) {

          if (!goLeft) {
            goLeft = true;
            const NEXT_PIX: Pixel = { x: nextPixel.x - 1, y: nextPixel.y };
            PIXEL_STACK.push(NEXT_PIX);
            EXTREME_POINTS.push(new Point(NEXT_PIX.x, NEXT_PIX.y));
          }
        } else {
          goLeft = false;
        }

        if (nextPixel.x + 1 < CANVAS_WIDTH &&
          this.matchesTolerance(this.getColorAtPixel(IMG_DATA, { x: nextPixel.x + 1, y: nextPixel.y }), tolerance, color)) {

          if (!goRight) {
            const NEXT_PIX: Pixel = { x: nextPixel.x + 1, y: nextPixel.y };
            PIXEL_STACK.push(NEXT_PIX);
            EXTREME_POINTS.push(new Point(nextPixel.x, nextPixel.y));
            goRight = true;
          }
        } else {
          goRight = false;
        }
        nextPixel.y++;
        goDown = this.matchesTolerance(this.getColorAtPixel(IMG_DATA, { x: nextPixel.x, y: nextPixel.y }), tolerance, color);
        if (nextPixel.y === CANVAS_HEIGHT) {
          goDown = false;
        }

        if (!goDown) {
          EXTREME_POINTS.push(new Point(nextPixel.x, nextPixel.y));
        }
      }
    }
    return EXTREME_POINTS;
  }

  fillRegion(): void {
    /* Fills the determined region with some svg stuff*/
  }

  matchesTolerance(clickedColor: number[], tolerance: number, targetColor: number[]): boolean {
    if (
      clickedColor[0] === targetColor[0] &&
      clickedColor[1] === targetColor[1] &&
      clickedColor[2] === targetColor[2]) {
      return false;
    }

    const BASIS = 255;
    const R_MATCHES = Math.abs(clickedColor[0] - targetColor[0]) / BASIS >= tolerance;
    const G_MATCHES = Math.abs(clickedColor[1] - targetColor[1]) / BASIS >= tolerance;
    const B_MATCHES = Math.abs(clickedColor[2] - targetColor[2]) / BASIS >= tolerance;

    return R_MATCHES && G_MATCHES && B_MATCHES;

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
