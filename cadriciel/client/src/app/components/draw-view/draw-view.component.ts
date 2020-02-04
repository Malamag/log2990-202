import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { toolsItems, welcomeItem} from '../../functionality';

@Component({
  selector: 'app-draw-view',
  templateUrl: './draw-view.component.html',
  styleUrls: ['./draw-view.component.scss']
})
export class DrawViewComponent implements OnInit {
  funcTools = toolsItems;
  funcWelcome = welcomeItem;

  openToolOptions: boolean = false;
  
  selectedTool: string;

  @ViewChild('toolsOptionsRef', {static: false}) navBarRef: ElementRef
  renderer: Renderer2;

  constructor() { }

  ngOnInit() {
    
  }  

    /**Cette fonction peut à la limite être mise dans un service... */
  buttonAction(name:string){
    if(name === "pipette" || name === "sélectionner" || name ==="défaire" || name === "refaire"){this.openToolOptions = false;}
    else if(this.selectedTool!= undefined){
      if(this.selectedTool === name){
        this.openToolOptions= !this.openToolOptions;
      }
      else{this.openToolOptions = true;}  
    }
    else{this.openToolOptions = true;}

   
    this.selectedTool= name;
    
  }

  
}
