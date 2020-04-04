import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { menuItems } from '../../functionality';
import { ContinueDrawingService } from '../../services/continue-drawing/continue-drawing.service';
import { ModalWindowService } from '../../services/window-handler/modal-window.service';
import { GalleryComponent } from '../gallery/gallery.component';
import { NewDrawComponent } from '../new-draw/new-draw.component';
import { UserManualComponent } from '../user-manual/user-manual.component';

@Component({
  selector: 'app-entry-point',
  templateUrl: './entry-point.component.html',
  styleUrls: ['./entry-point.component.scss']

})
export class EntryPointComponent implements OnInit {

  menuItems: object = {};
  winService: ModalWindowService;
  drawingExist: boolean;
  constructor(private snackBar: MatSnackBar, private dialog: MatDialog , private drawing: ContinueDrawingService) {
    this.winService = new ModalWindowService(this.dialog);
    this.menuItems = menuItems;
    this.getDrawingExist();
  }
  getDrawingExist(): void {
    const MAX = 6;
    let heightExist = false;
    let widthExist = false;
    let bgColorExist = false;
    let htmlElementExist = true;
    // check if all the elements exist
    if (localStorage.getItem('height') !== null) {
      heightExist = true;
    }
    if (localStorage.getItem('width') !== null) {
      widthExist = true;
    }
    if (localStorage.getItem('color') !== null) {
      bgColorExist = true;
    }
    for (let i = 0; i < MAX; ++i) {
      if (localStorage.getItem('htmlElem') + i.toString() === null) {
        htmlElementExist = false;
      }
    }
    const INIT_VALUES = this.checkInitValues();
    this.drawingExist = heightExist && widthExist && bgColorExist && htmlElementExist && !INIT_VALUES;
  }
  ngOnInit(): void {
    this.onOpen(); // opens snackbar at the bottom of the page
  }

  onOpen(): void {
    const CONFIG = new MatSnackBarConfig();
    const DURATION = 2500;
    CONFIG.duration = DURATION; // temps de visibilité de la barre de bienvenue (ms)
    this.snackBar.open('Bienvenue !', undefined, CONFIG);
  }
  checkInitValues(): boolean {
    let initValues = false;
    let isEmpty = false;
    if (localStorage.getItem('height') === '775'
      && localStorage.getItem('width') === '1438'
      && localStorage.getItem('color') === 'ffffff') {
      if (localStorage.getItem('htmlElem3') === '') {isEmpty = true;}
      if (isEmpty) {initValues = true; }
    }
    return initValues;
  }
  openUserManual(): void {

    this.winService.openWindow(UserManualComponent);
  }

  openCreateNew(): void {
    this.winService.openWindow(NewDrawComponent);
  }

  openGallery(): void {
    this.winService.openWindow(GalleryComponent);
  }

  continue(): void {
    this.drawing.continueAutoSavedFromEntryPoint();
  }
  execute(shortcutName: string): void {
    switch (shortcutName) {
      case 'Créer': {
        this.openCreateNew();
        break;
      }
      case 'Ouvrir': {
        // statements;
        this.openGallery();
        break;
      }
      case 'Guide': {
        this.openUserManual();
        break;
      }
      case 'Continuer': {
        this.continue();
        break;
      }
      default: {
       // statements;
        break;
      }
    }
  }

}
