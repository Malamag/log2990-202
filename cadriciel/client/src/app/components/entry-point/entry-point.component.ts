import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { menuItems } from '../../functionality';
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

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.winService = new ModalWindowService(this.dialog);
    this.menuItems = menuItems;
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

  openUserManual(): void {

    this.winService.openWindow(UserManualComponent);
  }

  openCreateNew(): void {
    this.winService.openWindow(NewDrawComponent);
  }

  openGallery(): void {
    this.winService.openWindow(GalleryComponent);
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
        // statements;
        console.log(shortcutName);
        break;
      }
      default: {
        // statements;
        break;
      }
    }
  }

}
