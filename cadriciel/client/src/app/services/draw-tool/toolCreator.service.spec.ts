import { TestBed } from '@angular/core/testing';

import { ToolCreator } from './toolCreator';
/*import { RectangleService } from './rectangle.service';
import { PencilService } from './pencil.service';
import { LineService } from './line.service';
import { BrushService } from './brush.service';*/
import { InteractionService } from '../service-interaction/interaction.service';
import { ColorPickingService } from '../colorPicker/color-picking.service';

export class fakeCpService extends ColorPickingService {}
export class fakeItService extends InteractionService {}


describe('ToolCreator', () => {
  //let elem: HTMLElement;
  //let toolService: ToolCreator;
/*
  let penServiceSpy: jasmine.SpyObj<PencilService>;
  let brushServiceSpy: jasmine.SpyObj<BrushService>;
  let rectServiceSpy: jasmine.SpyObj<RectangleService>;
  let lineServiceSpy: jasmine.SpyObj<LineService>;*/

  beforeEach(() => {
    /*const penSpy = jasmine.createSpy("PencilService");
    const rectSpy = jasmine.createSpy("RectangleService");
    const lineSpy = jasmine.createSpy("LineService");
    const brushSpy = jasmine.createSpy("BrushService");*/
    
    TestBed.configureTestingModule({
      providers: [
        ToolCreator,
        {provide: HTMLElement, useValue: {}}
        ]   
    });
    
    //elem = TestBed.get(HTMLElement);
    //penServiceSpy = TestBed.get(PencilService);
  });
    

  it('should be created', () => {
    const service: ToolCreator = TestBed.get(ToolCreator);
    expect(service).toBeTruthy();
  });

  
});
