import { Component, OnInit } from '@angular/core';
import {menuItems} from '../../../functionality';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';
import { NewDrawComponent } from '../../new-draw/new-draw.component';
import { UserManualComponent } from '../../user-manual/user-manual.component';
import { KeyboardHandlerService } from 'src/app/services/keyboard-handler/keyboard-handler.service';

@Component({
  selector: 'app-option-bar',
  templateUrl: './option-bar.component.html',
  styleUrls: ['./option-bar.component.scss']
})
export class OptionBarComponent implements OnInit {
  funcMenu = menuItems;
  constructor(private winService: ModalWindowService) {
    const O_KEY = 79; //keycode for letter o

    let kbHandler: KeyboardHandlerService = new KeyboardHandlerService();
    window.addEventListener("keydown", function(e){ //adding shortcut for new draw form
       
      kbHandler.logkey(e);

      if(kbHandler.ctrlDown && kbHandler.keyCode === O_KEY) {
        winService.openWindow(NewDrawComponent);
        e.preventDefault();
      }
      
    });
  }

  ngOnInit() {
    
  }

  openNewDrawForm(){

    this.winService.openWindow(NewDrawComponent);
 
  }
  
  openUserGuide() {
    this.winService.openWindow(UserManualComponent)
  }

}
