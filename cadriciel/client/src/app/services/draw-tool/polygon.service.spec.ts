import { TestBed } from '@angular/core/testing';

import { PolygonService } from './polygon.service';
//import { FormsAttribute } from '../attributes/attribute-form';
//import { Point } from './point';
//import { ChoosenColors } from 'src/app/models/ChoosenColors.model';

describe('PolygonService', () => {

  //let service: PolygonService;
  //let ptA: Point;
  //let ptB: Point;
  //let ptArr: Point[];

  beforeEach(()  => { 

    //ptA = new Point(0, 0); // using a point to test position functions
    //ptB = new Point(1, 2);
    //ptArr = [ptA, ptB];

    TestBed.configureTestingModule({
      providers: [
        PolygonService,
        //{provide: Point},
        {provide: HTMLElement, useValue: {}},
        {provide: Number, useValue: 0},
        {provide: String, useValue: ''},
        {provide: Boolean, useValue: true}]
    });
    //service = TestBed.get(PolygonService);
  });

 /* 
  it('should be created', () => {
    const service: PolygonService = TestBed.get(PolygonService);
    expect(service).toBeTruthy();
  });

  it('should set the attributes in the subscription', () => {
    service.interaction.emitFormsAttributes(new FormsAttribute(0, 0, 0));
    const spyInteraction = spyOn(service.interaction.$formsAttributes, 'subscribe');
    service.updateAttributes();
    expect(spyInteraction).toHaveBeenCalled();
    expect(service.attr).toBeDefined();

  });

  it('should update progress on move', () => {
    const spy = spyOn(service, 'updateProgress');
    service.down(ptA); // simulating a mouse down at given point
    expect(spy).toHaveBeenCalled();
  });

  it('should update the current path on mouse down', () => {
    const spy = spyOn(service,  'updateProgress');
    service.down(ptA);
    expect(service.currentPath.length).toBe(2); // same point added twice to manage static mouse
    expect(service.currentPath).toContain(ptA);

    expect(spy).toHaveBeenCalled();
  });

  it('should update the drawing on mouse up', () => {
    service.down(ptA); // pressing the mouse
    const spy = spyOn(service, 'updateDrawing');
    service.up(ptA);
    expect(spy).toHaveBeenCalled();
  });

  it('should not update the drawing of the tool change is on-the-fly', () => {
    service.ignoreNextUp = true;
    const spy = spyOn(service, 'updateDrawing');
    service.up(ptA);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should update the progress on mouse down', () => {
    const spy = spyOn(service, 'updateProgress');
    service.down(ptA);
    expect(spy).toHaveBeenCalled();
  });

  it('should add the new position in the current path array on mouse down', () => {
    service.down(ptA);
    service.move(ptA);
    expect(service.currentPath).toContain(ptA);
  });

  it('should create a valid polygon svg from one point to another', () => {
    const polygon = service.createPath(ptArr);
    expect(polygon).toContain('<polygon');
  });

  it('should create a polygon space of the correct dimensions from mouse move', () => {
    const polygon = service.createPath(ptArr);
    const expWidth = `width="${ptB.x - ptA.x}"`;
    const expHeigth = `height="${ptB.y - ptA.y}"`;

    expect(polygon).toContain(expWidth);
    expect(polygon).toContain(expHeigth);
  });

  it('should create a polygon with the selected border thickness', () => {
    const thick = 1;
    service.attr.lineThickness = thick; // simulated border thickness
    const polygon = service.createPath(ptArr);
    const expTick = `stroke-width="${thick}"`;
    expect(polygon).toContain(expTick);
  });

  it('should create a polygon with corner at mouse start', () => {

    const polygon = service.createPath(ptArr);

    expect(polygon).toContain(`x="${0}"`);
    expect(polygon).toContain(`y="${0}"`);
  });

  it('should create a polygon filled with the selected color', () => {
    const color = '#ffffff';
    service.chosenColor = new ChoosenColors(color, color); // both prim. and sec.

    const polygon = service.createPath(ptArr);
    expect(polygon).toContain(`fill="${color}"`);
  });

  it('should create a border of the selected secondary color', () => {
    const prim = '#000000';
    const sec = '#ffffff';

    service.chosenColor = new ChoosenColors(prim, sec);
    const polygon = service.createPath(ptArr);

    expect(polygon).toContain(`stroke="${sec}"`);
  });

  it('should create only an outlined polygon on plottype = 0', () => {
    service.attr.plotType = 0; // init the plot type
    const prim = '#000000';
    const sec = '#ffffff';
    service.chosenColor = new ChoosenColors(prim, sec);

    const polygon = service.createPath(ptArr);

    expect(polygon).toContain(`fill="${'none'}"`); // no color for fill

    expect(polygon).toContain(`stroke="${sec}"`); // secondary color for border fill
  });

  it('should create only a filled polygon on plottype = 1', () => {
    service.attr.plotType = 1; // init the plot type
    const prim = '#000000';
    const sec = '#ffffff';
    service.chosenColor = new ChoosenColors(prim, sec);

    const polygon = service.createPath(ptArr);

    expect(polygon).toContain(`fill="${prim}"`); // primary color fill

    expect(polygon).toContain(`stroke="${'none'}"`);
  });

  it('should create a filled and outlined polygon on plottype = 2', () => {
    service.attr.plotType = 2; // init the plot type
    const prim = '#000000';
    const sec = '#ffffff';
    service.chosenColor = new ChoosenColors(prim, sec);

    const polygon = service.createPath(ptArr);

    expect(polygon).toContain(`fill="${prim}"`); // no color for fill

    expect(polygon).toContain(`stroke="${sec}"`); // secondary color for border fill
  });

  it('should not create a polygon if the mouse didnt move', () => {
    const newArr = [new Point(0, 0), new Point(0, 0)]; // no move

    const polygon = service.createPath(newArr);

    expect(polygon).toBe('');
  });

  it('should be named polygon', () => {
    const path = service.createPath(ptArr);
    const name = 'polygon';
    expect(path).toContain(name);
  });
*/
});
