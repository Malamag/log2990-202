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
  activeNextButton: boolean = true;
  activePreviousButton: boolean = false;

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
    this.activeButton === this.func[this.func.length - 1] ? this.activeNextButton = false : this.activeNextButton = true;
    this.activeButton === this.func[0] ? this.activePreviousButton = false : this.activePreviousButton = true;
  }

  nextPage() {
    this.activePreviousButton = true;
    for (let i = this.func.length - 2; i >= 0; i--) {
      if (this.func[i].shortcutName === this.activeButton.shortcutName)
        this.activeButton = this.func[i + 1];
      if (this.activeButton === this.func[this.func.length - 1])
        this.activeNextButton = false;
    }
  }

  previousPage() {
    this.activeNextButton = true;
    for (let i = 1; i < this.func.length; ++i) {
      if (this.func[i].shortcutName === this.activeButton.shortcutName)
        this.activeButton = this.func[i - 1];
      if (this.activeButton === this.func[0])
        this.activePreviousButton = false;
    }
  }
}