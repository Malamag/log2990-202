import { Injectable } from '@angular/core';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { InputObserver } from './input-observer';
import { Point } from './point';

@Injectable({
    providedIn: 'root',
})
export class PipetteService extends InputObserver {

    cPick: ColorPickingService;
    interact: InteractionService;
    clickedColor: Uint8ClampedArray | number[];
    colorStr: string;

    canvasContext: CanvasRenderingContext2D | null;

    constructor(selected: boolean, interaction: InteractionService, colorPicking: ColorPickingService) {
        super(selected);

        this.cPick = colorPicking;
        this.interact = interaction;

        this.colorStr = '';
        this.interact.$canvasContext.subscribe((context: CanvasRenderingContext2D) => {
            this.canvasContext = context;
        });
    }

    down(position: Point, insideWorkspace?: boolean | undefined, isRightClick?: boolean): void {
        this.imgDataConversion(position);
        if (this.colorStr) {
            this.emitSelectedColor(this.colorStr, isRightClick);
        }
    }

    move(position: Point): void {
        this.imgDataConversion(position);
        this.interact.emitPreviewColor(this.colorStr); // emits to a small preview box in toolsAttributes
    }

    imgDataConversion(position: Point): void {
        if (this.canvasContext) {
            this.clickedColor = this.canvasContext.getImageData(position.x, position.y, 1, 1).data;
            this.colorStr = this.buildImageData();
        }
    }

    buildImageData(): string {
        let str = '#';
        this.clickedColor.forEach((color: number) => {
            str += this.cPick.colorConvert.rgbToHex(color);
        });

        return str;
    }

    emitSelectedColor(color: string, rightClick?: boolean): void {
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

    updateDown(): void {
        // throw new Error('Method not implemented.');
    }

    updateUp(): void {
        // throw new Error('Method not implemented.');
    }

    cancel(): void {
        // throw new Error('Method not implemented.');
    }

    up(): void {
        // throw new Error('Method not implemented.');
    }

    doubleClick(): void {
        // throw new Error('Method not implemented.');
    }

    goingOutsideCanvas(): void {
        // throw new Error('Method not implemented.');
    }

    goingInsideCanvas(): void {
        // throw new Error('Method not implemented.');
    }
}
