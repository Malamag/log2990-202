import { Injectable } from '@angular/core';
import { InputObserver } from './input-observer';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { Point } from './point';

@Injectable({
    providedIn: 'root',
})
export class PipetteService extends InputObserver {
    htmlCanvasEl: HTMLCanvasElement;
    constructor(selected: boolean, htmlCanvasEl: HTMLCanvasElement) {
        super(selected);
        this.htmlCanvasEl = htmlCanvasEl;
        console.log(this.htmlCanvasEl);
    }
    update(keyboard: KeyboardHandlerService): void {}
    cancel(): void {}
    down(position: Point, insideWorkspace?: boolean | undefined): void {
        console.log(position);
    }
    up(position: Point, insideWorkspace?: boolean | undefined): void {}
    move(position: Point): void {}
    doubleClick(position: Point, insideWorkspace?: boolean | undefined): void {}
    goingOutsideCanvas(position: Point): void {}
    goingInsideCanvas(position: Point): void {}

    getImageData() {}

    emitSelectedColor() {}
}
