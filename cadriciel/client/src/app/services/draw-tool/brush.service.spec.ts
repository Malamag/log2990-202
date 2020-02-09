import { TestBed } from '@angular/core/testing';

import { BrushService } from './brush.service';

import { InteractionService } from '../service-interaction/interaction.service';
import { Point } from './point';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { ChoosenColors } from 'src/app/models/ChoosenColors.model';

export class fakeInteractionService extends InteractionService { } 

describe('BrushService', () => {
  let service: BrushService
  let ptA: Point;
  let ptB: Point;
  let ptArr: Point[];
  let kbServiceStub: any;
  

  beforeEach(() => {
    kbServiceStub = {}
    TestBed.configureTestingModule({
      providers: 
      [{provide: HTMLElement, useValue: {}},
        {provide: Boolean, useValue: false},
        {provide: Number, useValue: 0},
        {provide: String, useValue: ""},
        {provide: KeyboardHandlerService, kbServiceStub}]
        
    });
    ptA = new Point(0,0);
    ptB = new Point(1,2);
    ptArr = [ptA, ptB];
    service = TestBed.get(BrushService);

  });

  it('should be created', () => {
    const service: BrushService = TestBed.get(BrushService);
    expect(service).toBeTruthy();
  });

  it('should set the attributes in the subscription', ()=> {
    
    let spyInteraction = spyOn(service.interaction.$toolsAttributes,'subscribe');
    service.updateAttributes();
    expect(spyInteraction).toHaveBeenCalled();
    
  });

  it('should create a valid path', ()=> {
    const path = service.createPath(ptArr);
    expect(path).toContain('<path');
  });

  it('the path must have the same starting point has the mouse', ()=>{
    const path = service.createPath(ptArr);
    expect(path).toContain(`M ${ptArr[0].x} ${ptArr[0].y} `);
  });

  it('the path must be pursued by the next point', ()=>{
    const path = service.createPath(ptArr);
    expect(path).toContain(`L ${ptArr[1].x} ${ptArr[1].y} `);  // second and last point of our fake array
  });

  it('should have the primary color as attribute', ()=>{
    const prim = '#ffffff';
    const sec = '#000000';

    service.chosenColor = new ChoosenColors(prim, sec);

    const path = service.createPath(ptArr);

    expect(path).toContain(prim); // we want to see the primary color, but not the secondary!
    expect(path).not.toContain(sec);

  });

  it('should have the choosen thickness', ()=>{
    const thick = 25; // fake thickness used for this test's purpose
    service.attr.lineThickness = thick
    const path = service.createPath(ptArr);
    expect(path).toContain(`stroke-width="${thick}"`); // svg attribute along with its value
  });

  it('should have a round linecap and linejoin', ()=>{
    const path = service.createPath(ptArr);

    expect(path).toContain('stroke-linecap="round"');
    expect(path).toContain('stroke-linejoin="round"');
  });

  it('should be named brush-stroke', ()=>{
    const path = service.createPath(ptArr);
    const name = "brush-stroke";
    expect(path).toContain(name);
  });





});
