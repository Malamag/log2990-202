import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { InteractionService } from 'src/app/services/service-interaction/interaction.service';
import { toolsItems } from '../../../functionality';
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

  constructor(public interactionService: InteractionService) {
    this.selectingToolsMap.set('1', 'Rectangle');
    this.selectingToolsMap.set('c', 'Crayon');
    this.selectingToolsMap.set('w', 'Pinceau');
    this.selectingToolsMap.set('l', 'Ligne');
    this.selectingToolsMap.set('2', 'Ellipse');
  }

  @HostListener('document: keydown', ['$event'])
  updateBoard(event: KeyboardEvent) {
    if (this.selectingToolsMap.has(event.key)) {
      this.buttonAction(this.selectingToolsMap.get(event.key))
    }
  }

  ngOnInit() {

  }

  buttonAction(name: string) { // on click, emit the selected tool name
    this.interactionService.emitSelectedTool(name);
  }

}
