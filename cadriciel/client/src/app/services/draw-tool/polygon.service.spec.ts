import { TestBed } from '@angular/core/testing';

import { PolygonService } from './polygon.service';
//import { FormsAttribute } from '../attributes/attribute-form';
import { Point } from './point';
//import { ChoosenColors } from 'src/app/models/ChoosenColors.model';

fdescribe('PolygonService', () => {

  let service: PolygonService;
  let ptA: Point;
  let ptB: Point;
  let ptArr: Point[];

  beforeEach(()  => { 

    ptA = new Point(0, 0); // using a point to test position functions
    ptB = new Point(1, 2);
    ptArr = [ptA, ptB];

    TestBed.configureTestingModule({
      providers: [
        PolygonService,
        //{provide: Point},
        {provide: HTMLElement, useValue: {}},
        {provide: Number, useValue: 0},
        {provide: String, useValue: ''},
        {provide: Boolean, useValue: true}]
    });
    service = TestBed.get(PolygonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be an empty string', () => {
    const pointContainer = [ptA]
    const cornersSpy = spyOn(service, 'setCorners');
    const attributesSpy = spyOn(service, 'setAttributesToPath')
    const perimeterSpy = spyOn(service, 'createPerimeter')
    service.createPath(pointContainer, false);
    expect(service.svgString).toBe('');
    expect(cornersSpy).toHaveBeenCalledTimes(0);
    expect(attributesSpy).toHaveBeenCalledTimes(0);
    expect(perimeterSpy).toHaveBeenCalledTimes(0);
  });

  it('should call functions', () => {
    const cornersSpy = spyOn(service, 'setCorners');
    const attributesSpy = spyOn(service, 'setAttributesToPath')
    const perimeterSpy = spyOn(service, 'createPerimeter')    
    service.createPath(ptArr, false);
    expect(service.svgString).toContain('<g name = "polygon">')
    expect(cornersSpy).toHaveBeenCalled()
    expect(attributesSpy).toHaveBeenCalled()
    expect(perimeterSpy).toHaveBeenCalled();
  })
  it('should return an empty string but call functions', () => {
    service.displayPolygon = false;
    const cornersSpy = spyOn(service, 'setCorners');
    const attributesSpy = spyOn(service, 'setAttributesToPath')
    const perimeterSpy = spyOn(service, 'createPerimeter')    
    service.createPath(ptArr, false);
    expect(cornersSpy).toHaveBeenCalled()
    expect(attributesSpy).toHaveBeenCalled()
    expect(perimeterSpy).toHaveBeenCalled();
    expect(service.svgString).toBe('')
  })
  // height and width positive
  it('should set the dimensions and as the width and the height is bigger than zero', () => {
    service.setdimensions(ptArr)
    expect(service.startX).toEqual(ptA.x)
    expect(service.startY).toEqual(ptA.y)
    expect(service.smallest).toEqual(service.width)
    expect(service.middleX).toEqual(service.startX + service.smallest / 2 )
    expect(service.middleY).toEqual(service.startY + service.smallest / 2 )
  })
  // height and width negative
  it('should set the dimensions and as the width and the height is smaller than zero', () => {
    const ptContainer = [ptB, ptA]
    service.setdimensions(ptContainer)
    expect(service.startX).toEqual(ptB.x)
    expect(service.startY).toEqual(ptB.y)
    expect(service.smallest).toEqual(Math.abs(service.width))
    expect(service.middleX).toEqual(service.startX - service.smallest / 2 )
    expect(service.middleY).toEqual(service.startY - service.smallest / 2 )
  })

  it('should set the dimensions and align the corners', () => {
    const setSpy = spyOn(service, 'setdimensions')
    const alignSpy = spyOn(service, 'alignCorners')
    service.setCorners(ptArr);
    expect(setSpy).toHaveBeenCalled()
    expect(alignSpy).toHaveBeenCalled()
  })
  it('should display the polygon', () => {
    const ptContainer = [ptB, ptA]
    service.setCorners(ptContainer);
    expect(service.displayPolygon).toBeTruthy()
  })
  it('should not display the polygon', () => {
    const firstPoint = new Point(0, 0);
    const secondPoint = new Point(0, 0);
    service.setCorners([firstPoint, secondPoint]);
    expect(service.displayPolygon).toBeFalsy()
  })
  it('should be an empty string', () => {
    service.attr.numberOfCorners = 3
    service.corners = ptArr;
    service.startX = 5;
    service.startY = 5;
    service.height = 2;
    service.width = 2;
    service.createPerimeter(true);
    expect(service.svgString).toBe('');
  })
  it(' should contain a rectangle', () => {
    service.attr.numberOfCorners = 3
    service.corners = ptArr;
    service.startX = 5;
    service.startY = 5;
    service.height = 2;
    service.width = 2;
    service.createPerimeter(false);
    expect(service.svgString).toContain('<rect x="5" y="5"width="0" height="3"style="stroke:lightgrey;stroke-width:2;fill-opacity:0.0;stroke-opacity:0.9"stroke-width="5" stroke-dasharray="4"/>')
  })
  it(' should align the corners to the left', ()=>{
    service.leftPoint = 5;
    service.startX = 4
    service.rightPoint = 4;
    service.corners = ptArr;
    const SUBSTACTION_X = service.leftPoint - service.startX;
    const ptAStub = new Point(ptA.x, ptA.y)
    const ptBStub = new Point(ptB.x, ptB.y)
    const ptArrStub = [ptAStub, ptBStub]
    service.alignCorners()
    for( let i = 0; i < service.corners.length; ++i){
      expect(service.corners[i].x).toEqual(ptArrStub[i].x- SUBSTACTION_X)
    }
  })

  it(' should align the corners to the right', ()=>{
    service.rightPoint = 3;
    service.startX = 4
    service.rightPoint = 4;
    service.corners = ptArr;
    const ADDITION_X = service.startX - service.rightPoint;
    const ptAStub = new Point(ptA.x, ptA.y)
    const ptBStub = new Point(ptB.x, ptB.y)
    const ptArrStub = [ptAStub, ptBStub]
    service.alignCorners()
    for( let i = 0; i < service.corners.length; ++i){
      expect(service.corners[i].x).toEqual(ptArrStub[i].x + ADDITION_X)
    }
  })

});
