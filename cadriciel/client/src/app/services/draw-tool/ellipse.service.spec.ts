import { TestBed } from '@angular/core/testing';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { EllipseService } from './ellipse.service';
import { Point } from './point';

export class fakeInteractionService extends InteractionService {}
describe('EllipseService', () => {
    let kbServiceStub: any;
    let service: EllipseService;
    let ptA: Point;
    let ptB: Point;
    let ptArr: Point[];
    let ptAStub: Point
    let ptBStub : Point
    let ptArrStub : Point[]
    beforeEach(() => {
        kbServiceStub = {
            shiftDown: true,
            ctrlDown: true,
        };

        ptA = new Point(0, 0); // using a point to test position functions
        ptB = new Point(1, 2);
        ptArr = [ptA, ptB];
        ptAStub = new Point(0,0);
        ptBStub = new Point(10,10);
        ptArrStub = [ptAStub, ptBStub]
        TestBed.configureTestingModule({
            providers: [
                EllipseService,
                { provide: Point },
                { provide: HTMLElement, useValue: {} },
                { provide: Number, useValue: 0 },
                { provide: String, useValue: '' },
                { provide: Boolean, useValue: true },
                { provide: InteractionService, useClass: fakeInteractionService },
                { provide: KeyboardHandlerService, useValue: kbServiceStub },
            ],
        });
        service = TestBed.get(EllipseService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set the attributes in the subscription', () => {
        service.interaction.emitFormsAttributes({plotType: 0, lineThickness: 0, numberOfCorners: 0});
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
        const rect = service.createPath(ptArrStub, false);
        expect(rect).toContain('<rect');
    });

    it('should create a valid ellipse svg from one point to another', () => {
        const rect = service.createPath(ptArrStub, false);
        expect(rect).toContain('<ellipse');
    });

    it('should create a rectangle of the correct dimensions from mouse move', () => {
        const rect = service.createPath(ptArrStub, false);
        const expWidth = `width="${ptBStub.x - ptAStub.x+ service.attr.lineThickness}"`;
        const expHeigth = `height="${ptBStub.y - ptAStub.y + service.attr.lineThickness}"`;

        expect(rect).toContain(expWidth);
        expect(rect).toContain(expHeigth);
    });

    it('should create a rectangle with the selected border thickness', () => {
        const thick = 1;
        service.attr.lineThickness = thick; // simulated border thickness
        const rect = service.createPath(ptArrStub, false);
        const expTick = `stroke-width="${thick}"`;
        expect(rect).toContain(expTick);
    });

    it('should render a square on pressed shift key', () => {
        const newArr = [new Point(0, 0), new Point(1, 1)]; // forcing a square
        const fakeSquare = service.createPath(newArr, false);

        service.isSquare = true;
        const square = service.createPath(ptArr, false);

        expect(square).toEqual(fakeSquare);
    });

    it('should create a rectangle with corner at mouse start', () => {
        const rect = service.createPath(ptArrStub, false);

        expect(rect).toContain('<g name = "ellipse" style="transform: translate(0px, 0px);"><ellipse cx="5" cy="5" rx="5" ry="5"" fill="#000000ff"stroke-width="5" stroke="#ff0000ff"/><rect x="-2.5" y="-2.5"width="15" height="15"style="stroke:lightgrey;stroke-width:2;fill-opacity:0.0;stroke-opacity:0.9"stroke-width="5" stroke-dasharray="4"/></g>');
        expect(rect).toContain('<g name = "ellipse" style="transform: translate(0px, 0px);"><ellipse cx="5" cy="5" rx="5" ry="5"" fill="#000000ff"stroke-width="5" stroke="#ff0000ff"/><rect x="-2.5" y="-2.5"width="15" height="15"style="stroke:lightgrey;stroke-width:2;fill-opacity:0.0;stroke-opacity:0.9"stroke-width="5" stroke-dasharray="4"/></g>');
    });

    it('should create a rectangle filled with the selected color', () => {
        const color = '#ffffff';
        service.chosenColor = {primColor: color, secColor: color, backColor: color}; // both prim. and sec.

        const rect = service.createPath(ptArrStub, false);
        expect(rect).toContain(`fill="${color}"`);
    });

    it('should create a border of the selected secondary color', () => {
        const prim = '#000000';
        const sec = '#ffffff';
        const back = '#ffffff';
        service.chosenColor = {primColor: prim, secColor: sec, backColor: back};
        const rect = service.createPath(ptArrStub, false);

        expect(rect).toContain(`stroke="${sec}"`);
    });

    it('should create only an outlined rectangle on plottype = 0', () => {
        service.attr.plotType = 0; // init the plot type
        const prim = '#000000';
        const sec = '#ffffff';
        const back = '#ffffff';
        service.chosenColor = {primColor: prim, secColor: sec, backColor: back};

        const rect = service.createPath(ptArrStub, false);

        expect(rect).toContain(`fill="${'none'}"`); // no color for fill

        expect(rect).toContain(`stroke="${sec}"`); // secondary color for border fill
    });

    it('should create only a filled rectangle on plottype = 1', () => {
        service.attr.plotType = 1; // init the plot type
        const prim = '#000000';
        const sec = '#ffffff';
        const back = '#ffffff';
        service.chosenColor = {primColor: prim, secColor: sec, backColor: back};

        const rect = service.createPath(ptArrStub, false);

        expect(rect).toContain(`fill="${prim}"`); // primary color fill

        expect(rect).toContain(`stroke="${'none'}"`);
    });

    it('should create a filled and outlined rectangle on plottype = 2', () => {
        service.attr.plotType = 2; // init the plot type
        const prim = '#000000';
        const sec = '#ffffff';
        const back = '#ffffff';
        service.chosenColor = {primColor: prim, secColor: sec, backColor: back};

        const rect = service.createPath(ptArrStub, false);

        expect(rect).toContain(`fill="${prim}"`); // no color for fill

        expect(rect).toContain(`stroke="${sec}"`); // secondary color for border fill
    });

    it('should not create an ellipse if the mouse didnt move', () => {
        const newArr = [new Point(0, 0), new Point(0, 0)]; // no move

        const rect = service.createPath(newArr, false);

        expect(rect).toBe('');
    });

    it('should be named ellipse', () => {
        const path = service.createPath(ptArrStub, false);
        const name = 'ellipse';
        expect(path).toContain(name);
    });
});
