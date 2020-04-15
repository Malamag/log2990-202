import { Injectable } from '@angular/core';
import { Point } from '../point';
import { Pixel } from './pixel';

@Injectable({
  providedIn: 'root'
})
export class FloodFillService {

  /* 
    This flood-fill algorithm and its methods are based on the following sources:

   1. Utilisateur Geeyoam. (Sans date). "Flood fill implementation". [En ligne]:
      https://codepen.io/Geeyoam/pen/vLGZzG

   2. YU, Jameson. (Mai 2015). "Flood fill algorithm (Javascript)". [En ligne]:
      https://jamesonyu.wordpress.com/2015/05/01/flood-fill-algorithm-javascript/
  */
  floodFill(ctx: CanvasRenderingContext2D, startPoint: Point, color: number[], choosenColor: number[], tolerance: number): Point[] {

    const CANVAS_WIDTH = ctx.canvas.width;
    const CANVAS_HEIGHT = ctx.canvas.height;

    startPoint.x = Math.round(startPoint.x) - 1;
    startPoint.y = Math.round(startPoint.y) - 1;

    const POINTS_TO_COLOR: Pixel[] = [];
    const IMG_DATA: ImageData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // we use an interface to save memory - we dont need a full new Point(x, y) object...
    const PIXEL_STACK: Pixel[] = [];

    PIXEL_STACK.push(startPoint);

    // will check every pixel in the area by successively pushing and popping them until none of them match tolerance/boundaries
    while (PIXEL_STACK.length) {

      const CURR_PIXEL: Pixel | undefined = PIXEL_STACK.pop();

      if (!CURR_PIXEL) { // undefined pixel - stop the algorithm and return the current array
        return POINTS_TO_COLOR;
      }

      let goUp = true;
      let goDown = true;
      let goLeft = false;
      let goRight = false;

      while (goUp && CURR_PIXEL.y > 0) { // go up as far as possible depending on dimensions and tolerance match
        CURR_PIXEL.y--;
        goUp = this.shouldFill(IMG_DATA, CURR_PIXEL, tolerance, color, choosenColor);
      }

      while (goDown && CURR_PIXEL.y < CANVAS_HEIGHT) {

        this.colorPixels(IMG_DATA, CURR_PIXEL, choosenColor); // going down - add the pixel and modifiy the values
        POINTS_TO_COLOR.push({ x: CURR_PIXEL.x, y: CURR_PIXEL.y });

        if (CURR_PIXEL.x - 1 >= 0 && this.shouldFill(IMG_DATA, { x: CURR_PIXEL.x - 1, y: CURR_PIXEL.y }, tolerance, color, choosenColor)) {

          if (!goLeft) {
            // cant go left anymore (limit reached). Add the pixel to the array to check its contiguous pixels
            const NEXT_PIX: Pixel = { x: CURR_PIXEL.x - 1, y: CURR_PIXEL.y };
            PIXEL_STACK.push(NEXT_PIX);
            goLeft = true;
          }
        } else {
          goLeft = false; // reinitializes the boolean value
        }

        if (CURR_PIXEL.x + 1 < CANVAS_WIDTH &&
          this.shouldFill(IMG_DATA, { x: CURR_PIXEL.x + 1, y: CURR_PIXEL.y }, tolerance, color, choosenColor)) {

          if (!goRight) { // cant go right anymore - add this pixel in the array
            const NEXT_PIX: Pixel = { x: CURR_PIXEL.x + 1, y: CURR_PIXEL.y };
            PIXEL_STACK.push(NEXT_PIX);
            goRight = true;
          }

        } else {
          goRight = false;
        }

        CURR_PIXEL.y++;

        goDown = this.shouldFill(IMG_DATA, CURR_PIXEL, tolerance, color, choosenColor);

      }
    }
    return POINTS_TO_COLOR;
  }

  matchesTolerance(clickedColor: number[], tolerance: number, colorAtPixel: number[], choosenColor: number[]): boolean {
    // the algorith
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

  shouldFill(
    imgData: ImageData,
    pixel: Pixel,
    tolerance: number,
    colorAtPixel: number[],
    choosenColor: number[]): boolean {
    return this.matchesTolerance(this.getColorAtPixel(imgData, pixel), tolerance, colorAtPixel, choosenColor);
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
