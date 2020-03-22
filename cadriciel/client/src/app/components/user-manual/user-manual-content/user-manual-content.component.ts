import { Component, Input } from '@angular/core';
import { menuItems, toolsItems, welcomeItem } from '../../../functionality';

@Component({
  selector: 'app-user-manual-content',
  templateUrl: './user-manual-content.component.html',
  styleUrls: ['./user-manual-content.component.scss']
})
export class UserManualContentComponent {
  toolsItems: object = {};
  menuItems: object = {};
  welcomeItem: object = {};
  @Input() activeButton: string;
  constructor() {
    this.toolsItems = toolsItems;
    this.menuItems = menuItems;
    this.welcomeItem = welcomeItem;
  }
}
