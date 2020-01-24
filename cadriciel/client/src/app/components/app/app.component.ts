import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { MatDialog,} from '@angular/material/dialog';
import { ModalWindowService } from '../../services/modal-window/modal-window.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})

export class AppComponent {
    readonly title: string = 'LOG2990';
    message = new BehaviorSubject<string>('');

    constructor(public dialog: MatDialog) {            
    }    

    openModalGuide() {
      new ModalWindowService(this.dialog, "guide");
    }
}
