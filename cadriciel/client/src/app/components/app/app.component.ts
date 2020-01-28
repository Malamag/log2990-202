import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { MatDialog} from '@angular/material/dialog';
import { ModalWindowService } from "../../services/modal-window/modal-window.service";
import { GuideUtilisationComponent } from '../guide-utilisation/guide-utilisation.component'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})

export class AppComponent {
    readonly title: string = 'LOG2990';
    message = new BehaviorSubject<string>('');
    winService: ModalWindowService;

    constructor(public dialog: MatDialog,) {    
      this.winService = new ModalWindowService(this.dialog);        
    }    

    openModalGuide() {
      this.winService.openWindow(GuideUtilisationComponent);
    }
}
