import { Injectable, Renderer2 } from '@angular/core';
import { InteractionService } from '../service-interaction/interaction.service';
import { InteractionTool } from './interactionTool';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService extends InteractionTool {
    constructor(interact: InteractionService, drawing: HTMLElement, render: Renderer2) {
        super(interact, drawing, render);
        this.updateContainer();
    }
    updateContainer() {
        this.interact.$drawingDone.subscribe(sig => {
            if (sig && this.drawing.lastElementChild !== null) {
                if (this.undone.length > 0) {
                    this.undone = [];
                }

                const children = this.drawing.children;
                const list: Element[] = [];
                for (let i = 0; i < children.length; ++i) {
                    list.push(children[i]);
                }
                this.done.push(list);
                this.updateButtons();
            }
        });
    }
    undo() {
        if (!this.done.length) {
            return;
        }
        const elem = this.done.pop();
        this.drawing.innerHTML = '';
        if (elem) {
            this.undone.push(elem);
        }
        if (this.done.length) {
            this.done[this.done.length - 1].forEach(elem => {
                this.render.appendChild(this.drawing, elem);
            });
        }
    }
    redo() {
        if (!this.undone.length) {
            return;
        }
        const elem = this.undone.pop();
        this.drawing.innerHTML = '';
        if (elem) {
            this.done.push(elem);
        }
        this.done[this.done.length - 1].forEach(elem => {
            this.render.appendChild(this.drawing, elem);
        });
    }

    apply(name: string) {
        if (name === 'Annuler') {
            this.undo();
        } else if (name === 'Refaire') {
            this.redo();
        }
        this.updateButtons();
    }
    updateButtons() {
        let disableUndo = true;
        let disableRedo = true;
        this.done.length ? (disableUndo = false) : (disableUndo = true);
        this.undone.length ? (disableRedo = false) : (disableRedo = true);
        this.interact.emitEnableDisable([disableUndo, disableRedo]);
    }
}
