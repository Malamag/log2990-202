import { TestBed } from '@angular/core/testing';

import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { Point } from './point';
import { RectangleService } from './rectangle.service';

export class FakeInteractionService extends InteractionService { }

describe('RectangleService', () => {
    // tslint:disable-next-line: no-any
    let kbServiceStub: any;
    let service: RectangleService;
    let ptA: Point;
    let ptB: Point;
    let ptArr: Point[];
    let ptC: Point;

    // Colors taken for the tests
    let primCol: string;
    let secCol: string;
    let backCol: string;

    beforeEach(() => {
        kbServiceStub = {
            shiftDown: true,
            ctrlDown: true,
        };

        ptA = new Point(0, 0); // using a point to test position functions
        ptB = new Point(1, 2);
        ptC = new Point(1 , 2);
        ptArr = [ptA, ptB, ptC];

        primCol = '#000000';
        secCol = '#ffffff';
        backCol = '#ffffff';

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
        const TEST_SERVICE: RectangleService = TestBed.get(RectangleService);
        expect(TEST_SERVICE).toBeTruthy();
    });

    it('should affect is square attribute to true', ()=>{
        const KEYBOARD = new KeyboardHandlerService()
        KEYBOARD.shiftDown = true
        service.updateDown(KEYBOARD)
        expect(service.isSquare).toBeTruthy()
    })
    it('should set the attributes in the subscription', () => {
        service.interaction.emitFormsAttributes({ plotType: 0, lineThickness: 0, numberOfCorners: 0 });
        const SPY_INTERACTION = spyOn(service.interaction.$formsAttributes, 'subscribe');
        service.updateAttributes();
        expect(SPY_INTERACTION).toHaveBeenCalled();
        // tslint:disable-next-line: no-string-literal
        expect(service['attr']).toBeDefined();
    });

    it('should update the current path on mouse down', () => {
        const SPY = spyOn(service, 'updateProgress');
        service.down(ptA);
        expect(service.currentPath.length).toBe(2); // same point added twice to manage static mouse
        expect(service.currentPath).toContain(ptA);

        expect(SPY).toHaveBeenCalled();
    });

    it('should update the drawing on mouse up', () => {
        service.down(ptA); // pressing the mouse
        const SPY = spyOn(service, 'updateDrawing');
        service.up(ptA);
        expect(SPY).toHaveBeenCalled();
    });

    it('should not update the drawing of the tool change is on-the-fly', () => {
        service.ignoreNextUp = true;
        const SPY = spyOn(service, 'updateDrawing');
        service.up(ptA);
        expect(SPY).not.toHaveBeenCalled();
    });

    it('should update the progress on mouse down', () => {
        const SPY = spyOn(service, 'updateProgress');
        service.down(ptA);
        expect(SPY).toHaveBeenCalled();
    });

    it('should add the new position in the current path array on mouse down', () => {
        service.down(ptA);
        service.move(ptA);
        expect(service.currentPath).toContain(ptA);
    });

    it('should create a valid rectangle svg from one point to another', () => {
        const RECT = service.createPath(ptArr);
        expect(RECT).toContain('<rect');
    });

    it('should create a rectangle of the correct dimensions from mouse move', () => {
        const RECT = service.createPath(ptArr);
        const EXP_WIDTH = `width="${ptB.x - ptA.x}"`;
        const EXP_HEIGHT = `height="${ptB.y - ptA.y}"`;

        expect(RECT).toContain(EXP_WIDTH);
        expect(RECT).toContain(EXP_HEIGHT);
    });

    it('should create a rectangle with the selected border thickness', () => {
        const THICK = 1;
        // tslint:disable-next-line: no-string-literal
        service['attr'].lineThickness = THICK; // simulated border thickness
        const RECT = service.createPath(ptArr);
        const EXP_THICK = `stroke-width="${THICK}"`;
        expect(RECT).toContain(EXP_THICK);
    });

    it('should render a square on pressed shift key', () => {
        const NEW_ARR = [new Point(0, 0), new Point(1, 2), new Point(1, 1)]; // forcing a square
        const FAKE_SQUARE = service.createPath(NEW_ARR);

        // tslint:disable-next-line: no-string-literal
        service['isSquare'] = true;
        const SQUARE = service.createPath(ptArr);

        expect(SQUARE).toEqual(FAKE_SQUARE);
    });

    it('should create a rectangle with corner at mouse start', () => {
        const RECT = service.createPath(ptArr);

        expect(RECT).toContain(`x="${0}"`);
        expect(RECT).toContain(`y="${0}"`);
    });

    it('should create a rectangle filled with the selected color', () => {
        const COLOR = primCol;
        service.chosenColor = { primColor: COLOR, secColor: COLOR, backColor: COLOR }; // both prim. and sec.

        const RECT = service.createPath(ptArr);
        expect(RECT).toContain(`fill="${COLOR}"`);
    });

    it('should create a border of the selected secondary color', () => {
        service.chosenColor = { primColor: primCol, secColor: secCol, backColor: backCol };
        const RECT = service.createPath(ptArr);

        expect(RECT).toContain(`stroke="${secCol}"`);
    });

    it('should create only an outlined rectangle on plottype = 0', () => {
        // tslint:disable-next-line: no-string-literal
        service['attr'].plotType = 0; // init the plot type
        service.chosenColor = { primColor: primCol, secColor: secCol, backColor: backCol };

        const RECT = service.createPath(ptArr);

        expect(RECT).toContain(`fill="${'none'}"`); // no color for fill

        expect(RECT).toContain(`stroke="${secCol}"`); // secondary color for border fill
    });

    it('should create only a filled rectangle on plottype = 1', () => {
        // tslint:disable-next-line: no-string-literal
        service['attr'].plotType = 1; // init the plot type
        service.chosenColor = { primColor: primCol, secColor: secCol, backColor: backCol };

        const RECT = service.createPath(ptArr);

        expect(RECT).toContain(`fill="${primCol}"`); // primary color fill

        expect(RECT).toContain(`stroke="${'none'}"`);
    });

    it('should create a filled and outlined rectangle on plottype = 2', () => {
        // tslint:disable-next-line: no-string-literal
        service['attr'].plotType = 2; // init the plot type
        service.chosenColor = { primColor: primCol, secColor: secCol, backColor: backCol };

        const RECT = service.createPath(ptArr);

        expect(RECT).toContain(`fill="${primCol}"`); // no color for fill

        expect(RECT).toContain(`stroke="${secCol}"`); // secondary color for border fill
    });

    it('should not create a rectange if the mouse didnt move', () => {
        const NEW_ARR = [ptA, ptA]; // no move

        const RECT = service.createPath(NEW_ARR);

        expect(RECT).toBe('');
    });

    it('should be named rectangle', () => {
        const PATH = service.createPath(ptArr);
        const NAME = 'rectangle';
        expect(PATH).toContain(NAME);
    });
});
