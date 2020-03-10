import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Canvas } from 'src/app/models/Canvas.model';
import { GridRenderService } from 'src/app/services/grid/grid-render.service';
import { KeyboardHandlerService } from 'src/app/services/keyboard-handler/keyboard-handler.service';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';
import { menuItems } from '../../../functionality';
import { ExportFormComponent } from '../../export-form/export-form.component';
import { GalleryComponent } from '../../gallery/gallery.component';
import { NewDrawComponent } from '../../new-draw/new-draw.component';
import { UserManualComponent } from '../../user-manual/user-manual.component';

@Component({
    selector: 'app-option-bar',
    templateUrl: './option-bar.component.html',
    styleUrls: ['./option-bar.component.scss'],
})
export class OptionBarComponent {
    funcMenu = menuItems;
    canvasSub: Subscription;
    currentCanvas: Canvas;
    gridSelected = false;
    stepVal: number;
    alphaVal = 100;
    readonly maxStepVal: number = 90;
    readonly minStepVal: number = 10;

    constructor(
        public winService: ModalWindowService,
        public interaction: InteractionService,
        private kbHandler: KeyboardHandlerService,
        private gridService: GridRenderService,
    ) {
        window.addEventListener('keydown', (e) => {
            this.setShortcutEvent(e);
        });
        this.stepVal = this.gridService.defSteps;
    }

    setShortcutEvent(e: KeyboardEvent) {
        const O_KEY = 79; // keycode for letter o
        const E_KEY = 69;
        const G_KEY = 71;
        const NUMPAD_PLUS = 107;
        const NUMPAD_MINUS = 109;
        const DASH = 189; // minus sign
        const EQUAL = 187; // plus sign located on the equal key (shift-equal)

        const STEP = 5;
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
        if (this.kbHandler.ctrlDown && this.kbHandler.keyCode === G_KEY) {
            this.openGallery();
            e.preventDefault();
        }
        if (e.keyCode === G_KEY) {
            this.toggleGrid();
        }

        if (this.kbHandler.keyCode === NUMPAD_PLUS || (this.kbHandler.shiftDown && this.kbHandler.keyCode === EQUAL)) {
            if (this.stepVal < this.maxStepVal) {
                this.stepVal += STEP;
                this.gridService.updateSpacing(this.stepVal);
            }
        }

        if (this.kbHandler.keyCode === NUMPAD_MINUS || this.kbHandler.keyCode === DASH) {
            if (this.stepVal > this.minStepVal) {
                this.stepVal -= STEP;
                this.gridService.updateSpacing(this.stepVal);
            }
        }
    }

    openNewDrawForm() {
        const OLD_STATE: boolean = this.interaction.isCanvas;
        this.interaction.emitSvgCanvasConversion(false);
        if (window.confirm('Un dessin est déjà en cours. Voulez-vous continuer?')) {
            this.winService.openWindow(NewDrawComponent);
            return;
        }
        this.interaction.emitSvgCanvasConversion(OLD_STATE);
    }

    openUserGuide() {
        this.winService.openWindow(UserManualComponent);
    }

    openExportForm() {
        const OPENING_WAIT = 5; // waiting for the window to be loaded before returning to oldstate
        const OLD_STATE: boolean = this.interaction.isCanvas;
        console.log(OLD_STATE);
        this.interaction.emitSvgCanvasConversion(false);
        this.winService.openWindow(ExportFormComponent);
        setTimeout(() => {
            this.interaction.emitSvgCanvasConversion(OLD_STATE);
        }, OPENING_WAIT);
    }

    sendSigKill() {
        this.interaction.emitCancel(true);
    }
    openGallery() {
        const OLD_STATE: boolean = this.interaction.isCanvas;
        this.interaction.emitSvgCanvasConversion(false);
        if (confirm('Un dessin est déjà en cours. Voulez-vous continuer?')) {
            this.winService.openWindow(GalleryComponent);
            return;
        }
        this.interaction.emitSvgCanvasConversion(OLD_STATE);
    }
    toggleGrid() {
        const OLD_STATE: boolean = this.interaction.isCanvas;
        this.interaction.emitSvgCanvasConversion(false);
        this.gridSelected = !this.gridSelected;
        this.gridService.toggleGridVisibility(this.gridSelected);
        this.interaction.emitSvgCanvasConversion(OLD_STATE);
    }

    updateSpacing() {
        const OLD_STATE: boolean = this.interaction.isCanvas;
        this.interaction.emitSvgCanvasConversion(false);
        this.gridService.updateSpacing(this.stepVal);
        this.interaction.emitSvgCanvasConversion(OLD_STATE);
    }

    updateAlpha() {
        const OLD_STATE: boolean = this.interaction.isCanvas;
        this.interaction.emitSvgCanvasConversion(false);
        this.gridService.updateTransparency(this.alphaVal);
        this.interaction.emitSvgCanvasConversion(OLD_STATE);
    }
}
