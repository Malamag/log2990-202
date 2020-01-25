import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
//import { NewDrawComponent } from '../components/new-draw/new-draw.component';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})



export class ModalWindowService {
  // Construct a modal window depending of the desired component
  dialogConfig: MatDialogConfig;

  constructor(public dialog: MatDialog) {
    this.dialogConfig = new MatDialogConfig();
    this.dialogConfig.disableClose = false;
    this.dialogConfig.hasBackdrop = true;
    this.dialogConfig.id = "ModalWindow";
    this.dialogConfig.height = 'auto';
    this.dialogConfig.width = 'auto';

  }

  openWindow(component: ComponentType<any>) { // opens any modal window given as argument (by component type)
    this.dialog.open(component, this.dialogConfig);
  }
}

