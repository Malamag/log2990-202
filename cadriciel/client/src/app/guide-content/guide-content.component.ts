import { Component, OnInit } from '@angular/core';
import { functionality } from '../functionality';

@Component({
  selector: 'app-guide-content',
  templateUrl: './guide-content.component.html',
  styleUrls: ['./guide-content.component.scss']
})
export class GuideContentComponent implements OnInit {
  functionality = functionality;
  constructor() { }

  ngOnInit() {
    
  }

  previousPage(){
    
    for(let i =1; i<functionality.menu.length;++i){
      if(functionality.menu[i].isSelected==="true"){
        functionality.menu[i].isSelected = "false";
        functionality.menu[i-1].isSelected = "true";
      }
    }

    for(let i =1; i<functionality.outils.length;++i){
      if(functionality.outils[i].isSelected==="true"){
        functionality.outils[i].isSelected = "false";
        functionality.outils[i-1].isSelected = "true";
      }
    }


    
  }

  nextPage(){
    
    for(let i = functionality.menu.length-1 ; i>0;i--){
      if(functionality.menu[i-1].isSelected==="true"){
        functionality.menu[i-1].isSelected = "false";
        functionality.menu[i].isSelected = "true";
        console.log(i);
      }
    }

    for(let i = functionality.outils.length-1 ; i>0;i--){
      if(functionality.outils[i-1].isSelected==="true"){
        functionality.outils[i-1].isSelected = "false";
        functionality.outils[i].isSelected = "true";
        console.log(i);
      }
    }

    


    
  }
  }


