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
    for(let i =1; i<functionality.length;++i){
      if(functionality[i].isSelected==="true"){
        functionality[i].isSelected = "false";
        functionality[i-1].isSelected = "true";
      }
    }
  }

  nextPage(){    
    for(let i = functionality.length-1 ; i>0;i--){
      if(functionality[i-1].isSelected==="true"){
        functionality[i-1].isSelected = "false";
        functionality[i].isSelected = "true";
        console.log(i);
      }
    }
  }

}


