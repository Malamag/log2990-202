import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewDrawComponent } from '../components/new-draw/new-draw.component';

@Injectable({
  providedIn: 'root'
})



export class ModalWindowService {
  // Construct a modal window depending of the desired component
  constructor(public dialog: MatDialog, public modalComponent:String) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.hasBackdrop = true;
    dialogConfig.id = "ModalWindow";
    dialogConfig.height = 'auto';
    dialogConfig.width = 'auto';
    if (modalComponent == "guide") {
      this.dialog.open(NewDrawComponent, dialogConfig);
    }
  }
}

