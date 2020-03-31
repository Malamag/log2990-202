import { ElementRef, Injectable } from '@angular/core';

import { Canvas } from '../../models/canvas.model';

import { Subject } from 'rxjs';

import { InteractionService } from '../service-interaction/interaction.service';

@Injectable({
    providedIn: 'root',
})
export class CanvasBuilderService {
    newCanvas: Canvas;
    canvSubject: Subject<Canvas>; // using rxjs to emit the created canvas to another component

    constructor(private interact: InteractionService) {
        this.canvSubject = new Subject<Canvas>(); // using rxjs to emit the created canvas to another component
    }

    getDefWidth(): number {
        const DIV = 1.18;
        return Math.round(window.innerWidth / DIV); // avoids pixel fractions
    }

    getDefHeight(): number {
        const DIV = 1.11; // adjusts after the top bar size
        return Math.round(window.innerHeight / DIV);
    }

    getDefColor(): string {
        const DEFCOLOR = 'ffffff';
        return DEFCOLOR;
    }

    setCanvasFromForm(widthInput: number, heightInput: number, colorInput: string): void {
        colorInput = '#' + colorInput;
        this.newCanvas = { canvasWidth: widthInput, canvasHeight: heightInput, canvasColor: colorInput }; // a fresh draw is always clean
    }

    getDefCanvas(): Canvas {
        return { canvasWidth: this.getDefWidth(), canvasHeight: this.getDefHeight(), canvasColor: this.getDefColor() };
    }

    emitCanvas(): void {
        this.canvSubject.next(this.newCanvas);
        this.interact.emitContinueDrawing();
    }

    wipeDraw(myDoodle: ElementRef | undefined): void {
        if (myDoodle) {
            // element is defined
            myDoodle.nativeElement.innerHTML = '';
        }
    }
}
