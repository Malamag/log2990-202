import { Component, OnInit } from '@angular/core';
import { MatSnackBar,MatSnackBarConfig} from '@angular/material';
import { functionality } from '../../functionality';
import { MatDialog} from '@angular/material/dialog';
import {ModalWindowService} from "../../services/modal-window.service";

@Component({
  selector: 'app-entry-point',
  templateUrl: './entry-point.component.html',
  styleUrls: ['./entry-point.component.scss']
})
export class EntryPointComponent implements OnInit {
  functionality = functionality
  constructor(private snackBar: MatSnackBar, public dialog:MatDialog) { }

  ngOnInit() {
    this.open();
    
  }
  
  open() {
    let config = new MatSnackBarConfig();
    config.duration=2500;
    this.snackBar.open("Bienvenue !",undefined,config);
  }

  openModalForm(){
    new ModalWindowService(this.dialog, "guide");
  }
  
}
