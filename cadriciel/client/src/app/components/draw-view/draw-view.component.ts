import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import {functionality} from '../../functionality'
import { ModalWindowService } from 'src/app/services/modal-window.service';
import { ComponentType } from '@angular/cdk/portal';
import { NewDrawComponent } from '../new-draw/new-draw.component';
import { DrawViewService } from 'src/app/services/services/drawing/draw-view.service';

@Component({
  selector: 'app-draw-view',
  templateUrl: './draw-view.component.html',
  styleUrls: ['./draw-view.component.scss']
})
export class DrawViewComponent implements OnInit {
  functionality = functionality

  openToolOptions: boolean = false;
  
  selectedTool: string;

  @ViewChild('toolsOptionsRef', {static: false}) navBarRef: ElementRef
  renderer: Renderer2

  constructor(private winService: ModalWindowService,
              private dViewService: DrawViewService) { }

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

  openContext(cmp: ComponentType<any>) {
    this.winService.openWindow(cmp);
    if (cmp.name === NewDrawComponent.name) { // Vérifier s'il s'agit d'un component pour créer un nouveau dessin
      this.dViewService.newDrawOnView();
    }
  }
  

}
