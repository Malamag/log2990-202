import { Injectable } from '@angular/core';
import { InputObserver } from './input-observer';

import { Point } from './point';
import { ColorPickingService } from '../colorPicker/color-picking.service';

@Injectable({
    providedIn: 'root',
})
export class PipetteService extends InputObserver {
    htmlCanvasEl: HTMLCanvasElement;
    cPick: ColorPickingService;
    clickedColor: Uint8ClampedArray;
    constructor(selected: boolean, htmlCanvasEl: HTMLCanvasElement, colorPicking: ColorPickingService) {
        super(selected);
        this.htmlCanvasEl = htmlCanvasEl;
        this.cPick = colorPicking;
    }

    down(position: Point, insideWorkspace?: boolean | undefined): void {
        console.log(position);
        let ctx = this.htmlCanvasEl.getContext('2d');
        if (ctx) {
            this.clickedColor = ctx.getImageData(position.x, position.y, 1, 1).data;
            console.log(this.buildImageData());
        }
    }
    up(position: Point, insideWorkspace?: boolean | undefined): void {}
    move(position: Point): void {
        /**
         * Could refresh a small color box
         */
    }

    buildImageData(): string {
        let str: string = '#';
        this.clickedColor.forEach((color: number) => {
            str += this.cPick.colorConvert.rgbToHex(color);
        });

        return str;
    }

    emitSelectedColor() {}

    doubleClick(): void {}
    goingOutsideCanvas(): void {}
    goingInsideCanvas(): void {}
    update(): void {}
    cancel(): void {}
}
