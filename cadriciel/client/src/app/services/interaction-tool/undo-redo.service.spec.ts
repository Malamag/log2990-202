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
        const spyUpdate = spyOn(service, 'updateButtons');
        service.interact.emitDrawingDone();
        service.updateContainer();
        expect(service.done.length).toBeGreaterThan(0);
        expect(service.undone.length).toEqual(0);
        expect(spyUpdate).toHaveBeenCalled();
    });
    it('should not updateButtons and not empty the undone container', () => {
        service.undone = ['hello'];
        service.interact.drawingDone.next(false);
        const spy = spyOn(service, 'updateButtons');
        service.updateContainer();
        expect(service.undone.length).toEqual(1);
        expect(spy).toHaveBeenCalledTimes(0);
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
        const spy = spyOn(service.done, 'push');
        service.interact.drawingContinued.next(false);
        service.updateDoneContainer();
        expect(spy).toHaveBeenCalledTimes(0);
    });
    it('should empty the done list and fill the undone list', () => {
        service.done = [];
        service.done.push('hello');
        const dispatchSpy = spyOn(window, 'dispatchEvent');
        service.undo();
        expect(service.done.length).toEqual(0);
        expect(service.undone.length).toEqual(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(0);
    });
    it('should call the dispatcher', () => {
        service.done.push('hello');
        service.done.push('world');
        const dispatchSpy = spyOn(window, 'dispatchEvent');
        service.undo();
        expect(dispatchSpy).toHaveBeenCalled();
    });
    it('should not pop from done list', () => {
        const popSpy = spyOn(service.done, 'pop');
        service.undo();
        expect(popSpy).toHaveBeenCalledTimes(0);
    });
    it('should not pop from undone list', () => {
        const popSpy = spyOn(service.undone, 'pop');
        service.redo();
        expect(popSpy).toHaveBeenCalledTimes(0);
    });
    it('should empty the undone list and fill the done list and call the dispatcher', () => {
        service.undone.push('hello');
        const dispatchSpy = spyOn(window, 'dispatchEvent');
        service.redo();
        expect(service.done.length).toEqual(1);
        expect(service.undone.length).toEqual(0);
        expect(dispatchSpy).toHaveBeenCalled();
    });
    it('should call undo', () => {
        const name = 'Annuler';
        const spy = spyOn(service, 'undo');
        const updateSpy = spyOn(service, 'updateButtons');
        service.apply(name);
        expect(spy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalled();
    });
    it('should call redo', () => {
        const name = 'Refaire';
        const spy = spyOn(service, 'redo');
        const updateSpy = spyOn(service, 'updateButtons');
        service.apply(name);
        expect(spy).toHaveBeenCalled();
        expect(updateSpy).toHaveBeenCalled();
    });
    it('should emit enable disable', () => {
        const emitSpy = spyOn(service.interact, 'emitEnableDisable');
        service.updateButtons();
        expect(emitSpy).toHaveBeenCalled();
    });
});
