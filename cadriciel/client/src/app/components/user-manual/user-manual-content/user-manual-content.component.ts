import { Component, Input, OnInit } from '@angular/core';
import { menuItems, toolsItems, welcomeItem } from '../../../functionality';

@Component({
  selector: 'app-user-manual-content',
  templateUrl: './user-manual-content.component.html',
  styleUrls: ['./user-manual-content.component.scss']
})
export class UserManualContentComponent implements OnInit {
  toolsItems = toolsItems;
  menuItems = menuItems;
  welcomeItem = welcomeItem;

  @Input() activeButton: any;

  constructor() { }

  ngOnInit() {
  }

}
