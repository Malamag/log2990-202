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
    colorStr: string = '';
    constructor(selected: boolean, htmlCanvasEl: HTMLCanvasElement, colorPicking: ColorPickingService) {
        super(selected);
        this.htmlCanvasEl = htmlCanvasEl;
        this.cPick = colorPicking;
    }

    down(position: Point, insideWorkspace?: boolean | undefined, isRightClick?: boolean): void {
        const CTX = this.htmlCanvasEl.getContext('2d');

        if (CTX) {
            this.clickedColor = CTX.getImageData(position.x, position.y, 1, 1).data;
            this.colorStr = this.buildImageData();
        }

        if (this.colorStr) {
            this.emitSelectedColor(this.colorStr, isRightClick);
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

    emitSelectedColor(color: string, rightClick?: boolean) {
        const BACK_COLOR: string = this.cPick.cData.backgroundColor;
        const PRIM_COLOR = this.cPick.cData.primaryColor;
        const SEC_COLOR = this.cPick.cData.secondaryColor;

        if (rightClick) {
            this.cPick.colors = { primColor: PRIM_COLOR, secColor: color, backColor: BACK_COLOR };
            // this.cPick.colors.primColor = color;
        } else {
            this.cPick.colors = { primColor: color, secColor: SEC_COLOR, backColor: BACK_COLOR };
        }
        this.cPick.emitColors();

        this.cPick.updateDisplay(color);
    }

    doubleClick(): void {} // no behavior defned for the methods below
    goingOutsideCanvas(): void {}
    goingInsideCanvas(): void {}
    update(): void {}
    cancel(): void {}
    updateDown(): void {}
    updateUp(keyCode: number): void {}
}
