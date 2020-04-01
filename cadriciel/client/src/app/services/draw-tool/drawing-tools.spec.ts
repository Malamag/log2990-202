import { TestBed } from '@angular/core/testing';

import { DrawingTool } from './drawing-tool';
import { Point } from './point';

describe('drawingTools', () => {
    let service: DrawingTool;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: HTMLElement, useValue: { getAttribute: () => 0 } },
                { provide: Element, useValue: { getAttribute: () => 0 } },
                { provide: Boolean, useValue: false },
                { provide: Number, useValue: 0 },
                { provide: String, useValue: '' },
            ],
        });

        service = TestBed.get(DrawingTool);
        spyOn(window, 'dispatchEvent');
    });

    it('should be created', () => {
        const TEST_SERVICE: DrawingTool = TestBed.get(DrawingTool);
        expect(TEST_SERVICE).toBeTruthy();
    });

    it('should call a subscription to the choosen colors and emit it', () => {
        const SUB_SPY = spyOn(service.colorPick.colorSubject, 'subscribe');
        const EMIT_SPY = spyOn(service.colorPick, 'emitColors');
        const PRIM = '#ffffff';
        const SEC = '#000000';
        const back = '#ffffff';
        service.colorPick.colors = { primColor: PRIM, secColor: SEC, backColor: back };

        service.updateColors();
        expect(SUB_SPY).toHaveBeenCalled();
        expect(EMIT_SPY).toHaveBeenCalled();
    });

    it('should set the colors properly after subscription', () => {
        const PRIM = '#ffff00';
        const SEC = '#0000ff';
        const back = '#ffffff';
        service.colorPick.colors = { primColor: PRIM, secColor: SEC, backColor: back }; // color init in service

        service.updateColors();
        expect(service.chosenColor).toEqual(service.colorPick.colors); // checking the assignation
    });

    it('should set the colors as default if undefined', () => {
        const DEF_PRIM = '#000000ff';
        const DEF_SEC = '#ff0000ff';

        service.updateColors();
        expect(service.chosenColor.primColor).toEqual(DEF_PRIM); // checking the assignation
        expect(service.chosenColor.secColor).toEqual(DEF_SEC);
    });

    it('should empty the progress innerhtml on cancel', () => {
        service.inProgress.innerHTML = 'test';
        service.cancel();
        expect(service.inProgress.innerHTML).toEqual(''); // no svg elements
    });

    it('should assing the newly created form/path in the html', () => {
        service.currentPath = [new Point(0, 0), new Point(1, 1)]; // adding points to avoid having an empty array of progress
        service.createPath = () => 'test'; // stub fn
        service.updateProgress();
        const EMPTY = '';
        const INNER: string = service.inProgress.innerHTML;
        expect(INNER).not.toBe(EMPTY);
    });

    it('should add the progress to the main drawing and refresh the current progress', () => {
        service.currentPath = [new Point(0, 0), new Point(1, 1)]; // adding points to avoid having an empty array of progress
        service.createPath = () => 'test'; // stub function
        service.updateDrawing();

        const EMPTY = '';

        expect(service.drawing).toBeDefined(); // we dont want to have an empty innerhtml

        expect(service.inProgress.innerHTML).toEqual(EMPTY);
        expect(service.currentPath.length).toEqual(0); // progress refresh check
    });

    it('should update the drawing if the mouse is going outside canvas', () => {
        service.isDown = true;
        service.createPath = () => 'test';
        const SPY = spyOn(service, 'updateDrawing');
        service.goingOutsideCanvas(new Point(0, 0)); // random point
        expect(SPY).toHaveBeenCalled();
    });

    it('should continue drawing when mouse goes back in canvas', () => {
        service.isDown = true; // tool selected and in use
        service.down = () => 0; // defining a function for test purpose
        service.createPath = () => 'test';
        const SPY = spyOn(service, 'down');
        const PT = new Point(0, 0); // a point in our canvas, arbitrary
        service.goingInsideCanvas(PT);
        expect(SPY).toHaveBeenCalledWith(PT);
    });

    it('should not call update drawing if the mouse is not down', () => {
        service.isDown = false;
        const SPY = spyOn(service, 'updateDrawing');
        service.goingOutsideCanvas(new Point(0, 0));
        expect(SPY).not.toHaveBeenCalled();
    });

    it('should not call down method if the mouse is not down', () => {
        service.isDown = false;
        service.down = jasmine.createSpy();
        service.goingInsideCanvas(new Point(0, 0));
        expect(service.down).not.toHaveBeenCalled();
    });
});
