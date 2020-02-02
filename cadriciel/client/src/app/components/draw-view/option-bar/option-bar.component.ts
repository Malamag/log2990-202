import { Component, OnInit } from '@angular/core';
import {menuItems} from '../../../functionality';
import { ModalWindowService } from 'src/app/services/modal-window.service';
import { NewDrawComponent } from '../../new-draw/new-draw.component';
import { UserManualComponent } from '../../user-manual/user-manual.component';

@Component({
  selector: 'app-option-bar',
  templateUrl: './option-bar.component.html',
  styleUrls: ['./option-bar.component.scss']
})
export class OptionBarComponent implements OnInit {
  funcMenu = menuItems;
  constructor(private winService: ModalWindowService) { }

  ngOnInit() {
  }

  
  openNewDrawForm(){
    this.winService.openWindow(NewDrawComponent);
  }
  
  openUserGuide() {
    this.winService.openWindow(UserManualComponent)
  }

}
