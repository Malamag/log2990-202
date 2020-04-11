import { TestBed } from '@angular/core/testing';
import { Point } from '../point';
import { BucketToolService } from './bucket-tool.service';

fdescribe('BucketToolService', () => {
  const PATH = [new Point(0, 0), new Point(1, 0), new Point(2, 0), new Point(1, 1), new Point(1, 2)];
  const TEST_RGBA = [0, 0, 0, 0];
  // tslint:disable-next-line: no-any
  let canvasContextStub: any;
  // tslint:disable-next-line: no-any
  let fakeData: any;
  let service: BucketToolService;
  beforeEach(() => {
    fakeData = {
      data: [0, 0, 0, 0],
    };

    canvasContextStub = {
      getImageData: () => fakeData
    };

    TestBed.configureTestingModule({
      providers: [

        { provide: HTMLElement, useValue: {} },
        { provide: Boolean, useValue: false },
        { provide: Number, useValue: 0 },
        { provide: String, useValue: '' },
        { provide: CanvasRenderingContext2D, useValue: canvasContextStub },
        { provide: Uint8ClampedArray, useValue: fakeData },
      ]
    });

    service = TestBed.get(BucketToolService);
    spyOn(service.colorPick.colorConvert, 'hexToRgba').and.returnValue(TEST_RGBA);
    // tslint:disable-next-line: no-string-literal
    spyOn(service['floodFill'], 'floodFill').and.returnValue(PATH);
  });

  it('should be created', () => {
    const testService: BucketToolService = TestBed.get(BucketToolService);
    expect(testService).toBeTruthy();
  });

  it('should transform the choosen primary color hex to rgba array on mouse down', () => {
    spyOn(service, 'createPath').and.returnValue('');

    const START_PT = new Point(0, 0);
    service.down(START_PT);
    expect(service.colorPick.colorConvert.hexToRgba).toHaveBeenCalled();
  });

  it('should get the image data of the clicked pixel on defined context', () => {

    service.canvasContext = canvasContextStub;
    const SPY = spyOn(canvasContextStub, 'getImageData').and.returnValue(fakeData);
    const START_PT = new Point(0, 0);
    service.down(START_PT);
    expect(SPY).toHaveBeenCalledWith(START_PT.x, START_PT.y, 1, 1); // w & h = 1 for a single pixel
  });

  it('should call a flood fill with start point, tolerance, canvas, color and starting point data', () => {

    const START_PT = new Point(0, 0);
    // tslint:disable-next-line: no-string-literal

    const TEST_TOLERANCE = 0.5;
    service.canvasContext = canvasContextStub;
    service.down(START_PT);
    const RGB = [0, 0, 0];
    // tslint:disable-next-line: no-string-literal
    expect(service['floodFill'].floodFill).toHaveBeenCalledWith(canvasContextStub, START_PT, RGB, TEST_RGBA, TEST_TOLERANCE);
  });
});
