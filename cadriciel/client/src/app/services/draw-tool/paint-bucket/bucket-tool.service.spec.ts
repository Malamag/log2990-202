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
  // tslint:disable-next-line: no-any
  let canvasStub: any;
  let service: BucketToolService;
  beforeEach(() => {
    canvasStub = {
      getContext: () => canvasContextStub
    };

    fakeData = {
      data: [0, 0, 0, 0],
    };

    canvasContextStub = {
      getImageData: () => fakeData
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: HTMLCanvasElement, useValue: canvasStub },
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

  it('should get the tolerace percentage and divide by 100 on subscription activation', () => {
    const TEST_TOLERANCE = 75;
    const PERCENT = 100;
    service.updateAttributes();
    service.interaction.emitToleranceValue(TEST_TOLERANCE);
    expect(service.tolerance).toEqual(TEST_TOLERANCE / PERCENT);
  });

  it('should recieve a canvas context on subscription activation', () => {
    service.updateAttributes();
    service.interaction.emitCanvasContext(canvasStub);
    expect(service.canvasContext).toEqual(canvasContextStub);
  });

  it('should create a valid path', () => {

  });

  it('should return a path having the named bucket-fill', () => {

  });

  it('should give the path the default and selected attribute', () => {

  });

  it('should skip the path concatenation on contiguous x pixels', () => {

  });

  it('should move the path point on uncontiguous x pixels', () => { })

  it('should contain the unimplemented methods signatures', () => { // running unimplemented methods - coverage purposes
    expect(service.up()).toBe();
    expect(service.move(new Point(0, 0))).toBe();
    expect(service.updateDown()).toBe();
    expect(service.updateUp()).toBe();
    expect(service.cancel()).toBe();
    expect(service.doubleClick()).toBe();
    expect(service.goingOutsideCanvas()).toBe();
    expect(service.goingInsideCanvas()).toBe();
  });

});
