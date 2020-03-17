import { TestBed } from '@angular/core/testing';

import { PolygonService } from './polygon.service';
import { Point } from './point';

describe('PolygonService', () => {

  //let kbServiceStub: any;
  let service: PolygonService;
  let ptA: Point;
  let ptB: Point;
  let ptC: Point;
  let ptArr: Point[];

  beforeEach(()  => {

    ptA = new Point(0, 0); // using a point to test position functions
    ptB = new Point(1, 2);
    ptC = new Point(1 , 2);
    ptArr = [ptA, ptB, ptC];

    TestBed.configureTestingModule({
      providers: [
        PolygonService,
        // {provide: Point},
        { provide: HTMLElement, useValue: {}  },
        { provide: Number, useValue: 0  },
        { provide: String, useValue: '' },
        { provide: Boolean, useValue: true  },
        //{ provide: InteractionService, useClass: FakeInteractionService },
        //{ provide: KeyboardHandlerService, useValue: kbServiceStub },
      ],
    });
    service = TestBed.get(PolygonService);
  });


  it('should be created', () => {
      const testService: PolygonService = TestBed.get(PolygonService);
      expect(testService).toBeTruthy();
  });
 
  it('should set the attributes in the subscription', () => {
    service.interaction.emitFormsAttributes({ plotType: 0, lineThickness: 0, numberOfCorners: 0 });
    const spyInteraction = spyOn(service.interaction.$formsAttributes, 'subscribe');
    service.updateAttributes();
    expect(spyInteraction).toHaveBeenCalled();
    expect(service.attr).toBeDefined();
  });

    //it('should update progress on move', () => {
        //const spy = spyOn(service, 'updateProgress');
        //service.down(ptA); // simulating a mouse down at given point
        //service.update(kbServiceStub);
        //expect(service.isSquare).toBeTruthy();
        //expect(spy).toHaveBeenCalled();
    //});

    it('should update the current path on mouse down', () => {
      const spy = spyOn(service, 'updateProgress');
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

  it('should create a valid rectangle svg from one point to another', () => {
        const firstPoint = new Point(0, 0);
        const num = 10;
        const secondPoint = new Point(num, num);
        const pointsContainer = [firstPoint, secondPoint];
        const rect = service.createPath(pointsContainer, false);
        expect(rect).toContain('<rect');
    });

    it('should create a valid polygon svg from one point to another', () => {
        const first = new Point(0, 0);
        const num = 10;
        const second = new Point(num, num);
        const polygon = service.createPath([first, second], false);
        expect(polygon).toContain('<polygon');
    });
/*
    it('should create a rectangle of the correct dimensions from mouse move', () => {
        const first = new Point(0, 0);
        const num = 10;
        const second = new Point(num , num);
        const add = 5;
        const rect = service.createPath([first, second], false);
        const expWidth = `width="${second.x - first.x + add}"`;
        const expHeigth = `height="${second.y - first.y + add}"`;

        expect(rect).toContain(expWidth);
        expect(rect).toContain(expHeigth);
    });
*/
    it('should create a polygon with the selected border thickness', () => {
        const thick = 1;
        service.attr.lineThickness = thick; // simulated border thickness
        const polygon = service.createPath(ptArr, false);
        const expTick = `stroke-width="${thick}"`;
        expect(polygon).toContain(expTick);
    });
/*
    it('should render a square on pressed shift key', () => {
        const newArr = [new Point(0, 0), new Point(1, 1)]; // forcing a square
        const fakeSquare = service.createPath(newArr, false);

        service.isSquare = true;
        const square = service.createPath(ptArr, false);

        expect(square).toEqual(fakeSquare);
    });

    it('should create a square with corner at mouse start', () => {
        const rect = service.createPath(ptArr, false);

        expect(rect).toEqual('');
    });
*/
    it('should create a polygon filled with the selected color', () => {
        const color = '#ffffff';
        service.chosenColor = { primColor: color, secColor: color, backColor: color }; // both prim. and sec.
        const first = new Point(0 , 0);
        const num = 10;
        const second = new Point(num, num);
        const polygon = service.createPath([first, second], false);
        expect(polygon).toContain(`fill="${color}"`);
    });

    it('should create a border of the selected secondary color', () => {
        const prim = '#000000';
        const sec = '#ffffff';
        const back = '#ffffff';
        const firstPoint = new Point(0, 0);
        const num = 10;
        const secondPoint = new Point(num, num);
        const pointsContainer = [firstPoint, secondPoint];
        service.chosenColor = { primColor: prim, secColor: sec, backColor: back };
        const polygon = service.createPath(pointsContainer, false);

        expect(polygon).toContain(`stroke="${sec}"`);
    });

    it('should create only an outlined polygon on plottype = 0', () => {
        service.attr.plotType = 0; // init the plot type
        const prim = '#000000';
        const sec = '#ffffff';
        const back = '#ffffff';
        service.chosenColor = { primColor: prim, secColor: sec, backColor: back };
        const first = new Point(0, 0);
        const num = 10;
        const second = new Point(num , num);
        const polygon = service.createPath([first, second], false);

        expect(polygon).toContain(`fill="${'none'}"`); // no color for fill

        expect(polygon).toContain(`stroke="${sec}"`); // secondary color for border fill
    });

    it('should create only a filled polygon on plottype = 1', () => {
        service.attr.plotType = 1; // init the plot type
        const prim = '#000000';
        const sec = '#ffffff';
        const back = '#ffffff';
        service.chosenColor = { primColor: prim, secColor: sec, backColor: back };

        const polygon = service.createPath(ptArr, false);

        expect(polygon).toContain(`fill="${prim}"`); // primary color fill

        expect(polygon).toContain(`stroke="${'none'}"`);
    });

    it('should create a filled and outlined polygon on plottype = 2', () => {
        service.attr.plotType = 2; // init the plot type
        const prim = '#000000';
        const sec = '#ffffff';
        const back = '#ffffff';
        service.chosenColor = { primColor: prim, secColor: sec, backColor: back };
        const first = new Point(0 , 0);
        const num = 10;
        const second = new Point(num, num)
        const polygon = service.createPath([first, second], false);

        expect(polygon).toContain(`fill="${prim}"`); // no color for fill

        expect(polygon).toContain(`stroke="${sec}"`); // secondary color for border fill
    });

    it('should not create an polygon if the mouse didnt move', () => {
        const newArr = [new Point(0, 0), new Point(0, 0)]; // no move

        const polygon = service.createPath(newArr, false);

        expect(polygon).toBe('');
    });

    it('should be named polygon', () => {
        const firstP = new Point (0, 0)
        const num = 10;
        const secondP = new Point(num, num);
        const path = service.createPath([firstP, secondP], false);
        const name = 'polygon';
        expect(path).toContain(name);
    });

});
