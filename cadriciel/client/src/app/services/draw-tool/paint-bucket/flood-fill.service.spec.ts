import { TestBed } from '@angular/core/testing';

import { FloodFillService } from './flood-fill.service';
import { Pixel } from './pixel';

fdescribe('FloodFillService', () => {
  let service: FloodFillService;
  // tslint:disable-next-line: no-any
  let fakeData: any;
  const FULL = 255;
  const HALF = 128;
  beforeEach(() => {

    /**
     * Represents the image data of a 2x2 pixels square
     * Replaces the Uint8ClampedArray and shows R, G, B & Alpha
     */
    fakeData = {
      data: [
        0, 0, 0, 0, // pixel (0, 0)
        0, 0, 0, 0, // pixel (1, 0)
        FULL, FULL, FULL, FULL, // pixel (0, 1)
        HALF, HALF, HALF, HALF], // pixel (1, 1)
      width: 2,
      height: 2
    };
    TestBed.configureTestingModule({
      providers: [{ provide: ImageData, useValue: fakeData }]
    });

    service = TestBed.get(FloodFillService);
  });

  it('should be created', () => {
    const testService: FloodFillService = TestBed.get(FloodFillService);
    expect(testService).toBeTruthy();
  });

  it('should get the correct RGB color at the selected pixel', () => {
    const TEST_PIXEL: Pixel = { x: 0, y: 1 };
    const TEST_ARR = service.getColorAtPixel(fakeData, TEST_PIXEL);
    expect(TEST_ARR).toEqual([FULL, FULL, FULL]);
  });

  it('should color the pixel at the right position', () => {
    const NEW_COLOR_VAL = 75;
    const NEW_COLOR = [NEW_COLOR_VAL, NEW_COLOR_VAL, NEW_COLOR_VAL];
    const TEST_PIXEL: Pixel = { x: 0, y: 0 };
    service.colorPixels(fakeData, TEST_PIXEL, NEW_COLOR);

    const GOTTEN_COLOR = service.getColorAtPixel(fakeData, TEST_PIXEL);
    expect(GOTTEN_COLOR).toEqual(NEW_COLOR);
  });

  it('should return false on tolerance match if the clicked color is the same as the filling color', () => {
    const CLICK_COL_VALUE = 25;
    const CLICK_COLOR = [CLICK_COL_VALUE, CLICK_COL_VALUE, CLICK_COL_VALUE];
    const COLOR_AT_PIXEL = [0, 0, 0];

    const TEST_TOLERANCE = 1;
    const MATCHES_FULL_TOL = service.matchesTolerance(CLICK_COLOR, TEST_TOLERANCE, COLOR_AT_PIXEL, CLICK_COLOR);
    expect(MATCHES_FULL_TOL).toBe(false);

  });

  it
});
