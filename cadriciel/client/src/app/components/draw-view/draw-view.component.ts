import { Component, OnInit, ElementRef, ViewChild, Renderer2, HostListener } from '@angular/core';
import { toolsItems, welcomeItem} from '../../functionality'
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';

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
