import { Component, OnInit, ViewChild, ElementRef, Renderer2, HostListener } from '@angular/core';
import { toolsItems } from '../../../functionality';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';
@Component({
  selector: 'app-tool-box',
  templateUrl: './tool-box.component.html',
  styleUrls: ['./tool-box.component.scss']
})

export class ToolBoxComponent implements OnInit {
  funcTools = toolsItems;
  

  openToolOptions: boolean = false;
  
  selectedTool: string;
  // I doubt if we can delete these two
  @ViewChild('toolsOptionsRef', {static: false}) navBarRef: ElementRef
  renderer: Renderer2
  selectingToolsMap = new Map();
  
  constructor(private interactionService: InteractionService) {
    this.selectingToolsMap.set('1', 'Rectangle');
    this.selectingToolsMap.set('c', 'Crayon');
    this.selectingToolsMap.set('w', 'Pinceau');
    this.selectingToolsMap.set('l', 'Ligne');
  }

  @HostListener('document: keydown', ['$event'])
  updateBoard(event: KeyboardEvent){
    this.interactionService.emitSelectedTool(this.selectingToolsMap.get(event.key));
  }

  getSlectedTool(name: string){
    this.interactionService.emitSelectedTool(name);
  }
  ngOnInit() {
    
  }  

    /**Cette fonction peut à la limite être mise dans un service... */
  buttonAction(name:string){
    if(name === "Pipette" || name === "Sélectionner" || name ==="défaire" || name === "refaire"){this.openToolOptions = false;}
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


