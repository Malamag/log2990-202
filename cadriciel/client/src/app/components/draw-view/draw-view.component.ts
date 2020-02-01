import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import {menuItems, toolsItems, welcomeItem} from '../../functionality';
import { ModalWindowService } from 'src/app/services/modal-window.service';
import { ComponentType } from '@angular/cdk/portal';


//import {functionality} from '../../functionality'


@Component({
  selector: 'app-draw-view',
  templateUrl: './draw-view.component.html',
  styleUrls: ['./draw-view.component.scss']
})
export class DrawViewComponent implements OnInit {
  funcMenu = menuItems;
  funcTools = toolsItems;
  funcWelcom = welcomeItem;

  openToolOptions: boolean = false;
  
  selectedTool: string;

  @ViewChild('toolsOptionsRef', {static: false}) navBarRef: ElementRef
  renderer: Renderer2

  constructor(private winService: ModalWindowService) { }

  ngOnInit() {
  }


    /**Cette fonction peut à la limite être mise dans un service... */
  buttonAction(name:string){
    this.openToolOptions= !this.openToolOptions;
    this.selectedTool= name;
  }

  openContext(cmp: ComponentType<any>) {
    this.winService.openWindow(cmp);
  }
  
  
}
