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
import { GalleryComponent } from '../../gallery/gallery.component';
import { GridRenderService } from 'src/app/services/grid/grid-render.service';


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
    alphaVal: number = 100;
    readonly maxStepVal: number = 90;
    readonly minStepVal: number = 10;

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
        const O_KEY: number = 79; // keycode for letter o
        const E_KEY: number = 69;
        const G_KEY = 71;
        const NUMPAD_PLUS: number = 107;
        const NUMPAD_MINUS: number = 109;
        const DASH: number = 189; // minus sign
        const EQUAL: number = 187; // plus sign located on the equal key (shift-equal)

        const STEP: number = 5;
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
        if (window.confirm('Un dessin est déjà en cours. Voulez-vous continuer?')) {
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
    openGallery() {
        if (confirm('Un dessin est déjà en cours. Voulez-vous continuer?')) {
            this.winService.openWindow(GalleryComponent);
        }
    }
    toggleGrid() {
        this.gridSelected = !this.gridSelected;
        this.gridService.toggleGridVisibility(this.gridSelected);
    }

    updateSpacing() {
        this.gridService.updateSpacing(this.stepVal);
    }

    updateAlpha() {
        this.gridService.updateTransparency(this.alphaVal);
    }
}
