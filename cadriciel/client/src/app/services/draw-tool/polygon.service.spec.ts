import { TestBed } from '@angular/core/testing';
import { Point } from './point';
import { PolygonService } from './polygon.service';

describe('PolygonService', () => {
    // let kbServiceStub: any;
    let service: PolygonService;
    let ptA: Point;
    let ptB: Point;
    let ptC: Point;
    let ptArr: Point[];

    beforeEach(() => {
        ptA = new Point(0, 0); // using a point to test position functions
        ptB = new Point(1, 2);
        ptC = new Point(1, 2);
        ptArr = [ptA, ptB, ptC];

        TestBed.configureTestingModule({
            providers: [
                PolygonService,
                // {provide: Point},
                { provide: HTMLElement, useValue: {} },
                { provide: Number, useValue: 0 },
                { provide: String, useValue: '' },
                { provide: Boolean, useValue: true },
                // { provide: InteractionService, useClass: FakeInteractionService },
                // { provide: KeyboardHandlerService, useValue: kbServiceStub },
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
        const rect = service.createPath(ptArr, false);
        expect(rect).toContain('<rect');
    });

    it('should create a valid polygon svg from one point to another', () => {
        const polygon = service.createPath(ptArr, false);
        expect(polygon).toContain('<polygon');
    });

    it('should change the number of corners of the polygon', () => {
        const corners = 7;
        service.attr.numberOfCorners = corners; // simulated border thickness
        service.createPath(ptArr, false);
        expect(service.corners.length).toEqual(corners);
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

    it('should create a polygon filled with the selected color', () => {
        const color = '#ffffff';
        service.chosenColor = { primColor: color, secColor: color, backColor: color }; // both prim. and sec.
        const polygon = service.createPath(ptArr, false);

        expect(polygon).toContain(`fill="${color}"`);
    });

    it('should create a border of the selected secondary color', () => {
        const prim = '#000000';
        const sec = '#ffffff';
        const back = '#ffffff';
        service.chosenColor = { primColor: prim, secColor: sec, backColor: back };
        const polygon = service.createPath(ptArr, false);

        expect(polygon).toContain(`stroke="${sec}"`);
    });

    it('should create only an outlined polygon on plottype = 0', () => {
        service.attr.plotType = 0; // init the plot type
        const prim = '#000000';
        const sec = '#ffffff';
        const back = '#ffffff';
        service.chosenColor = { primColor: prim, secColor: sec, backColor: back };
        const polygon = service.createPath(ptArr, false);

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
        const polygon = service.createPath(ptArr, false);

        expect(polygon).toContain(`fill="${prim}"`); // no color for fill
        expect(polygon).toContain(`stroke="${sec}"`); // secondary color for border fill
    });

    it('should not create an polygon if the mouse didnt move', () => {
        const newArr = [ptA, ptA]; // no movement
        const polygon = service.createPath(newArr, false);
        expect(polygon).toEqual('');
    });

    it('should be not create a polygon if the path has less than 2 points', () => {
        const path = service.createPath([ptA], false);
        expect(path).toEqual('');
    });

    it('should be named polygon', () => {
        const path = service.createPath(ptArr, false);
        const name = 'polygon';
        expect(path).toContain(name);
    });

    it('should align all points inside the perimeter if a point is smaller than ', () => {
        const path = service.createPath(ptArr, false);
        const name = 'polygon';
        expect(path).toContain(name);
    });

});
