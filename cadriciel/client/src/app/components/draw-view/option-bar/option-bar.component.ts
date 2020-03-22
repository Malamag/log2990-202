import { Component, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { Canvas } from 'src/app/models/canvas.model';
import { GridRenderService } from 'src/app/services/grid/grid-render.service';
import { KeyboardHandlerService } from 'src/app/services/keyboard-handler/keyboard-handler.service';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';
import { menuItems } from '../../../functionality';
import { ExportFormComponent } from '../../export-form/export-form.component';
import { GalleryComponent } from '../../gallery/gallery.component';
import { NewDrawComponent } from '../../new-draw/new-draw.component';
import { SaveFormComponent } from '../../save-form/save-form.component';
import { UserManualComponent } from '../../user-manual/user-manual.component';

@Component({
    selector: 'app-option-bar',
    templateUrl: './option-bar.component.html',
    styleUrls: ['./option-bar.component.scss'],
})
export class OptionBarComponent {
    funcMenu: {};
    canvasSub: Subscription;
    currentCanvas: Canvas;
    gridSelected: boolean;
    stepVal: number;
    alphaVal: number;
    readonly maxStepVal: number = 90;
    readonly minStepVal: number = 10;

    constructor(
        public winService: ModalWindowService,
        public interaction: InteractionService,
        private kbHandler: KeyboardHandlerService,
        public gridService: GridRenderService,
    ) {
        this.funcMenu = menuItems;
        this.gridSelected = false;

        const DEF_GRID_ALPHA = 100;
        this.alphaVal = DEF_GRID_ALPHA;

        this.stepVal = this.gridService.defSteps;
    }

    @HostListener('document: keydown', ['$event'])
    setShortcutEvent(e: KeyboardEvent): void {
        const STEP = 5;
        this.kbHandler.logkey(e);
        this.setNewDrawFormKeyBind(e);
        this.setSaveFormKeyBind(e);
        this.setExportFormKeyBind(e);
        this.setGalleryKeyBind(e);
        this.setGridKeyBind();
        this.setGridIncreaseKeyBind(STEP);
        this.setGridDecreaseKeyBind(STEP);
    }

    private setNewDrawFormKeyBind(e: KeyboardEvent): void {
        const O_KEY = 79; // keycode for letter o
        if (this.kbHandler.ctrlDown && this.kbHandler.keyCode === O_KEY) {
            // ctrl+o opens the form!
            this.openNewDrawForm();
            e.preventDefault(); // default behavior prevented
        }
    }

    private setSaveFormKeyBind(e: KeyboardEvent): void {
        const S_KEY = 83;
        if (this.kbHandler.ctrlDown && this.kbHandler.keyCode === S_KEY) {
            // ctrl+o opens the form!
            this.openSaveForm();
            e.preventDefault(); // default behavior prevented
        }
    }

    private setExportFormKeyBind(e: KeyboardEvent): void {
        const E_KEY = 69;
        if (this.kbHandler.ctrlDown && this.kbHandler.keyCode === E_KEY) {
            this.openExportForm();
            e.preventDefault();
        }
    }

    private setGalleryKeyBind(e: KeyboardEvent): void {
        const G_KEY = 71;
        if (this.kbHandler.ctrlDown && this.kbHandler.keyCode === G_KEY) {
            this.openGallery();
            e.preventDefault();
        }
    }

    private setGridKeyBind(): void {
        const G_KEY = 71;
        if (this.kbHandler.keyCode === G_KEY) {
            this.toggleGrid();
        }
    }

    private setGridIncreaseKeyBind(step: number): void {
        const EQUAL = 187; // plus sign located on the equal key (shift-equal)
        const NUMPAD_PLUS = 107;
        if (this.kbHandler.keyCode === NUMPAD_PLUS || (this.kbHandler.shiftDown && this.kbHandler.keyCode === EQUAL)) {
            if (this.stepVal < this.maxStepVal) {
                this.stepVal += step;
                this.gridService.updateSpacing(this.stepVal);
            }
        }
    }

    private setGridDecreaseKeyBind(step: number): void {
        const NUMPAD_MINUS = 109;
        const DASH = 189; // minus sign
        if (this.kbHandler.keyCode === NUMPAD_MINUS || this.kbHandler.keyCode === DASH) {
            if (this.stepVal > this.minStepVal) {
                this.stepVal -= step;
                this.gridService.updateSpacing(this.stepVal);
            }
        }
    }

    openNewDrawForm(): void {
        if (window.confirm('Un dessin est déjà en cours. Voulez-vous continuer?')) {
            this.winService.openWindow(NewDrawComponent);
            return;
        }
    }

    openUserGuide(): void {
        this.winService.openWindow(UserManualComponent);
    }

    openExportForm(): void {
        this.winService.openWindow(ExportFormComponent);
    }

    openSaveForm(): void {
        this.winService.openWindow(SaveFormComponent);
    }

    sendSigKill(): void {
        this.interaction.emitCancel(true);
    }

    openGallery(): void {
        if (confirm('Un dessin est déjà en cours. Voulez-vous continuer?')) {
            this.winService.openWindow(GalleryComponent);
            return;
        }
    }

    toggleGrid(): void {
        this.gridSelected = !this.gridSelected;
        this.gridService.toggleGridVisibility(this.gridSelected);
    }

    updateSpacing(): void {
        this.interaction.emitSvgCanvasConversion(false);
        this.gridService.updateSpacing(this.stepVal);
    }

    updateAlpha(): void {
        this.gridService.updateTransparency(this.alphaVal);
    }
}
