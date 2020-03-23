import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { UndoRedoService } from './undo-redo.service';

describe('UndoRedoService', () => {
    let service: UndoRedoService;
    // tslint:disable-next-line: no-any
    let drawingStub: any;
    // tslint:disable-next-line: prefer-const
    let renderStub: Renderer2;
    beforeEach(() =>
        TestBed.configureTestingModule({
            providers: [
                { provide: HTMLElement, useValue: drawingStub },
                { provide: Renderer2, useValue: renderStub },
            ],
        }),
    );
    beforeEach(() => {
        drawingStub = {
            innerHTML: '<div> hello world </div>',
        };
        service = TestBed.get(UndoRedoService);
        service.done = [];
        service.undone = [];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should empty the undone list and fill the done list and update the buttons', () => {
        const SPY_UPDATE = spyOn(service, 'updateButtons');
        service.interact.emitDrawingDone();
        service.updateContainer();
        expect(service.done.length).toBeGreaterThan(0);
        expect(service.undone.length).toEqual(0);
        expect(SPY_UPDATE).toHaveBeenCalled();
    });
    it('should not updateButtons and not empty the undone container', () => {
        service.undone = ['hello'];
        service.interact.drawingDone.next(false);
        const SPY = spyOn(service, 'updateButtons');
        service.updateContainer();
        expect(service.undone.length).toEqual(1);
        expect(SPY).toHaveBeenCalledTimes(0);
    });
    it('should empty the undone list', () => {
        service.undone = ['hello'];
        service.interact.emitDrawingDone();
        service.updateContainer();
        expect(service.undone.length).toEqual(0);
    });

    it('should empty the undone list', () => {
        service.done.push('hello');
        service.undone.push('world');
        service.interact.emitContinueDrawing();
        service.updateDoneContainer();
        expect(service.undone.length).toEqual(0);
    });
    it('should not push anything in done container', () => {
        const SPY = spyOn(service.done, 'push');
        service.interact.drawingContinued.next(false);
        service.updateDoneContainer();
        expect(SPY).toHaveBeenCalledTimes(0);
    });
    it('should empty the done list and fill the undone list', () => {
        service.done = [];
        service.done.push('hello');
        const DISPATCH_SPY = spyOn(window, 'dispatchEvent');
        service.undo();
        expect(service.done.length).toEqual(0);
        expect(service.undone.length).toEqual(1);
        expect(DISPATCH_SPY).toHaveBeenCalledTimes(0);
    });
    it('should call the dispatcher', () => {
        service.done.push('hello');
        service.done.push('world');
        const DISPATCH_SPY = spyOn(window, 'dispatchEvent');
        service.undo();
        expect(DISPATCH_SPY).toHaveBeenCalled();
    });
    it('should not pop from done list', () => {
        const POP_SPY = spyOn(service.done, 'pop');
        service.undo();
        expect(POP_SPY).toHaveBeenCalledTimes(0);
    });
    it('should not pop from undone list', () => {
        const POP_SPY = spyOn(service.undone, 'pop');
        service.redo();
        expect(POP_SPY).toHaveBeenCalledTimes(0);
    });
    it('should empty the undone list and fill the done list and call the dispatcher', () => {
        service.undone.push('hello');
        const DISPATCH_SPY = spyOn(window, 'dispatchEvent');
        service.redo();
        expect(service.done.length).toEqual(1);
        expect(service.undone.length).toEqual(0);
        expect(DISPATCH_SPY).toHaveBeenCalled();
    });
    it('should call undo', () => {
        const NAME = 'Annuler';
        const SPY = spyOn(service, 'undo');
        const UPDATE_SPY = spyOn(service, 'updateButtons');
        service.apply(NAME);
        expect(SPY).toHaveBeenCalled();
        expect(UPDATE_SPY).toHaveBeenCalled();
    });
    it('should call redo', () => {
        const NAME = 'Refaire';
        const SPY = spyOn(service, 'redo');
        const UPDATE_SPY = spyOn(service, 'updateButtons');
        service.apply(NAME);
        expect(SPY).toHaveBeenCalled();
        expect(UPDATE_SPY).toHaveBeenCalled();
    });
    it('should emit enable disable', () => {
        const EMIT_SPY = spyOn(service.interact, 'emitEnableDisable');
        service.updateButtons();
        expect(EMIT_SPY).toHaveBeenCalled();
    });
});
