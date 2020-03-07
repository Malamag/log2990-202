import { Injectable, Renderer2 } from '@angular/core';
import { InteractionService } from '../service-interaction/interaction.service';
import { InteractionTool } from './interactionTool';

@Injectable({
    providedIn: 'root',
})
export class UndoRedoService extends InteractionTool {
    constructor(interact: InteractionService, drawing: HTMLElement, render: Renderer2) {
        super(interact, drawing, render);
        this.updateDoneContainer();
        this.updateContainer();
    }
    updateContainer() {
        this.interact.$drawingDone.subscribe(sig => {
            if (sig && this.drawing.lastElementChild !== null) {
                if (this.undone.length > 0) {
                    this.undone = [];
                }
                this.done.push(this.drawing.innerHTML);
                this.updateButtons();
            }
        });
    }
    updateDoneContainer(){
        this.interact.$canvasRedone.subscribe(sig =>{
            if(sig){
                this.done = [];
                this.undone = [];
            }
            
        })
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
            this.drawing.innerHTML = this.done[this.done.length-1]
            let event = new Event("newDrawing");
            window.dispatchEvent(event);
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
        this.drawing.innerHTML = this.done[this.done.length-1]
        let event = new Event("newDrawing");
        window.dispatchEvent(event);
        
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
