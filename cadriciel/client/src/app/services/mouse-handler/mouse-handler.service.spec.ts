import { TestBed,  } from '@angular/core/testing';
import { Point } from '../draw-tool/point';
import { InputObserver } from '../draw-tool/input-observer';


import { MouseHandlerService } from './mouse-handler.service';

describe('MouseHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers:[Point, InputObserver, ]
  }));
  beforeEach(()=>{
    // to initialise the HTML elements
    /*let svg: HTMLElement = new HTMLElement();
    let workingSpace: HTMLElement = new HTMLElement();
    const mouseService : MouseHandlerService = new MouseHandlerService(svg, workingSpace);*/
    
  });

  it('should be created', () => {
    /*let svg: HTMLElement = new HTMLElement();
    let workingSpace: HTMLElement = new HTMLElement();
    const mouseService : MouseHandlerService = new MouseHandlerService(svg, workingSpace);*/
    const service = TestBed.get(MouseHandlerService);
    expect(service).toBeTruthy();
  });
});
