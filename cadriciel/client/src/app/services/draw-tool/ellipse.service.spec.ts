import { TestBed } from '@angular/core/testing';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { EllipseService } from './ellipse.service';
import { Point } from './point';

export class FakeInteractionService extends InteractionService { }
describe('EllipseService', () => {

    // tslint:disable-next-line: no-any
    let kbServiceStub: any;
    let service: EllipseService;
    let ptA: Point;
    let ptB: Point;
    let ptArr: Point[];

    beforeEach(() => {
        kbServiceStub = {
            shiftDown: true,
            ctrlDown: true,
        };

        ptA = new Point(0, 0); // using a point to test position functions
        ptB = new Point(1, 2);
        ptArr = [ptA, ptB];

        TestBed.configureTestingModule({
            providers: [
                EllipseService,
                { provide: Point },
                { provide: HTMLElement, useValue: {} },
                { provide: Number, useValue: 0 },
                { provide: String, useValue: '' },
                { provide: Boolean, useValue: true },
                { provide: InteractionService, useClass: FakeInteractionService },
                { provide: KeyboardHandlerService, useValue: kbServiceStub },
            ],
        });
        service = TestBed.get(EllipseService);
    });

    it('should be created', () => {
        const testService: EllipseService = TestBed.get(EllipseService);
        expect(testService).toBeTruthy();
    });

    it('should set the attributes in the subscription', () => {
        service.interaction.emitFormsAttributes({ plotType: 0, lineThickness: 0, numberOfCorners: 0 });
        const spyInteraction = spyOn(service.interaction.$formsAttributes, 'subscribe');
        service.updateAttributes();
        expect(spyInteraction).toHaveBeenCalled();
        expect(service.attr).toBeDefined();
    });

    /*it('should update progress on move', () => {
        const spy = spyOn(service, 'updateProgress');
        service.down(ptA); // simulating a mouse down at given point
        service.update(kbServiceStub);
        expect(service.isSquare).toBeTruthy();
        expect(spy).toHaveBeenCalled();
    });*/

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

    it('should create a valid ellipse svg from one point to another', () => {
        const first = new Point(0, 0);
        const num = 10;
        const second = new Point(num, num);
        const ellipse = service.createPath([first, second], false);
        expect(ellipse).toContain('<ellipse');
    });

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

    it('should create an ellipse with the selected border thickness', () => {
        const thick = 1;
        service.attr.lineThickness = thick; // simulated border thickness
        const ellipse = service.createPath(ptArr, false);
        const expTick = `stroke-width="${thick}"`;
        expect(ellipse).toContain(expTick);
    });

    it('should render a circle on pressed shift key', () => {
        const newArr = [new Point(0, 0), new Point(1, 1)]; // forcing a circle
        const fakeCircle = service.createPath(newArr, false);

        service.isSquare = true;
        const circle = service.createPath(ptArr, false);

        expect(circle).toEqual(fakeCircle);
    });

    it('should create a rectangle with corner at mouse start', () => {
        const rect = service.createPath(ptArr, false);

        expect(rect).toEqual('');
    });

    it('should create an ellipse filled with the selected color', () => {
        const color = '#ffffff';
        service.chosenColor = { primColor: color, secColor: color, backColor: color }; // both prim. and sec.
        const first = new Point(0 , 0);
        const num = 10;
        const second = new Point(num, num);
        const ellipse = service.createPath([first, second], false);
        expect(ellipse).toContain(`fill="${color}"`);
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
        const ellipse = service.createPath(pointsContainer, false);

        expect(ellipse).toContain(`stroke="${sec}"`);
    });

    it('should create only an outlined ellipse on plottype = 0', () => {
        service.attr.plotType = 0; // init the plot type
        const prim = '#000000';
        const sec = '#ffffff';
        const back = '#ffffff';
        service.chosenColor = { primColor: prim, secColor: sec, backColor: back };
        const first = new Point(0, 0);
        const num = 10;
        const second = new Point(num , num);
        const ellipse = service.createPath([first, second], false);

        expect(ellipse).toContain(`fill="${'none'}"`); // no color for fill

        expect(ellipse).toContain(`stroke="${sec}"`); // secondary color for border fill
    });

    it('should create only a filled ellipse on plottype = 1', () => {
        service.attr.plotType = 1; // init the plot type
        const prim = '#000000';
        const sec = '#ffffff';
        const back = '#ffffff';
        service.chosenColor = { primColor: prim, secColor: sec, backColor: back };

        const ellipse = service.createPath(ptArr, false);

        expect(ellipse).toContain(`fill="${prim}"`); // primary color fill

        expect(ellipse).toContain(`stroke="${'none'}"`);
    });

    it('should create a filled and outlined ellipse on plottype = 2', () => {
        service.attr.plotType = 2; // init the plot type
        const prim = '#000000';
        const sec = '#ffffff';
        const back = '#ffffff';
        service.chosenColor = { primColor: prim, secColor: sec, backColor: back };
        const first = new Point(0 , 0);
        const num = 10;
        const second = new Point(num, num)
        const ellipse = service.createPath([first, second], false);

        expect(ellipse).toContain(`fill="${prim}"`); // no color for fill

        expect(ellipse).toContain(`stroke="${sec}"`); // secondary color for border fill
    });

    it('should not create an ellipse if the mouse didnt move', () => {
        const newArr = [new Point(0, 0), new Point(0, 0)]; // no move

        const ellipse = service.createPath(newArr, false);

        expect(ellipse).toBe('');
    });

    it('should be named ellipse', () => {
        const firstP = new Point (0, 0)
        const num = 10;
        const secondP = new Point(num, num);
        const path = service.createPath([firstP, secondP], false);
        const name = 'ellipse';
        expect(path).toContain(name);
    });
});
