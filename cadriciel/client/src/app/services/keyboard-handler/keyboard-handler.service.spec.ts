import { TestBed } from '@angular/core/testing';
import { InputObserver } from '../draw-tool/input-observer';
import { KeyboardHandlerService } from './keyboard-handler.service';

describe('KeyboardHandlerService', () => {
    let service: KeyboardHandlerService;
    let observerStub: any;
    let kbEventStub: any;
    beforeEach(() => {
        kbEventStub = {
            keyCode: 0,
        };
        observerStub = {
            selected: true,

            update: () => 0,
            cancel: () => 0,
        };

        TestBed.configureTestingModule({
            providers: [{ provide: InputObserver, useValue: observerStub }],
        });

        service = new KeyboardHandlerService();
    });

    it('should be created', () => {
        const service: KeyboardHandlerService = TestBed.get(KeyboardHandlerService);
        expect(service).toBeTruthy();
    });

    it('should properly add tool observers', () => {
        service.toolObservers = [];

        const obs = observerStub;
        service.addToolObserver(obs);
        expect(service.toolObservers.length).toBe(1); // adding only 1 tool observer to the arrays
    });
    /*
    it('should call an update function on all tool observers', () => {
        const LEN = 10;
        for (let i = 0; i < LEN; ++i) {
            // declares an array of 10 elements
            service.toolObservers.push(observerStub);
        }

        const spy = spyOn(observerStub, 'update');
        service.updateToolObservers();
        expect(spy).toHaveBeenCalledTimes(LEN);
    });*/

    it('should refresh tool selection after valid shortcut selection', () => {
        const LEN = 10;
        service.toolshortcuts = [];
        for (let i = 0; i < LEN; ++i) {
            // declares an array of 10 elements
            service.toolObservers.push(observerStub);
        }
        const goodShortcut = 0;
        service.keyCode = goodShortcut;
        service.toolshortcuts.push(goodShortcut);
        const spy = spyOn(observerStub, 'cancel');
        service.checkForToolChange();

        expect(spy).toHaveBeenCalledTimes(LEN);
    });

    it('should select the right tool on valid shortcut', () => {
        const LEN = 10;
        service.toolObservers = [];
        service.toolshortcuts = [];
        for (let i = 0; i < LEN; ++i) {
            // declares an array of 10 elements
            service.toolObservers.push(observerStub);
        }
        const goodShortcut = 0;
        service.keyCode = goodShortcut;
        service.toolshortcuts.push(goodShortcut);
        service.checkForToolChange();

        expect(service.toolObservers[0].selected).toBeTruthy();
    });

    it('should not update tool selection on invalid keycode', () => {
        const badKey = -1;
        service.keyCode = badKey;

        service.toolshortcuts = [];
        service.toolshortcuts.push(badKey);
        const LEN = 10;
        for (let i = 0; i < LEN; ++i) {
            // declares an array of 10 elements
            service.toolObservers.push(observerStub);
        }
        const spy = spyOn(service.toolshortcuts, 'indexOf');
        service.checkForToolChange();
        expect(spy).not.toHaveBeenCalled(); // undefined -> no update
    });

    it('should get the key information and the observers must be updated and the change check is done', () => {

        const mockKey: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'Shift',
            ctrlKey: false,
            shiftKey: true,
        });

        service.logkey(mockKey);

        expect(service.keyString).toBe('Shift');

        expect(service.ctrlDown).toBeFalsy();
        expect(service.shiftDown).toBeTruthy();

    });

    it('on reset the keyboard attributes are reseted and the tools have been updated', () => {

        // let initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";
        const mockKey: KeyboardEvent = new KeyboardEvent('keyup', {
            key: 'Shift',
            ctrlKey: false,
            shiftKey: true,
            // keycode is a read-only attribute
        });
        service.logkey(mockKey);
        service.reset(mockKey);
        expect(service.keyString).toBe('');
        expect(service.keyCode).toBe(-1);

        expect(service.shiftDown).toBeTruthy();

    });

    it('should toggle the ctrlDown boolean on pressed ctrl', () => {
        service.ctrlDown = true;
        const CTRL = 17; // keycode
        kbEventStub.keyCode = CTRL;
        service.reset(kbEventStub);
        expect(service.ctrlDown).toBeFalsy();
    });

    it('should toggle the shiftDown boolean on pressed ctrl', () => {
        service.shiftDown = true;
        const SHIFT = 16; // keycode
        kbEventStub.keyCode = SHIFT;
        service.reset(kbEventStub);
        expect(service.ctrlDown).toBeFalsy();
    });
});
