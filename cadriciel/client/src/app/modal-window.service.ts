import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GuideUtilisationComponent } from './guide-utilisation/guide-utilisation.component';

@Injectable({
  providedIn: 'root'
})



export class ModalWindowService {
  // Construct a modal window depending of the desired component
  constructor(public dialog: MatDialog, public modalComponent:String) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "ModalWindow";
    dialogConfig.height = '100%';
    dialogConfig.width = '99%';
    if (modalComponent == "guide") {
      this.dialog.open(GuideUtilisationComponent, dialogConfig);
    }
  }
}

