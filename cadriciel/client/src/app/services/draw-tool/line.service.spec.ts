import { TestBed } from '@angular/core/testing';

import { LineService } from './line.service';
import { Point } from './point';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { ChoosenColors } from 'src/app/models/ChoosenColors.model';
import { LineAttributes } from '../attributes/line-attributes';
 

describe('LineService', () => {
  let service: LineService
  let ptA: Point;
  let ptB: Point;
  let ptArr: Point[];
  
  let kbServiceStub: any;
  beforeEach(() => {

    kbServiceStub = {
      shiftDown: true,
      keyCode: 8 //backspace
    }

    TestBed.configureTestingModule({
      providers: [
        {provide: String, useValue: ""},
        {provide: Boolean, useValue: true},
        {provide: Number, useValue: 0},
        {provide: HTMLElement, useValue:{}},
        {provide: KeyboardHandlerService, useValue: kbServiceStub}]
    });

    ptA = new Point(0,0); // using a point to test position functions
    ptB = new Point(1,2);
    ptArr = [ptA, ptB];
    service = TestBed.get(LineService);
    service.isDown = true; //current tool always selected

  });
  

  it('should be created', () => {
    const service: LineService = TestBed.get(LineService);
    expect(service).toBeTruthy();
  });

  it('should set the attributes in the subscription', ()=> {
    service.interaction.emitLineAttributes(new LineAttributes(true, 0,0)); // arbitrary line attr

    let spyInteraction = spyOn(service.interaction.$lineAttributes,'subscribe');
    service.updateAttributes();

    expect(spyInteraction).toHaveBeenCalled();
    expect(service.attr).toBeDefined(); // the line attributes have been recieved!
  });

  it('should update the progress and the colors while the tool is selected', ()=>{
    const progressSpy = spyOn(service, "updateProgress");
    const colorsSpy = spyOn(service, "updateColors");
    service.update(kbServiceStub);
    expect(progressSpy).toHaveBeenCalledWith(false); //not a dblClick, can continue
    expect(colorsSpy).toHaveBeenCalled();
  });

  it('should pop the path array on backspace', ()=>{
    const spy = spyOn(service.currentPath, "pop");
    service.currentPath.push(new Point(1,1)); // at least more than 2 points
    service.currentPath.push(new Point(2,2));
    service.currentPath.push(new Point(3,3));
    service.update(kbServiceStub);
    expect(spy).toHaveBeenCalled();
  });

  it('should call the path cancelation method on escape', ()=>{
    service.isDown = false;
    const ESCAPE = 27;
    kbServiceStub.keyCode = ESCAPE;

    const spy = spyOn(service, "cancel");
    service.update(kbServiceStub);

    expect(spy).toHaveBeenCalled();
  });

  it('should add the same point twice in the array if the mouse doesnt move', ()=>{
    service.currentPath.length = 0;
    const spy = spyOn(service.currentPath, "push");    
    service.down(ptA, true); // mouse is inside workspace 
    expect(spy).toHaveBeenCalledTimes(2); //point twice in array
    expect(spy).toHaveBeenCalledWith(ptA);

  });

  it('should add the same point once if the current path is not finished', ()=>{
    service.currentPath.push(new Point(1,1));
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

  it('should pop the current path twice if it has 4 points or more', ()=>{
    const inWorkspace = true;
    const spy = spyOn(service.currentPath, "pop");
    service.currentPath.push(ptA);
    service.currentPath.push(new Point(0,0)); // adding some points
    service.currentPath.push(new Point(1,2));
    service.currentPath.push(new Point(0,2));

    service.doubleClick(ptA, inWorkspace);
    expect(spy).toHaveBeenCalledTimes(2); //called pop twice
  });

  it('should cut the line on double click', ()=>{
    const inWorkspace = true;
    const spy = spyOn(service, "updateDrawing");

    service.currentPath.push(new Point(1,1));
    service.currentPath.push(new Point(0,2)); //adding supplementary points
    service.currentPath.push(new Point(1,2));
    service.currentPath.push(new Point(2,2)); // needs at least 4

    service.doubleClick(ptA, inWorkspace); // arbitrary point in ws
    expect(spy).toHaveBeenCalledWith(true); // it was a double click, cutting the line
  });

  it('should not cut the line on double click if line is incomplete', ()=>{
    const inWorkspace = true;
    const spy = spyOn(service, "updateDrawing");

    service.doubleClick(ptA, inWorkspace); // arbitrary point in ws
    expect(spy).not.toHaveBeenCalled(); // it was a double click, cutting the line
  });

  // for some reason, the test never passes.
  // spied on data and its always defined
  it('should call a forced angle if chosen', ()=>{  
    
    service.forcedAngle = true; // option choosen
    service.currentPos = ptB;
    
    const spy = spyOn(service, "pointAtForcedAngle");
    service.createPath(ptArr, false);
    
    expect(ptArr[0]).toEqual(ptA);
    expect(ptArr[1]).toEqual(ptB);
    expect(service.forcedAngle).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  });

  it('should not call a forced angle if not chosen', ()=>{
    service.forcedAngle = false;
    const spy = spyOn(service, "pointAtForcedAngle");
    service.createPath(ptArr, false);
    expect(spy).not.toHaveBeenCalled();
  });

  it('the line should be named line-segments', ()=>{
    const line = service.createPath(ptArr, false); // not a double click
    expect(line).toContain('line-segments');
  });

  it('should create a valid svg line (from path)', ()=>{
    const line = service.createPath(ptArr, false); // not a double click
    expect(line).toContain('<path');
  });

  it('should be closed on double click', ()=>{
    const DBL = true;
    const line = service.createPath(ptArr, DBL);
    const CLOSE = 'Z'; // character for cutting the line

    expect(line).toContain(CLOSE);
  });

  it('should be able to be continuated if no click', ()=>{
    const DBL = false;
    const line = service.createPath(ptArr, DBL);
    const CLOSE = 'Z';

    expect(line).not.toContain(CLOSE);
  });

  it('should contain the starting point coordinates', ()=>{
    const line = service.createPath(ptArr, false);
    expect(line).toContain(`M ${ptA.x} ${ptA.y} `); // first point in our point array
  });

  it('should be composed of the succeeding points', ()=>{
    ptArr.push(new Point(2,2)); // this new point has not been placed yet.

    const line = service.createPath(ptArr, false);
    expect(line).toContain(`L ${ptB.x} ${ptB.y} `); // ptB is the succeeding point
  });

  it('should have the primary color as attribute', ()=>{
    const PRIM = '#ffffff';
    const SEC = '#000000';
    service.chosenColor = new ChoosenColors(PRIM, SEC);
    const line = service.createPath(ptArr, false);
    expect(line).toContain(`"stroke="${PRIM}"`);
  });

  it('should have the choosen thickness as attribute', ()=>{
    const THICK = 5; //arbitrary, for test purpose

    const line = service.createPath(ptArr, false);
    expect(line).toContain(`stroke-width="${THICK}"`);
  });

  it('should render a circle as junction if choosen', ()=>{
    service.attr.junction = true;
    const DIAM = 10;
    service.attr.junctionDiameter = DIAM;

    const line = service.createPath(ptArr, false);
    expect(line).toContain(`<circle`);

  });

  it('should render a circle as junction of the choosen diameter', ()=>{
    service.attr.junction = true;
    const DIAM = 10;
    service.attr.junctionDiameter = DIAM;

    const line = service.createPath(ptArr, false);
    expect(line).toContain(`r="${DIAM/2}"`);


  });
  
  it('should return the same point on forced angle if it was horizontal', ()=>{
    const PT = new Point(1, 0);
    const point = service.pointAtForcedAngle(ptA, PT); // (1,1) and (2,1), forming an horizontal line
    expect(point).toEqual(PT);
  });

  it('should redirect the point to a forced angle of 0 degrees', ()=>{
    const PTA = new Point(0,0);
    const PTB = new Point(1,0.25);

    const REDIR = service.pointAtForcedAngle(PTA, PTB);

    const NEW_Y = 0;
    expect(REDIR.y).toEqual(NEW_Y); // without calculating the new x value, we can assume the point is well positionned by the forced y
  })

  it('should redirect the point to a forced angle of 45 degrees', ()=>{
    const PTA = new Point(0,0);
    const PTB = new Point(1,0.85);

    const REDIR = service.pointAtForcedAngle(PTA, PTB);

    const NEW_Y = 1;
    expect(REDIR.y).toEqual(NEW_Y); 
  });

  it('should redirect the point to a forced angle of 90 degrees', ()=>{
    const PTA = new Point(0,0);
    const PTB = new Point(0.25, 1);

    const REDIR = service.pointAtForcedAngle(PTA, PTB);

    const NEW_X = 0; // if it's x value was brought to 0, the line was properly redirected
    expect(REDIR.x).toEqual(NEW_X); 
  });

  it('should redirect the point to a forced angle of 135 degrees', ()=>{
    const PTA = new Point(0,0);
    const PTB = new Point(-1,0.9);

    const REDIR = service.pointAtForcedAngle(PTA, PTB);

    const NEW_Y = 1;
    expect(REDIR.y).toEqual(NEW_Y); 
  });

  it('should redirect the point to a forced angle of 225 degrees', ()=>{
    const PTA = new Point(0,0);
    const PTB = new Point(-1,-0.9);

    const REDIR = service.pointAtForcedAngle(PTA, PTB);
    const NEW_Y = -1;
    expect(REDIR.y).toEqual(NEW_Y); 

  });







});
