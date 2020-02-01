import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root'
})

export class ModalWindowService {
  // Construct a modal window depending of the desired component
  dialogConfig: MatDialogConfig;
  

  constructor(private dialog: MatDialog) {
    this.dialogConfig = new MatDialogConfig();
    this.dialogConfig.disableClose = false;
    this.dialogConfig.hasBackdrop = true;
    this.dialogConfig.id = "modalWindow";
    this.dialogConfig.height = 'auto';
    this.dialogConfig.width = 'auto';
    this.dialogConfig.restoreFocus = false; 
  }

  openWindow(component: ComponentType<any>) { // opens any modal window given as argument (by component type)
    this.dialog.open(component, this.dialogConfig);
  }

  closeWindow() {
    this.dialog.closeAll();
    
  }
}

