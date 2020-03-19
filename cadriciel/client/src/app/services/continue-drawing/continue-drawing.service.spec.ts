import { ElementRef, Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SVGData } from 'src/svg-data';
import { ContinueDrawingService } from './continue-drawing.service';
import SpyObj = jasmine.SpyObj;
describe('ContinueDrawingService', () => {
  let render: SpyObj<Renderer2>;
  let service: ContinueDrawingService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [{ provide: Renderer2, useValue: { render } }]
  })
  );
  beforeEach(() => {
    service = TestBed.get(ContinueDrawingService);
    render = jasmine.createSpyObj('Renderer2', ['createElement', 'appendChild']);
    //render = TestBed.get(Renderer2);

  });
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should set attributes and emit the redone for the canvas', () => {
    const askSpy = spyOn(service.doodle, 'askForDoodle');
    const parent = render.createElement('div');
    const ref = new ElementRef(parent);
    service.doodle.currentDraw = ref;
    const firstChild = render.createElement('div');
    render.appendChild(service.doodle.currentDraw.nativeElement, firstChild);
    const svgData: SVGData = { height: '2500', width: '1080', bgColor: 'white', innerHTML: ['hello', 'hello'] };
    service.continueDrawing(svgData);
    expect(firstChild.innerHTML).toEqual('hello');
    expect(askSpy).toHaveBeenCalled();
  });
});
