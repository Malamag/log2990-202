import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ExportFormComponent } from 'src/app/components/export-form/export-form.component';
import { NewDrawComponent } from 'src/app/components/new-draw/new-draw.component';
import { UserManualComponent } from 'src/app/components/user-manual/user-manual.component';
import { GalleryComponent } from 'src/app/components/gallery/gallery.component';
import { SaveFormComponent } from '../../components/save-form/save-form.component';
@Injectable({
    providedIn: 'root',
})
export class ModalWindowService {
    // Construct a modal window depending of the desired component
    dialogConfig: MatDialogConfig;

    constructor(private dialog: MatDialog) {
        this.dialogConfig = new MatDialogConfig();
        this.dialogConfig.disableClose = false;
        this.dialogConfig.hasBackdrop = true;
        this.dialogConfig.id = 'modalWindow';
        this.dialogConfig.height = 'auto';
        this.dialogConfig.width = 'auto';
        this.dialogConfig.maxWidth = '100vw';
        this.dialogConfig.restoreFocus = false;
    }

    openWindow(component: ComponentType<GalleryComponent | NewDrawComponent | UserManualComponent | ExportFormComponent | SaveFormComponent>) {
        // Can open new draw form or user guide (for now)
        this.closeWindow();
        this.dialog.open(component, this.dialogConfig);
    }

    closeWindow() {
        this.dialog.closeAll();
    }
}
