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

  ngOnInit() {
    
  }  

  buttonAction(name:string){ // on click, emit the selected tool name
    this.interactionService.emitSelectedTool(name);
  }

  
}


