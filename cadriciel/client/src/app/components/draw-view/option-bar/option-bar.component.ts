import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Canvas } from 'src/app/models/Canvas.model';
import { KeyboardHandlerService } from 'src/app/services/keyboard-handler/keyboard-handler.service';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';
import { menuItems } from '../../../functionality';
import { ExportFormComponent } from '../../export-form/export-form.component';
import { NewDrawComponent } from '../../new-draw/new-draw.component';
import { UserManualComponent } from '../../user-manual/user-manual.component';
import { GridRenderService } from 'src/app/services/grid/grid-render.service';
import { G } from '@angular/cdk/keycodes';

@Component({
    selector: 'app-option-bar',
    templateUrl: './option-bar.component.html',
    styleUrls: ['./option-bar.component.scss'],
})
export class OptionBarComponent {
    funcMenu = menuItems;
    canvasSub: Subscription;
    currentCanvas: Canvas;
    gridSelected: boolean = false;
    stepVal: number;
    alphaVal: number;
    readonly maxStepVal: number = 70;
    readonly minStepVal: number = 5;

    constructor(
        public winService: ModalWindowService,
        public interaction: InteractionService,
        private kbHandler: KeyboardHandlerService,
        private gridService: GridRenderService,
    ) {
        window.addEventListener('keydown', e => {
            this.setShortcutEvent(e);
        });
        this.stepVal = this.gridService.defSteps;
    }

    setShortcutEvent(e: KeyboardEvent) {
        const O_KEY = 79; // keycode for letter o
        const E_KEY = 69;
        const NUMPAD_PLUS = 107;
        const NUMPAD_MINUS = 109;
        const DASH = 189; // minus sign
        const EQUAL = 187; // plus sign located on the equal key (shift-equal)

        this.kbHandler.logkey(e);

        if (this.kbHandler.ctrlDown && this.kbHandler.keyCode === O_KEY) {
            // ctrl+o opens the form!
            this.openNewDrawForm();
            e.preventDefault(); // default behavior prevented
        }

        if (this.kbHandler.ctrlDown && this.kbHandler.keyCode === E_KEY) {
            this.openExportForm();
            e.preventDefault();
        }

        if (e.keyCode === G) {
            this.toggleGrid();
        }

        if (this.kbHandler.keyCode === NUMPAD_PLUS || (this.kbHandler.shiftDown && this.kbHandler.keyCode === EQUAL)) {
            if (this.stepVal < this.maxStepVal) {
                this.stepVal += this.minStepVal;
                this.gridService.updateSpacing(this.stepVal);
            }
        }

        if (this.kbHandler.keyCode === NUMPAD_MINUS || this.kbHandler.keyCode === DASH) {
            if (this.stepVal > this.minStepVal) {
                this.stepVal -= this.minStepVal;
                this.gridService.updateSpacing(this.stepVal);
            }
        }
    }

    openNewDrawForm() {
        if (confirm('Un dessin est déjà en cours. Voulez-vous continuer?')) {
            this.winService.openWindow(NewDrawComponent);
        }
    }

    openUserGuide() {
        this.winService.openWindow(UserManualComponent);
    }

    openExportForm() {
        this.winService.openWindow(ExportFormComponent);
    }

    sendSigKill() {
        this.interaction.emitCancel(true);
    }

    toggleGrid() {
        this.gridSelected = !this.gridSelected;
        this.gridService.toggleGridVisibility(this.gridSelected);
        console.log(this.gridSelected);
    }

    updateSpacing() {
        this.gridService.updateSpacing(this.stepVal);
    }

    updateAlpha() {
        this.gridService.updateTransparency(this.alphaVal);
    }
}
