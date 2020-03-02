import { Component, OnInit } from '@angular/core';
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


@Component({
    selector: 'app-option-bar',
    templateUrl: './option-bar.component.html',
    styleUrls: ['./option-bar.component.scss'],
})
export class OptionBarComponent implements OnInit {
    funcMenu = menuItems;
    canvasSub: Subscription;
    currentCanvas: Canvas;

    constructor(public winService: ModalWindowService, public interaction: InteractionService) {
        window.addEventListener('keydown', e => {
            this.setShortcutEvent(e);
        });
    }

    ngOnInit() {}

    setShortcutEvent(e: KeyboardEvent) {
        const O_KEY = 79; // keycode for letter o
        const E_KEY = 69;
        const G_KEY =71;

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
        if(kbHandler.ctrlDown && kbHandler.keyCode === G_KEY){
            this.openGallery();
            e.preventDefault();
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
    openGallery(){
        if (confirm('Un dessin est déjà en cours. Voulez-vous continuer?')) {
        this.winService.openWindow(GalleryComponent);
        }
    }
}

   
