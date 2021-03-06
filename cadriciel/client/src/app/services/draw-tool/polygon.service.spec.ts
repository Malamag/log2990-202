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

    // Colors taken for the tests
    let primCol: string;
    let secCol: string;
    let backCol: string;

    beforeEach(() => {
        ptA = new Point(0, 0); // using a point to test position functions
        ptB = new Point(1, 2);
        ptC = new Point(1, 2);
        ptArr = [ptA, ptB, ptC];

        primCol = '#000000';
        secCol = '#ffffff';
        backCol = '#ffffff';

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
        const TEST_SERVICE: PolygonService = TestBed.get(PolygonService);
        expect(TEST_SERVICE).toBeTruthy();
    });

    it('should set the attributes in the subscription', () => {
        service.interaction.emitFormsAttributes({ plotType: 0, lineThickness: 0, numberOfCorners: 0 });
        const SPY_INTERACTION = spyOn(service.interaction.$formsAttributes, 'subscribe');
        service.updateAttributes();
        expect(SPY_INTERACTION).toHaveBeenCalled();
        expect(service.attr).toBeDefined();
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
        const RECT = service.createPath(ptArr, false);
        expect(RECT).toContain('<rect');
    });

    it('should create a valid polygon svg from one point to another', () => {
        const POLYGON = service.createPath(ptArr, true);
        expect(POLYGON).toContain('<polygon');
    });

    it('should change the number of corners of the polygon', () => {
        const CORNERS = 7;
        service.attr.numberOfCorners = CORNERS; // simulated border thickness
        service.createPath(ptArr, true);

        // tslint:disable-next-line: no-string-literal
        expect(service['corners'].length).toEqual(CORNERS);
    });

    it('should create a polygon with the selected border thickness', () => {
        const THICK = 1;
        service.attr.lineThickness = THICK; // simulated border thickness
        const POLYGON = service.createPath(ptArr, true);
        const EXP_THICK = `stroke-width="${THICK}"`;

        expect(POLYGON).toContain(EXP_THICK);
    });

    it('should create a polygon filled with the selected color', () => {
        const COLOR = primCol;
        service.chosenColor = { primColor: COLOR, secColor: COLOR, backColor: COLOR }; // both prim. and sec.
        const POLYGON = service.createPath(ptArr, true);

        expect(POLYGON).toContain(`fill="${COLOR}"`);
    });

    it('should create a border of the selected secondary color', () => {
        service.chosenColor = { primColor: primCol, secColor: secCol, backColor: backCol };
        const POLYGON = service.createPath(ptArr, true);

        expect(POLYGON).toContain(`stroke="${secCol}"`);
    });

    it('should create only an outlined polygon on plottype = 0', () => {
        service.attr.plotType = 0; // init the plot type
        service.chosenColor = { primColor: primCol, secColor: secCol, backColor: backCol };
        const POLYGON = service.createPath(ptArr, true);

        expect(POLYGON).toContain(`fill="${'none'}"`); // no color for fill
        expect(POLYGON).toContain(`stroke="${secCol}"`); // secondary color for border fill
    });

    it('should create only a filled polygon on plottype = 1', () => {
        service.attr.plotType = 1; // init the plot type
        service.chosenColor = { primColor: primCol, secColor: secCol, backColor: backCol };

        const POLYGON = service.createPath(ptArr, true);

        expect(POLYGON).toContain(`fill="${primCol}"`); // primary color fill
        expect(POLYGON).toContain(`stroke="${'none'}"`);
    });

    it('should create a filled and outlined polygon on plottype = 2', () => {
        service.attr.plotType = 2; // init the plot type
        service.chosenColor = { primColor: primCol, secColor: secCol, backColor: backCol };
        const POLYGON = service.createPath(ptArr, true);

        expect(POLYGON).toContain(`fill="${primCol}"`); // no color for fill
        expect(POLYGON).toContain(`stroke="${secCol}"`); // secondary color for border fill
    });

    it('should not create an polygon if the mouse didnt move', () => {
        const NEW_ARR = [ptA, ptA]; // no movement
        const POLYGON = service.createPath(NEW_ARR, true);
        expect(POLYGON).toEqual('');
    });

    it('should be not create a polygon if the path has less than 2 points', () => {
        const PATH = service.createPath([ptA], true);
        expect(PATH).toEqual('');
    });

    it('should be named polygon', () => {
        const PATH = service.createPath(ptArr, true);
        const NAME = 'polygon';
        expect(PATH).toContain(NAME);
    });

    it('should align all points inside the perimeter if it exceeds to the left ', () => {
        service.createPath(ptArr, true);

        // tslint:disable-next-line: no-string-literal
        const POINTS = service['corners'];

        // Need to assign the values and not the object for the test to work
        const POINT_A = POINTS[0].x;
        const POINT_B = POINTS[1].x;
        const POINT_C = POINTS[2].x;

        const OFFSET = 10;
        // tslint:disable-next-line: no-string-literal
        service['startX'] = service['leftPoint'];
        // tslint:disable-next-line: no-string-literal
        service['leftPoint'] = service['leftPoint'] - OFFSET;
        service.alignCorners();

        // Expect alignCorners to have moved the points by the OFFSET amount
        expect(POINTS[0].x).toEqual(POINT_A + OFFSET);
        expect(POINTS[1].x).toEqual(POINT_B + OFFSET);
        expect(POINTS[2].x).toEqual(POINT_C + OFFSET);

    });

    it('should align all points inside the perimeter if it exceeds to the right ', () => {
        service.createPath(ptArr, true);

        // tslint:disable-next-line: no-string-literal
        const POINTS = service['corners'];

        // Need to assign the values and not the object for the test to work
        const POINT_A = POINTS[0].x;
        const POINT_B = POINTS[1].x;
        const POINT_C = POINTS[2].x;

        const OFFSET = 10;
        // tslint:disable-next-line: no-string-literal
        service['startX'] = service['rightPoint'];
        // tslint:disable-next-line: no-string-literal
        service['rightPoint'] = service['rightPoint'] + OFFSET;
        service.alignCorners();

        // Expect alignCorners to have moved the points by the OFFSET amount
        expect(POINTS[0].x).toEqual(POINT_A - OFFSET);
        expect(POINTS[1].x).toEqual(POINT_B - OFFSET);
        expect(POINTS[2].x).toEqual(POINT_C - OFFSET);

    });

    it('should have perimeter width to be dependant of stroke width', () => {
        const lineThickness = 20;
        service.attr.lineThickness = lineThickness;
        const PATH = service.createPath(ptArr, false);
        // tslint:disable-next-line: no-string-literal
        const WIDTH_EXPECTED = service['leftPoint'] - service['rightPoint'] + service.attr.lineThickness;
        expect(PATH).toContain(`width="${WIDTH_EXPECTED}"`);
    });

    it('should have perimeter height to be dependant of stroke height', () => {
        const lineThickness = 20;
        service.attr.lineThickness = lineThickness;
        const PATH = service.createPath(ptArr, false);
        const END_Y_POINT = Math.floor(service.attr.numberOfCorners / 2);
        // tslint:disable-next-line: no-string-literal
        let heightExpected = Math.abs(service['startY'] - service['corners'][END_Y_POINT].y);
        heightExpected += service.attr.lineThickness;
        expect(PATH).toContain(`height="${heightExpected}"`);
    });

    it('should not create perimeter if the polygon is finished updating', () => {
        const PATH = service.createPath(ptArr, true);
        expect(PATH).not.toContain('<rect');
    });

});
