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
import { FormControl } from '@angular/forms';

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
    toggleGridControl: FormControl = new FormControl();

    constructor(public winService: ModalWindowService, public interaction: InteractionService, private gridService: GridRenderService) {
        window.addEventListener('keydown', e => {
            this.setShortcutEvent(e);
        });
    }

    setShortcutEvent(e: KeyboardEvent) {
        const O_KEY = 79; // keycode for letter o
        const E_KEY = 69;

        const kbHandler: KeyboardHandlerService = new KeyboardHandlerService();
        kbHandler.logkey(e);

        if (kbHandler.ctrlDown && kbHandler.keyCode === O_KEY) {
            // ctrl+o opens the form!
            this.openNewDrawForm();
            e.preventDefault(); // default behavior prevented
        }

        if (kbHandler.ctrlDown && kbHandler.keyCode === E_KEY) {
            this.openExportForm();
            e.preventDefault();
        }
        //e.preventDefault(); // if it was here, no inputs would be possible...
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
        this.gridService.toggleGridVisibility(this.toggleGridControl.value);
    }
}
