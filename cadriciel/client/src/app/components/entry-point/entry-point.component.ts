import { Component, OnInit } from '@angular/core';
import { MatSnackBar,MatSnackBarConfig} from '@angular/material';
import { functionality } from '../../functionality';
import { MatDialog} from '@angular/material/dialog';
import { ModalWindowService } from "../../services/modal-window.service";
import { NewDrawComponent } from '../new-draw/new-draw.component';

@Component({
  selector: 'app-entry-point',
  templateUrl: './entry-point.component.html',
  styleUrls: ['./entry-point.component.scss']
  
})
export class EntryPointComponent implements OnInit {
  functionality = functionality
  winService: ModalWindowService;

  constructor(private snackBar: MatSnackBar, public dialog:MatDialog) {
    this.winService = new ModalWindowService(dialog);
  }

  ngOnInit() {
    this.onOpen(); // opens snakbar at the bottom of the page
  }
  
  onOpen() {
    let config = new MatSnackBarConfig();
    config.duration=2500;
    this.snackBar.open("Bienvenue !",undefined,config);
  }

  openModalForm(){
    this.winService.openWindow(NewDrawComponent);
  }


  
}
