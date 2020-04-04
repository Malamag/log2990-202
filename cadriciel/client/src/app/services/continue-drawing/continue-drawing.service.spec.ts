import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SVGData } from '../../../../../svg-data';
import { ContinueDrawingService } from './continue-drawing.service';
import SpyObj = jasmine.SpyObj;
describe('ContinueDrawingService', () => {
  let render: SpyObj<Renderer2>;
  let service: ContinueDrawingService;
  // tslint:disable-next-line: no-any
  let nativeElemStub: any;
  // tslint:disable-next-line: no-any
  let elementStub: any;
  // tslint:disable-next-line: no-any
  let childElemStub: any;

  beforeEach(() => {
    childElemStub = {
      innerHTML: '<div>Hello World!</div>'
    };

    nativeElemStub = {
      children: [childElemStub, childElemStub, childElemStub]
    };

    elementStub = {
      nativeElement: nativeElemStub,
    };

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      providers: [
        { provide: Renderer2, useValue: render },
        { provide: ElementRef, useValue: elementStub }]
    });
  });

  beforeEach(() => {
    service = TestBed.get(ContinueDrawingService);
    render = jasmine.createSpyObj('Renderer2', ['createElement', 'appendChild']);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should ask for doodle and affect the children', () => {
    const ASK_SPY = spyOn(service.doodle, 'askForDoodle');

    service.doodle.currentDraw = elementStub;

    render.appendChild(service.doodle.currentDraw.nativeElement, childElemStub);
    const SVG_DATA: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello', 'hello'] };
    service.continueDrawingNoTimeOut(SVG_DATA);
    expect(childElemStub.innerHTML).toEqual('hello');
    expect(ASK_SPY).toHaveBeenCalled();
  });
  it('should affect empty innerhtml for undefined data', () => {
    service.doodle.currentDraw = elementStub;

    render.appendChild(service.doodle.currentDraw.nativeElement, childElemStub);
    const SVG_DATA: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: [] };
    service.continueDrawingNoTimeOut(SVG_DATA);
    expect(childElemStub.innerHTML).toEqual('');
  });
  it('should continue the drawing', async (done: DoneFn) => {
    service.doodle.currentDraw = elementStub;
    const LOAD_TIME = 15;
    const CONTINUE_SPY = spyOn(service, 'continueDrawingNoTimeOut');
    const SVG_DATA: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: [] };
    service.continueDrawing(SVG_DATA);
    setTimeout(() => {
      expect(CONTINUE_SPY).toHaveBeenCalled();
      done();
    }, LOAD_TIME);
  });
});
