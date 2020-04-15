import { TestBed } from '@angular/core/testing';
import { Point } from '../point';
import { FloodFillService } from './flood-fill.service';
import { Pixel } from './pixel';

fdescribe('FloodFillService', () => {
  let service: FloodFillService;
  // tslint:disable-next-line: no-any
  let fakeData: any;
  // tslint:disable-next-line: no-any
  let ctxStub: any;
  // tslint:disable-next-line: no-any
  let canvasStub: any;
  const FULL = 255;
  const HALF = 128;
  beforeEach(() => {
    canvasStub = {
      width: 2,
      height: 2
    };

    ctxStub = {
      canvas: canvasStub,
      getImageData: () => fakeData
    };
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
      providers: [
        { provide: ImageData, useValue: fakeData },
        { provide: CanvasRenderingContext2D, useValue: ctxStub }]
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

  it('should return true on 50% tolerance on two close colors', () => {
    const PIXEL_COLOR_VALUE = 50;
    const CLICKD_COLOR_VALUE = 60;

    const FILL_COLOR = [0, 0, 0];
    const PIXEL_COLOR = [PIXEL_COLOR_VALUE, PIXEL_COLOR_VALUE, PIXEL_COLOR_VALUE];
    const CLICKD_COLOR = [CLICKD_COLOR_VALUE, CLICKD_COLOR_VALUE, CLICKD_COLOR_VALUE];
    const TOLERANCE = 0.5;
    const TEST_MATCH = service.matchesTolerance(CLICKD_COLOR, TOLERANCE, PIXEL_COLOR, FILL_COLOR);

    expect(TEST_MATCH).toBe(true);
  });

  it('should return the current points to color on undefined current pixel', () => {
    const TEST_PTS: Pixel[] = service.floodFill(ctxStub, new Point(0, 0), [0, 0, 0], [0, 0, 0], 1);
    const EXP_PIXEL: Pixel = { x: -1, y: -1 };
    expect(TEST_PTS).toEqual([EXP_PIXEL]);
  });

  it('should flood-fill all the points on 100% tolerance', () => {
    const CLICKED_COLOR = [FULL, FULL, FULL];
    const FILL_COLOR = [0, 0, 0];
    const TOL = 1;
    const START = new Point(1, 1); // smallest start value, top left corner
    const TEST_PTS = service.floodFill(ctxStub, START, CLICKED_COLOR, FILL_COLOR, TOL);
    const EXP_PTS: Pixel[] = [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
      { x: 1, y: 1 }
    ];
    expect(TEST_PTS).toEqual(EXP_PTS);
  });

  it('should flood-fill the central pixels of an area', () => {
    const DATA_3X3 = [ // we need to build a 3x3 image data to have 1 central pixel
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      HALF, 0, 0, 0,
      HALF, HALF, HALF, HALF,
      FULL, FULL, 0, 0,
      HALF, HALF, FULL, FULL,
      0, 0, 0, 0];

    const NEW_DIM = 3;
    fakeData.data = DATA_3X3;
    fakeData.width = NEW_DIM;
    fakeData.height = NEW_DIM;
    canvasStub.width = NEW_DIM;
    canvasStub.height = NEW_DIM;

    const CLICKED_COLOR = [FULL, FULL, FULL];
    const FILL_COLOR = [0, 0, 0];
    const TOL = 1;
    const START = new Point(2, 2); // central point of a 3 x 3 matrix
    const EXP_PTS: Pixel[] = [
      { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 },
      { x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 },
      { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }
    ];
    const TEST_PTS = service.floodFill(ctxStub, START, FILL_COLOR, CLICKED_COLOR, TOL);

    expect(TEST_PTS).toEqual(EXP_PTS);
  });
});
