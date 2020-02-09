import { TestBed } from '@angular/core/testing';

import { LineService } from './line.service';
import { Point } from './point';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
 

describe('LineService', () => {
  let service: LineService
  let ptA: Point;
  let ptB: Point;
  
  let kbServiceStub: any;
  beforeEach(() => {

    kbServiceStub = {
      shiftDown: true,
      keyCode: 8 //backspace
    }

    TestBed.configureTestingModule({
      providers: [
        LineService,
        {provide: String, useValue: ""},
        {provide: Boolean, useValue: true},
        {provide: Number, useValue: 0},
        {provide: HTMLElement, useValue:{}},
        {provide: KeyboardHandlerService, useValue: kbServiceStub}]
    });

    ptA = new Point(0,0); // using a point to test position functions
    ptB = new Point(1,2);
  
    service = TestBed.get(LineService);
    service.isDown = true; //current tool always selected

  });
  

  it('should be created', () => {
    const service: LineService = TestBed.get(LineService);
    expect(service).toBeTruthy();
  });

  it('should set the attributes in the subscription', ()=> {
    let spyInteraction = spyOn(service.interaction.$lineAttributes,'subscribe');
    service.updateAttributes();
    expect(spyInteraction).toHaveBeenCalled();
  });

  it('should update the progress and the colors while the tool is selected', ()=>{
    const progressSpy = spyOn(service, "updateProgress");
    const colorsSpy = spyOn(service, "updateColors");
    service.update(kbServiceStub);
    expect(progressSpy).toHaveBeenCalledWith(false); //not a dblClick, can continue
    expect(colorsSpy).toHaveBeenCalled();
  });

  it('should pop the path array on backspace', ()=>{
    
    service.update(kbServiceStub);

    const spy = spyOn(service.currentPath, "pop");
    expect(spy).toHaveBeenCalled();
  });

  it('should call the path cancelation method on escape', ()=>{
    const ESCAPE = 27;
    kbServiceStub.keyCode = ESCAPE;

    const spy = spyOn(service, "cancel");
    service.update(kbServiceStub);

    expect(spy).toHaveBeenCalled();
  });

  it('should add the same point twice in the array if the mouse doesnt move', ()=>{
    service.currentPath = []; //emptying the current path (new path)
  
    const spy = spyOn(service.currentPath, "push");

    service.down(ptA, true); // mouse is inside workspace 
    expect(spy).toHaveBeenCalledTimes(2); //point twice in array
    expect(spy).toHaveBeenCalledWith(ptA);
    expect(service.currentPath).toContain(ptA);

  });

  it('should add the same point once if the current path is not finished', ()=>{
    service.currentPath.push(ptB);
    const spy = spyOn(service.currentPath, "push");
    service.down(ptA, true);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(ptA);
  });

  it('should update progress after mouse down', ()=> {
    const spy = spyOn(service, "updateProgress");
    service.down(ptA, true);
    expect(spy).toHaveBeenCalledWith(false); // not a dblclick
  });

  it('should push a new point if the current path has only one', ()=>{
    service.currentPath.push(ptA);
    const spy = spyOn(service.currentPath, "push");
    service.move(ptB); // we move to point b
    expect(spy).toHaveBeenCalledWith(ptB);
  });

  it('should update the current path after the new position', ()=>{
    service.currentPath.push(ptA);
    service.currentPath.push(ptB); //pushing a new point

    service.move(ptA); // moving back again to pointA

    const newPos = service.currentPath[service.currentPath.length-1];
    expect(newPos).toBe(ptA);
  });

  it('should call the progress update on move', ()=>{
    
    const spy = spyOn(service, "updateProgress");
    service.move(ptB); 
    expect(spy).toHaveBeenCalledWith(false); // still not a dblclick on update
  });

  it('should cancel if there is not at least 4 mouse actions (points)', ()=>{ // se "doubleClick" method
    const inWorkspace = true;
    const spy = spyOn(service, "cancel");
    service.doubleClick(ptA, inWorkspace);
    expect(spy).toHaveBeenCalled();
  });

  it('should pop the current path twice if it has more than 2 points', ()=>{
    const inWorkspace = true;
    const spy = spyOn(service.currentPath, "pop");
    service.doubleClick(ptA, inWorkspace);
    expect(spy).toHaveBeenCalledTimes(2); //called pop twice
  });

  it('should cut the line on double click', ()=>{
    const inWorkspace = true;
    const spy = spyOn(service, "updateDrawing");

    service.doubleClick(ptA, inWorkspace); // arbitrary point in ws
    expect(spy).toHaveBeenCalledWith(true); // it was a double click, cutting the line
  });

  



});
