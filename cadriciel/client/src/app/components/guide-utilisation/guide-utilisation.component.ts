import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material';
import { functionality } from '../../functionality';




@Component({
  selector: 'app-guide-utilisation',
  templateUrl: './guide-utilisation.component.html',
  styleUrls: ['./guide-utilisation.component.scss'],
})
export class GuideUtilisationComponent implements OnInit {
  showTools: boolean = false;
  selectedColor = 'dark';
  unselectedColor = 'lightgrey';
  functionality = functionality;
  activatedButton: HTMLElement;

  

  constructor(public dialogRef: MatDialogRef<GuideUtilisationComponent>, private router: Router) { }
  

  
  ngOnInit() {

    
    this.dialogRef.updateSize('80vw', '80vh');
    this.dialogRef.disableClose = true;
    let button = document.getElementById('Outils');
    
    if (button){
      this.activatedButton = button;
      button.style.backgroundColor = 'rgb(' + [150,150,150].join(',') + ')';
    }
    
  }

  closeModal() {
    this.dialogRef.close();
    this.router.navigate([""]);
    }




    markAsSelected(name:string){
      
      functionality.menu.forEach(function (button) {
        
        if(button.shortcutName == name){
          button.isSelected = "true";
        }
        else{
          button.isSelected = "false";
        }
        console.log("button name : "+button.name + " isSelected : "+button.isSelected)
      }); 
    }
  }
  
  




































  /* toolsListButton(){
    const tools = document.getElementsByClassName('toolButtons');
    var i;
    for (i = 0; i < tools.length; i++) {
      const tool = tools[i] as HTMLElement;
      if (tool) {
        if (tool.style.display == "block") {
          tool.style.display = "none";
        }
        else {
          tool.style.display = "block";
        }        
      }
    }   
  }

selectionButton(buttonId:any) {
    //Find the button clicked
    const button = document.getElementById(buttonId.shortcutName);
    if (button) {
      this.changeActivatedButton(button);
      for(let func of guideFunctionality) {
        //Find the functionality desired with the shortcutName by iteration
        if(button.id == func.shortcutName){
            this.changeContent(func); 
            break;
        }
      }
    }    
  }

  changeActivatedButton(button:HTMLElement) {
    this.activatedButton.style.backgroundColor = 'rgb(' + [200,200,200].join(',') + ')';
    this.activatedButton = button;
    button.style.backgroundColor = 'rgb(' + [150,150,150].join(',') + ')';
  }

  changeContent(func:any){
    var title = document.getElementById("title");
    if (title)
      title.innerText = func.name;

    var shortDescription = document.getElementById("shortDescription");
    if (shortDescription)
      shortDescription.innerText = func.description;

    var description = document.getElementById("description");
    if (description)
      description.innerText = func.description;   
  }

  previousPage(){
    var previousFunc:any;
    for(let func of guideFunctionality) {
      if(this.activatedButton.id == func.shortcutName){
        var button = document.getElementById(previousFunc.shortcutName);
        if (button)
        {
          this.changeActivatedButton(button);
          this.changeContent(previousFunc);
        }          
        break;
      }
      previousFunc = func;
    }
  }

  nextPage(){
    var previousFunc:any;
    for(let func of guideFunctionality) {
      if(this.activatedButton.id == previousFunc.shortcutName){
        var button = document.getElementById(func.shortcutName);
        if (button)
        {
          this.changeActivatedButton(button);
          this.changeContent(func);        
          break;
        }  
      }
      previousFunc = func;
    }
  }


} */
/*
  welcomeButton(){
    const button = document.getElementById('Bienvenue');
    if (button) {
      this.changeActivatedButton(button);
      //Change Content for Welcome page
      var title = document.getElementById("title");
      if (title)
        title.innerText = "Bienvenue";
      var description = document.getElementById("description");
      if (description)
        description.innerText = "text goes here";
    }
  }
*/
  
/*
  defocusButton(){
    const buttons = document.getElementsByClassName('guide-selection-button');
    var i;
    for (i = 0; i < buttons.length; i++) {
      const button = buttons[i] as HTMLElement;
      if (button) {
        button.style.backgroundColor = 'rgb(' + [200,200,200].join(',') + ')';
      }   
    }
  }

  defocusButton2(){
    const currentContent = document.getElementById('title');
    for(let func of functionality) {
      if(currentContent) {
        if(currentContent.textContent == func.name){
              var button = document.getElementById(currentContent.innerText);
              if(button) 
                button.style.backgroundColor = 'rgb(' + [200,200,200].join(',') + ')';
              break;
        }    
      }    
    }        
  }
  */

