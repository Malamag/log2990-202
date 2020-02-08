import { Component, OnInit, Input } from '@angular/core';
import { toolsItems, menuItems, welcomeItem } from '../../../functionality';

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


