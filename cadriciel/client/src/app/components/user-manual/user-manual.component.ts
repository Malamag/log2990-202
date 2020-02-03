import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { toolsItems, menuItems, welcomeItem } from '../../functionality';

@Component({
  selector: 'app-user-manual',
  templateUrl: './user-manual.component.html',
  styleUrls: ['./user-manual.component.scss'],
})
export class UserManualComponent implements OnInit {
  toolsItems = toolsItems;
  menuItems = menuItems;
  welcomeItem = welcomeItem;
  showTools: boolean = false;

  func: Array<any> = welcomeItem.concat(menuItems, toolsItems);
  activeButton: any = this.welcomeItem[0];

  constructor(public dialogRef: MatDialogRef<UserManualComponent>) { }

  ngOnInit() {

  }

  closeModal() {
    this.dialogRef.close();
  }

  changeActivatedButton(actualButton: any) {
    this.activeButton = actualButton;
  }

  nextPage() {
    for (let i = this.func.length - 2; i >= 0; i--) {
      if (this.func[i].shortcutName === this.activeButton.shortcutName) {
        this.activeButton = this.func[i + 1];
      }
    }
  }

  previousPage() {
    for (let i = 1; i < this.func.length; ++i) {
      if (this.func[i].shortcutName === this.activeButton.shortcutName) {
        this.activeButton = this.func[i - 1];
      }
    }
  }
}









































