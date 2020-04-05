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
  it('should return an svg data with initial values', () => {
    localStorage.clear();
    const EXPECTED_RESULT: SVGData = {height: '775', width: '1438', bgColor: 'ffffff', innerHTML: ['', '', '', '', '', '']};
    const RESULT = service.getSVGData();
    expect(RESULT).toEqual(EXPECTED_RESULT);
  });
  it('should return an svg with the content of the local storage', () => {
    const HEIGHT = '1400';
    const WIDTH = '1500';
    const BACK_COLOR = 'ff00ff';
    const HTML_ELEM = ['hello', 'world', 'yes', 'indeed', 'hi', 'sir'];
    const EXPECTED_RET: SVGData = {height: HEIGHT, width: WIDTH, bgColor: BACK_COLOR, innerHTML: HTML_ELEM};
    localStorage.setItem('height', HEIGHT);
    localStorage.setItem('width', WIDTH);
    localStorage.setItem('color', BACK_COLOR);
    for (let i = 0; i < HTML_ELEM.length; ++i){
      localStorage.setItem('htmlElem' + i.toString(), HTML_ELEM[i]);
    }
    const RESULT = service.getSVGData();
    expect(RESULT).toEqual(EXPECTED_RET);
    localStorage.clear();
  });
  it('should get the data and continue the drawing', () => {
    const GET_SPY = spyOn(service, 'getSVGData');
    const CONTINUE_SPY = spyOn(service, 'continueDrawing');
    service.continueAutoSavedFromEntryPoint();
    expect(GET_SPY).toHaveBeenCalled();
    expect(CONTINUE_SPY).toHaveBeenCalled();
  });
  it('should call continue drawing no time out', () => {
    const CONTINUE_SPY = spyOn(service, 'continueDrawingNoTimeOut');
    service.continueAutoSavedFromDrawVue();
    expect(CONTINUE_SPY).toHaveBeenCalled();
  });
});
