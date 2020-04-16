import { Injectable } from '@angular/core';
import { InputObserver } from '../draw-tool/input-observer';

@Injectable({
    providedIn: 'root',
})
export class KeyboardHandlerService {
    keyString: string;
    keyCode: number;
    ctrlDown: boolean;
    shiftDown: boolean;
    toolObservers: InputObserver[];
    toolshortcuts: number[];
    released: boolean;

    // viewObservers:any[];

    constructor() {
        this.keyString = '';
        this.toolshortcuts = [];
        // tslint:disable-next-line: no-magic-numbers
        this.keyCode = -1; // invalid keycode as base value
        this.toolObservers = [];
        this.released = false;
    }

    addToolObserver(newObserver: InputObserver): void {
        this.toolObservers.push(newObserver);
    }

    updateDownToolObservers(): void {
        this.toolObservers.forEach((element: InputObserver) => {
            element.updateDown(this);
        });
    }

    updateUpToolObservers(keyCode: number): void {
        this.toolObservers.forEach((element: InputObserver) => {
            element.updateUp(keyCode);
        });
    }

    checkForToolChange(): void {
        if (this.toolshortcuts.includes(this.keyCode)) {
            this.toolObservers.forEach((element: InputObserver) => {
                element.cancel();
                element.selected = false;
            });
            this.toolObservers[this.toolshortcuts.indexOf(this.keyCode)].selected = true;
        }
    }

    logkey(e: KeyboardEvent): void {
        this.released = false;

        this.keyString = e.key;
        // tslint:disable-next-line: deprecation
        this.keyCode = e.keyCode;
        this.ctrlDown = e.ctrlKey;
        this.shiftDown = e.shiftKey;
        // this.checkForToolChange();
        this.updateDownToolObservers();
    }

    reset(e: KeyboardEvent): void {
        // update on key release

        this.released = true;

        // tslint:disable-next-line: deprecation
        this.updateUpToolObservers(e.keyCode);

        const SHIFT_CODE = 16;
        const CTRL_CODE = 17;

        //this.updateDownToolObservers();

        // tslint:disable-next-line: deprecation
        if (e.keyCode === CTRL_CODE) {
            this.ctrlDown = false;
        }
        // tslint:disable-next-line: deprecation
        if (e.keyCode === SHIFT_CODE) {
            this.shiftDown = false;
        }
        this.keyString = '';
        const INVALID = -1;
        this.keyCode = INVALID; // back to invalid keycode (default)

        this.updateDownToolObservers();
    }
}
