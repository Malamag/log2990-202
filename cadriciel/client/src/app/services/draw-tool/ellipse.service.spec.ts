import { TestBed } from '@angular/core/testing';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { EllipseService } from './ellipse.service';
import { Point } from './point';
import { ShapeService } from './shape.service';

export class FakeInteractionService extends InteractionService { }
fdescribe('EllipseService', () => {

    // tslint:disable-next-line: no-any
    let kbServiceStub: any;
    let service: EllipseService;
    let ptA: Point;
    let ptB: Point;
    let ptArr: Point[];

    // tslint:disable-next-line: no-any
    let shapeServiceStub: any;

    // Colors taken for the tests
    let primCol: string;
    let secCol: string;
    let backCol: string;

    beforeEach(() => {
        shapeServiceStub = {
            width: 5,
            height: 2,
            setDimensions: () => 0,
            updateDown: () => 0
        };

        kbServiceStub = {
            shiftDown: true,
            ctrlDown: true,
        };

        ptA = new Point(0, 0); // using a point to test position functions
        // tslint:disable-next-line: no-magic-numbers
        ptB = new Point(5, 7);  // random numbers for test
        ptArr = [ptA, ptB];

        primCol = '#000000';
        secCol = '#ffffff';
        backCol = '#ffffff';

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
                { provide: ShapeService, useValue: shapeServiceStub }
            ],
        });
        service = TestBed.get(EllipseService);
    });

    it('should be created', () => {
        const TEST_SERVICE: EllipseService = TestBed.get(EllipseService);
        expect(TEST_SERVICE).toBeTruthy();
    });

    it('should set the attributes in the subscription', () => {
        service.interaction.emitFormsAttributes({ plotType: 0, lineThickness: 0, numberOfCorners: 0 });
        const SPY_INTERACTION = spyOn(service.interaction.$formsAttributes, 'subscribe');
        service.updateAttributes();
        expect(SPY_INTERACTION).toHaveBeenCalled();
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
        const RECT = service.createPath(ptArr, false);
        expect(RECT).toContain('<rect');
    });

    it('should create a valid ellipse svg from one point to another', () => {
        const ELLIPSE = service.createPath(ptArr, false);
        expect(ELLIPSE).toContain('<ellipse');
    });

    it('should create a rectangle of the correct dimensions from mouse move', () => {
        const RECT = service.createPath(ptArr, false);
        const ADD = 5;
        const EXP_WIDTH = `width="${ptB.x - ptA.x + ADD}"`;
        const EXP_HEIGHT = `height="${ptB.y - ptA.y + ADD}"`;

        expect(RECT).toContain(EXP_WIDTH);
        expect(RECT).toContain(EXP_HEIGHT);
    });

    it('should create an ellipse with the selected border thickness', () => {
        const THICK = 1;
        service.attr.lineThickness = THICK; // simulated border thickness
        const ELLIPSE = service.createPath(ptArr, false);
        const EXP_THICK = `stroke-width="${THICK}"`;

        expect(ELLIPSE).toContain(EXP_THICK);
    });

    it('should render a circle on pressed shift key', () => {
        const COORDS = 5;
        const NEW_ARR = [new Point(0, 0), new Point(COORDS, COORDS)]; // forcing a circle
        const FAKE_CIRCLE = service.createPath(NEW_ARR, false);

        service.isSquare = true;
        const CIRCLE = service.createPath(ptArr, false);

        expect(CIRCLE).toEqual(FAKE_CIRCLE);
    });

    it('should create a rectangle with corner at mouse start', () => {
        const RECT = service.createPath(ptArr, false);

        expect(RECT).toContain('<rect');
    });

    it('should create an ellipse filled with the selected color', () => {
        const COLOR = primCol;
        service.chosenColor = { primColor: COLOR, secColor: COLOR, backColor: COLOR }; // both prim. and sec.
        const ELLIPSE = service.createPath(ptArr, false);

        expect(ELLIPSE).toContain(`fill="${COLOR}"`);
    });

    it('should create a border of the selected secondary color', () => {

        service.chosenColor = { primColor: primCol, secColor: secCol, backColor: backCol };
        const ELLIPSE = service.createPath(ptArr, false);

        expect(ELLIPSE).toContain(`stroke="${secCol}"`);
    });

    it('should create only an outlined ellipse on plottype = 0', () => {
        service.attr.plotType = 0; // init the plot type
        service.chosenColor = { primColor: primCol, secColor: secCol, backColor: backCol };
        const ELLIPSE = service.createPath(ptArr, false);

        expect(ELLIPSE).toContain(`fill="${'none'}"`); // no color for fill

        expect(ELLIPSE).toContain(`stroke="${secCol}"`); // secondary color for border fill
    });

    it('should create only a filled ellipse on plottype = 1', () => {
        service.attr.plotType = 1; // init the plot type

        service.chosenColor = { primColor: primCol, secColor: secCol, backColor: backCol };

        const ELLIPSE = service.createPath(ptArr, false);

        expect(ELLIPSE).toContain(`fill="${primCol}"`); // primary color fill

        expect(ELLIPSE).toContain(`stroke="${'none'}"`);
    });

    it('should create a filled and outlined ellipse on plottype = 2', () => {
        service.attr.plotType = 2; // init the plot type
        service.chosenColor = { primColor: primCol, secColor: secCol, backColor: backCol };
        const ELLIPSE = service.createPath(ptArr, false);

        expect(ELLIPSE).toContain(`fill="${primCol}"`); // no color for fill

        expect(ELLIPSE).toContain(`stroke="${secCol}"`); // secondary color for border fill
    });

    it('should not create an ellipse if the mouse didnt move', () => {
        const NEW_ARR = [new Point(0, 0), new Point(0, 0)]; // no move

        const ELLIPSE = service.createPath(NEW_ARR, false);

        expect(ELLIPSE).toBe('');
    });

    it('should be named ellipse', () => {
        const PATH = service.createPath(ptArr, false);
        const NAME = 'ellipse';
        expect(PATH).toContain(NAME);
    });

    it('should set square boolean on shift down', () => {
        service.updateDown(kbServiceStub);
        expect(service.isSquare).toBeTruthy();
    });

    it('should return an empty string if there is not enough points to compute', () => {
        const TEST_ARR = [ptB];
        const HTML_STR = service.createPath(TEST_ARR, false);
        expect(HTML_STR).toEqual('');
    });

    it('should return an empty string if width or height equal 0', () => {
        service.attr.plotType = 1;
        const HTML_STR = service.createPath([new Point(0, 0), new Point(0, 0)], false);
        expect(HTML_STR).toEqual('');
    });

    it('should set smallest dimension between width and height', () => {
        const BOUND = 7;
        service.isSquare = true;
        const H_TEST = [new Point(0, 2), new Point(0, BOUND)];
        const W_TEST = [new Point(0, 0), new Point(BOUND, 0)];

        service.setdimensions(H_TEST);
        // tslint:disable-next-line: no-string-literal
        expect(service['smallest']).toEqual(service.width);
        service.setdimensions(W_TEST);
        // tslint:disable-next-line: no-string-literal
        expect(service['smallest']).toEqual(service.height);
    });

    it('should not add the rectangular perimeter on remove boolean equals true', () => {
        const FULL_STR = service.createPath(ptArr, true); // removePerimeter is true
        expect(FULL_STR).not.toContain('rect');
    });

});
