import { Component, OnInit } from '@angular/core';
import { MatSnackBar,MatSnackBarConfig, MatDialog} from '@angular/material';
import { functionality } from '../../functionality';

import { ModalWindowService } from "../../services/modal-window.service";
import { NewDrawComponent } from '../new-draw/new-draw.component';
import { GuideUtilisationComponent } from '../guide-utilisation/guide-utilisation.component'

@Component({
  selector: 'app-entry-point',
  templateUrl: './entry-point.component.html',
  styleUrls: ['./entry-point.component.scss']
  
})
export class EntryPointComponent implements OnInit {
  functionality = functionality;
  winService: ModalWindowService;

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.winService = new ModalWindowService(this.dialog);
  }

  ngOnInit() {
    this.onOpen(); // opens snackbar at the bottom of the page
  }
  
  onOpen() {
    let config = new MatSnackBarConfig();
    config.duration=2500;
    this.snackBar.open("Bienvenue !",undefined,config);
  }

  openModalForm(){
    this.winService.openWindow(NewDrawComponent);
  }

  openModalGuide() {
    this.winService.openWindow(GuideUtilisationComponent);
  }

  
}
