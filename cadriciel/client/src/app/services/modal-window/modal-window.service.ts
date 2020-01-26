import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GuideUtilisationComponent } from '../../components/guide-utilisation/guide-utilisation.component';

@Injectable({
  providedIn: 'root'
})

export class ModalWindowService {

  // Construct a modal window depending of the desired component
  constructor(public dialog: MatDialog, public modalComponent:String) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.hasBackdrop = true;
    dialogConfig.id = "modalWindow";
    dialogConfig.minWidth = '500px';
    if (modalComponent == "guide") {
      this.dialog.open(GuideUtilisationComponent, dialogConfig);
    }
  }
}

