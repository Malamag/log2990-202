import { TestBed } from '@angular/core/testing';
import { InputObserver } from '../draw-tool/input-observer';
import { KeyboardHandlerService } from './keyboard-handler.service';

describe('KeyboardHandlerService', () => {
    let service: KeyboardHandlerService;
    // tslint:disable-next-line: no-any
    let observerStub: any;
    // tslint:disable-next-line: no-any
    let kbEventStub: any;
    beforeEach(() => {
        kbEventStub = {
            keyCode: 0,
        };
        observerStub = {
            selected: true,

            updateDown: () => 0,
            cancel: () => 0,
            updateUp: () => 0,
        };

        TestBed.configureTestingModule({
            providers: [{ provide: InputObserver, useValue: observerStub }],
        });

        service = new KeyboardHandlerService();
    });

    it('should be created', () => {
        const TEST_SERVICE: KeyboardHandlerService = TestBed.get(KeyboardHandlerService);
        expect(TEST_SERVICE).toBeTruthy();
    });
    it('should update up all the observers', () => {
        const NUM = 10;
        service.toolObservers = [observerStub, observerStub];
        const SPY = spyOn(observerStub, 'updateUp');
        service.updateUpToolObservers(NUM);
        expect(SPY).toHaveBeenCalled();
    });
    it('should update down all the observers', () => {
        service.toolObservers = [observerStub, observerStub];
        const SPY = spyOn(observerStub, 'updateDown');
        service.updateDownToolObservers();
        expect(SPY).toHaveBeenCalled();
    });
    it('should properly add tool observers', () => {
        service.toolObservers = [];

        const OBS = observerStub;
        service.addToolObserver(OBS);
        expect(service.toolObservers.length).toBe(1); // adding only 1 tool observer to the arrays
    });

    it('should refresh tool selection after valid shortcut selection', () => {
        const LEN = 10;
        service.toolshortcuts = [];
        for (let i = 0; i < LEN; ++i) {
            // declares an array of 10 elements
            service.toolObservers.push(observerStub);
        }
        const GOOD_SHORTCUT = 0;
        service.keyCode = GOOD_SHORTCUT;
        service.toolshortcuts.push(GOOD_SHORTCUT);
        const SPY = spyOn(observerStub, 'cancel');
        service.checkForToolChange();

        expect(SPY).toHaveBeenCalledTimes(LEN);
    });

    it('should select the right tool on valid shortcut', () => {
        const LEN = 10;
        service.toolObservers = [];
        service.toolshortcuts = [];
        for (let i = 0; i < LEN; ++i) {
            // declares an array of 10 elements
            service.toolObservers.push(observerStub);
        }
        const GOOD_SHORTCUT = 0;
        service.keyCode = GOOD_SHORTCUT;
        service.toolshortcuts.push(GOOD_SHORTCUT);
        service.checkForToolChange();

        expect(service.toolObservers[0].selected).toBeTruthy();
    });

    it('should not update tool selection on invalid keycode', () => {
        const BAD_KEY = -1;
        const GOOD_KEY = 69;
        service.keyCode = GOOD_KEY;
        service.toolObservers = [];
        service.toolObservers.push(observerStub);
        service.toolshortcuts = [];
        service.toolshortcuts.push(BAD_KEY);

        const SPY = spyOn(service.toolshortcuts, 'indexOf');
        service.checkForToolChange();
        expect(SPY).not.toHaveBeenCalled(); // undefined -> no update
    });

    it('should get the key information and the observers must be updated and the change check is done', () => {
        const MOCK_KEY: KeyboardEvent = new KeyboardEvent('keydown', {
            key: 'Shift',
            ctrlKey: false,
            shiftKey: true,
        });

        service.logkey(MOCK_KEY);

        expect(service.keyString).toBe('Shift');

        expect(service.ctrlDown).toBeFalsy();
        expect(service.shiftDown).toBeTruthy();
    });

    it('on reset the keyboard attributes are reseted and the tools have been updated', () => {
        // let initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";
        const MOCK_KEY: KeyboardEvent = new KeyboardEvent('keyup', {
            key: 'Shift',
            ctrlKey: false,
            shiftKey: true,
            // keycode is a read-only attribute
        });
        service.logkey(MOCK_KEY);
        service.reset(MOCK_KEY);
        expect(service.keyString).toBe('');
        const INVALID = -1;
        expect(service.keyCode).toBe(INVALID);

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
