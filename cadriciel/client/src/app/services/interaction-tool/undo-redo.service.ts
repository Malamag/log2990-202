import { Injectable, Renderer2 } from '@angular/core';
import { InteractionService } from '../service-interaction/interaction.service';
import { InteractionTool } from './interaction-tool';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService extends InteractionTool {
    constructor(interact: InteractionService, drawing: HTMLElement, render: Renderer2) {
        super(interact, drawing, render);
        this.updateDoneContainer();
        this.updateContainer();
    }
    updateContainer(): void {
        this.interact.$drawingDone.subscribe((sig) => {
            if (!sig) {
                return;
            }
            if (this.undone.length > 0) {
                this.undone = [];
            }
            this.done.push(this.drawing.innerHTML);
            this.updateButtons();
        });
    }
    updateDoneContainer(): void {
        this.interact.$drawingContinued.subscribe((sig) => {
            if (!sig) {
                return;
            }
            this.done = [];
            this.done.push(this.drawing.innerHTML);
            this.undone = [];
        });
    }
    undo(): void {
        if (!this.done.length) {
            return;
        }
        const ELEM = this.done.pop();
        this.drawing.innerHTML = '';
        if (ELEM != undefined) {
            this.undone.push(ELEM);
        }
        if (this.done.length) {
            this.drawing.innerHTML = this.done[this.done.length - 1];
            const EVENT = new Event('newDrawing');
            window.dispatchEvent(EVENT);
        }
    }
    redo(): void {

        if (!this.undone.length) {
            return;
        }
        const ELEM = this.undone.pop();
        this.drawing.innerHTML = '';
        if (ELEM != undefined) {
            this.done.push(ELEM);
        }
        this.drawing.innerHTML = this.done[this.done.length - 1];
        const EVENT = new Event('newDrawing');
        window.dispatchEvent(EVENT);

    }

    apply(name: string): void {
        if (name === 'Annuler') {
            this.undo();
        } else if (name === 'Refaire') {
            this.redo();
        }
        this.updateButtons();
    }
    updateButtons(): void {
        let disableUndo = true;
        let disableRedo = true;
        this.done.length ? (disableUndo = false) : (disableUndo = true);
        this.undone.length ? (disableRedo = false) : (disableRedo = true);
        this.interact.emitEnableDisable([disableUndo, disableRedo]);
    }
}
