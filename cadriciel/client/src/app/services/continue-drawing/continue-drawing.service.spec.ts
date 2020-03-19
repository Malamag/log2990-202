import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SVGData } from 'src/svg-data';
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

  it('should set attributes and emit the redone for the canvas', () => {
    const askSpy = spyOn(service.doodle, 'askForDoodle');

    service.doodle.currentDraw = elementStub;

    render.appendChild(service.doodle.currentDraw.nativeElement, childElemStub);
    const svgData: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello', 'hello'] };
    service.continueDrawing(svgData);

    expect(childElemStub.innerHTML).toEqual('hello');
    expect(askSpy).toHaveBeenCalled();
  });
});
