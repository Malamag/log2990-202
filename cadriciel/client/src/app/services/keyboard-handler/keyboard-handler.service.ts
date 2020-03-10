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
        this.keyCode = -1;
        this.toolObservers = [];
        this.released = false;
    }

    addToolObserver(newObserver: InputObserver) {
        this.toolObservers.push(newObserver);
    }

    updateDownToolObservers() {
        this.toolObservers.forEach((element) => {
            element.updateDown(this);
        });
    }

    updateUpToolObservers(keyCode: number) {
        this.toolObservers.forEach((element) => {
            element.updateUp(keyCode);
        });
    }

    checkForToolChange() {
        if (this.toolshortcuts.includes(this.keyCode)) {
            this.toolObservers.forEach((element) => {
                element.cancel();
                element.selected = false;
            });
            this.toolObservers[this.toolshortcuts.indexOf(this.keyCode)].selected = true;
        }
    }

    logkey(e: KeyboardEvent) {
        this.released = false;

        this.keyString = e.key;
        this.keyCode = e.keyCode;
        this.ctrlDown = e.ctrlKey;
        this.shiftDown = e.shiftKey;
        // this.checkForToolChange();
        this.updateDownToolObservers();
    }

    reset(e: KeyboardEvent) {
        // update on key release

        this.released = true;

        this.updateUpToolObservers(e.keyCode);

        const SHIFT_CODE = 16;
        const CTRL_CODE = 17;

        this.updateDownToolObservers();

        if (e.keyCode == CTRL_CODE) {
            this.ctrlDown = false;
        }
        if (e.keyCode == SHIFT_CODE) {
            this.shiftDown = false;
        }
        this.keyString = '';
        this.keyCode = -1; // back to invalid keycode (default)

        this.updateDownToolObservers();
    }
}
