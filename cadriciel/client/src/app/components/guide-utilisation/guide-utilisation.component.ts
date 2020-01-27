import { Component, OnInit } from '@angular/core';

////////////////////////
import { MatDialogRef } from '@angular/material/dialog';
import { functionality } from '../../functionality'

@Component({
  selector: 'app-guide-utilisation',
  templateUrl: './guide-utilisation.component.html',
  styleUrls: ['./guide-utilisation.component.scss']
})
export class GuideUtilisationComponent implements OnInit {
  functionality = functionality;
  element: HTMLElement;
  constructor(public dialogRef: MatDialogRef<GuideUtilisationComponent>) { }

  ngOnInit() {
  }

  closeModal() {
    this.dialogRef.close();
  }

  toolsListButton(){
    const tools = document.getElementsByClassName('toolButton');
    var i;
    for (i = 0; i < tools.length; i++) {
      const tool = tools[i] as HTMLElement;
      if (tool) {
        if (tool.style.display == "block") {
          tool.style.display = "none";
          //tool.style.backgroundColor = 'grey';
        }
        else
        tool.style.display = "block";
      }
    }      
  }
}
