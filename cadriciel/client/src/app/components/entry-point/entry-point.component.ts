import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar, MatSnackBarConfig} from '@angular/material';
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
  menuItems = menuItems;
  winService: ModalWindowService;

  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {
    this.winService = new ModalWindowService(this.dialog);
  }

  ngOnInit() {
    this.onOpen(); // opens snackbar at the bottom of the page
  }

  onOpen() {
    const config = new MatSnackBarConfig();
    config.duration = 2500; // temps de visibilité de la barre de bienvenue (ms)
    this.snackBar.open('Bienvenue !', undefined, config);
  }

  openUserManual() {

    this.winService.openWindow(UserManualComponent);
  }

  openCreateNew() {
    this.winService.openWindow(NewDrawComponent);
  }

  openGallery() {
    this.winService.openWindow(GalleryComponent);
  }

  execute(shortcutName: string) {
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
    break;
   }
    default: {
       // statements;
     break;
      }
   }
  }

}
