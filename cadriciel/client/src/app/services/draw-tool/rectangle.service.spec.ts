import { TestBed } from '@angular/core/testing';

import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { Point } from './point';
import { RectangleService } from './rectangle.service';

export class FakeInteractionService extends InteractionService {}

describe('RectangleService', () => {
    let kbServiceStub: any;
    let service: RectangleService;
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
                RectangleService,
                { provide: Point },
                { provide: HTMLElement, useValue: {} },
                { provide: Number, useValue: 0 },
                { provide: String, useValue: '' },
                { provide: Boolean, useValue: true },
                { provide: InteractionService, useClass: FakeInteractionService },
                { provide: KeyboardHandlerService, useValue: kbServiceStub },
            ],
        });
        service = TestBed.get(RectangleService);
    });

    it('should be created', () => {
        const testservice: RectangleService = TestBed.get(RectangleService);
        expect(testservice).toBeTruthy();
    });

    it('should set the attributes in the subscription', () => {
        service.interaction.emitFormsAttributes({ plotType: 0, lineThickness: 0, numberOfCorners: 0 });
        const spyInteraction = spyOn(service.interaction.$formsAttributes, 'subscribe');
        service.updateAttributes();
        expect(spyInteraction).toHaveBeenCalled();
        // tslint:disable-next-line: no-string-literal
        expect(service['attr']).toBeDefined();
    });

    it('should update progress on move', () => {
        const spy = spyOn(service, 'updateProgress');
        service.down(ptA); // simulating a mouse down at given point
        service.update(kbServiceStub);
        expect(service.isSquare).toBeTruthy();
        expect(spy).toHaveBeenCalled();
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
        const ptAStub = new Point(0,0);
        const ptBStub = new Point(10,10)
        const rect = service.createPath([ptAStub, ptBStub]);
        expect(rect).toContain('<rect');
    });

    it('should create a rectangle of the correct dimensions from mouse move', () => {
        const ptAStub = new Point(0,0);
        const ptBStub = new Point(10,10)
        const rect = service.createPath([ptAStub, ptBStub]);
        const expWidth = `width="${ptBStub.x - ptAStub.x}"`;
        const expHeigth = `height="${ptBStub.y - ptAStub.y}"`;

        expect(rect).toContain(expWidth);
        expect(rect).toContain(expHeigth);
    });

    it('should create a rectangle with the selected border thickness', () => {
        const thick = 1;
        // tslint:disable-next-line: no-string-literal
        service['attr'].lineThickness = thick; // simulated border thickness
        const ptAStub = new Point(0,0);
        const ptBStub = new Point(10,10)
        const rect = service.createPath([ptAStub, ptBStub]);
        const expTick = `stroke-width="${thick}"`;
        expect(rect).toContain(expTick);
    });

    it('should render a square on pressed shift key', () => {
        const newArr = [new Point(0, 0), new Point(1, 1)]; // forcing a square
        const fakeSquare = service.createPath(newArr);

        service.isSquare = true;
        const square = service.createPath(ptArr);

        expect(square).toEqual(fakeSquare);
    });

    it('should create a rectangle with corner at mouse start', () => {
        const ptAStub = new Point(0,0);
        const ptBStub = new Point(10,10)
        const rect = service.createPath([ptAStub, ptBStub]);

        expect(rect).toContain(`x="${0}"`);
        expect(rect).toContain(`y="${0}"`);
    });

    it('should create a rectangle filled with the selected color', () => {
        const color = '#ffffff';
        service.chosenColor = { primColor: color, secColor: color, backColor: color }; // both prim. and sec.

        const ptAStub = new Point(0,0);
        const ptBStub = new Point(10,10)
        const rect = service.createPath([ptAStub, ptBStub]);
        expect(rect).toContain(`fill="${color}"`);
    });

    it('should create a border of the selected secondary color', () => {
        const prim = '#000000';
        const sec = '#ffffff';
        const back = '#ffffff';
        service.chosenColor = { primColor: prim, secColor: sec, backColor: back };
        const ptAStub = new Point(0,0);
        const ptBStub = new Point(10,10)
        const rect = service.createPath([ptAStub, ptBStub]);

        expect(rect).toContain(`stroke="${sec}"`);
    });

    it('should create only an outlined rectangle on plottype = 0', () => {
        // tslint:disable-next-line: no-string-literal
        service['attr'].plotType = 0; // init the plot type
        const prim = '#000000';
        const sec = '#ffffff';
        const back = '#ffffff';
        service.chosenColor = { primColor: prim, secColor: sec, backColor: back };
        const ptAStub = new Point(0,0);
        const ptBStub = new Point(10,10)
        const rect = service.createPath([ptAStub, ptBStub]);

        expect(rect).toContain(`fill="${'none'}"`); // no color for fill

        expect(rect).toContain(`stroke="${sec}"`); // secondary color for border fill
    });

    it('should create only a filled rectangle on plottype = 1', () => {
        // tslint:disable-next-line: no-string-literal
        service['attr'].plotType = 1; // init the plot type
        const prim = '#000000';
        const sec = '#ffffff';
        const back = '#ffffff';
        service.chosenColor = { primColor: prim, secColor: sec, backColor: back };
        const ptAStub = new Point(0,0);
        const ptBStub = new Point(10,10)
        const rect = service.createPath([ptAStub, ptBStub]);
        expect(rect).toContain(`fill="${prim}"`); // primary color fill

        expect(rect).toContain(`stroke="${'none'}"`);
    });

    it('should create a filled and outlined rectangle on plottype = 2', () => {
        // tslint:disable-next-line: no-string-literal
        service['attr'].plotType = 2; // init the plot type
        const prim = '#000000';
        const sec = '#ffffff';
        const back = '#ffffff';
        service.chosenColor = { primColor: prim, secColor: sec, backColor: back };
        const ptAStub = new Point(0,0);
        const ptBStub = new Point(10,10)
        const rect = service.createPath([ptAStub, ptBStub]);

        expect(rect).toContain(`fill="${prim}"`); // no color for fill

        expect(rect).toContain(`stroke="${sec}"`); // secondary color for border fill
    });

    it('should not create a rectange if the mouse didnt move', () => {
        const newArr = [new Point(0, 0), new Point(0, 0)]; // no move

        const rect = service.createPath(newArr);

        expect(rect).toBe('');
    });

    it('should be named rectangle', () => {
        const ptAStub = new Point(0,0);
        const ptBStub = new Point(10,10)
        const path = service.createPath([ptAStub, ptBStub]);
        const name = 'rectangle';
        expect(path).toContain(name);
    });
});
