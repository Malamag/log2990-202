import { Injectable } from '@angular/core';
import { Point } from '../point';

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
    canvasWidth: number,
    canvasHeight: number,
    tolerance: number): void {
    const NEXT_INDEX = 4;

    const IMG_DATA: ImageData = ctx.getImageData(startPoint.x, startPoint.y, canvasWidth, canvasHeight);

    const PIXEL_STACK: Point[] = [];
    PIXEL_STACK.push(startPoint);

    while (PIXEL_STACK.length) {

      const nextPixel: Point | undefined = PIXEL_STACK.pop();
      if (!nextPixel) { return; }

      let goLeft: boolean;
      let goRight: boolean;

      // RGBA has a length of 4. We need to invrement 4 times to get the next pixel's position in the image data array
      let pixelPosition = (nextPixel.y * canvasWidth + nextPixel.x) * NEXT_INDEX;

      while (nextPixel.y-- >= 0 && this.matchesTolerance(IMG_DATA, pixelPosition, tolerance, targetColor)) {
        pixelPosition -= canvasWidth * NEXT_INDEX;
      }

      pixelPosition += canvasWidth * NEXT_INDEX;
      ++nextPixel.y;
      goLeft = false;
      goRight = false;

      while (nextPixel.y++ < canvasHeight - 1 && this.matchesTolerance(IMG_DATA, pixelPosition, tolerance, targetColor)) {

        this.colorPixels(IMG_DATA, pixelPosition, color);

        if (nextPixel.x > 0) {
          if (this.matchesTolerance(IMG_DATA, pixelPosition - NEXT_INDEX, tolerance, targetColor)) {
            if (!goLeft) {
              console.log('Coloring ');
              PIXEL_STACK.push(new Point(nextPixel.x - 1, nextPixel.y));
              goLeft = true;
            }

          } else if (goLeft) {
            goLeft = false;
          }
        }

        if (nextPixel.x < canvasWidth - 1) {
          if (this.matchesTolerance(IMG_DATA, pixelPosition, tolerance, targetColor)) {
            if (!goRight) {
              PIXEL_STACK.push(new Point(nextPixel.x + 1, nextPixel.y));
              goRight = true;
            }

          } else if (goRight) {
            goRight = false;
          }
        }

        pixelPosition += canvasWidth * NEXT_INDEX;

      }
    }
    ctx.putImageData(IMG_DATA, 0, 0); // instead of this, we will need to create a svg element with fillRegion()
  }

  fillRegion(): void {
    /* Fills the determined region with some svg stuff*/
  }

  matchesTolerance(imgData: ImageData, position: number, tolerance: number, targetColor: number[]): boolean {
    const R = imgData.data[position];
    const G = imgData.data[position + 1];
    const B = imgData.data[position + 2];
    const BASIS = 255;

    const R_MATCHES = Math.abs(R - targetColor[0]) / BASIS <= tolerance;
    const G_MATCHES = Math.abs(G - targetColor[1]) / BASIS <= tolerance;
    const B_MATCHES = Math.abs(B - targetColor[2]) / BASIS <= tolerance;

    return R_MATCHES && G_MATCHES && B_MATCHES;

  }

  colorPixels(imgData: ImageData, position: number, fillColor: number[]): void {
    imgData.data[position] = fillColor[0];
    imgData.data[position + 1] = fillColor[1];
    imgData.data[position + 2] = fillColor[2];
  }

}
