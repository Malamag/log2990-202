import { TestBed } from '@angular/core/testing';

import { RectangleService } from './rectangle.service';
import { Point } from './point';
import { InteractionService } from '../service-interaction/interaction.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';

export class fakeInteractionService extends InteractionService{}

describe('RectangleService', () => {

  let kbServiceStub: any;
  let service: RectangleService;
  let ptA: Point;

  beforeEach(() => {
    kbServiceStub = {
      shiftDown: true,
      ctrlDown: true
    }

    ptA = new Point(0,0); // using a point to test position functions
    TestBed.configureTestingModule({
    
      providers:[
        RectangleService,
        {provide:Point}, 
        {provide: HTMLElement, useValue: {}},
        {provide: Number, useValue: 0},
        {provide: String, useValue: ""},
        {provide: Boolean, useValue: true},
        {provide: InteractionService, useClass: fakeInteractionService},
        {provide: KeyboardHandlerService, useValue: kbServiceStub}]
    });
    service = TestBed.get(RectangleService);
  });

  it('should be created', () => {
    const service: RectangleService = TestBed.get(RectangleService);
    expect(service).toBeTruthy();
  });

  it('should update progress on move', ()=>{
    const spy = spyOn(service, "updateProgress");
    service.down(ptA); // simulating a mouse down at given point
    service.update(kbServiceStub);
    expect(service.isSquare).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });

  it('should update the current path on mouse down', () => {
    const spy = spyOn(service,  "updateProgress");
    service.down(ptA);
    expect(service.currentPath.length).toBe(2); // same point added twice to manage static mouse
    expect(service.currentPath).toContain(ptA);

    expect(spy).toHaveBeenCalled();
  });

  it('should update the drawing on mouse up', () => {
    service.down(ptA); //pressing the mouse
    const spy = spyOn(service, "updateDrawing");
    service.up(ptA);
    expect(spy).toHaveBeenCalled();
  });

  it('should not update the drawing of the tool change is on-the-fly', ()=>{
    service.ignoreNextUp = true;
    const spy = spyOn(service, "updateDrawing");
    service.up(ptA);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should update the progress on mouse down', ()=> {
    service.down(ptA);
    const spy = spyOn(service, "updateProgress");
    expect(spy).toHaveBeenCalled();
  });

  it('should add the new position in the current path array on mouse down', ()=>{
    service.down(ptA);
    service.move(ptA);
    expect(service.currentPath).toContain(ptA);
  });

  it('should create a valid rectangle svg from one point to another', ()=>{
    const ptB = new Point(1,1);
    let ptArr = [ptA, ptB];

    const rect = service.createPath(ptArr);
    expect(rect).toContain("<rect");
  });


});
