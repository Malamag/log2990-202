import { Component, OnInit, ElementRef, ViewChild, Renderer2, OnDestroy } from '@angular/core';
import {functionality} from '../../functionality'
import { CanvasBuilderService } from '../../services/services/drawing/canvas-builder.service';
import { Canvas } from '../../models/Canvas.model';
import { Subscription } from 'rxjs';
import { ModalWindowService } from 'src/app/services/modal-window.service';
import { ComponentType } from '@angular/cdk/portal';
import { NewDrawComponent } from '../new-draw/new-draw.component';
import { DrawViewService } from 'src/app/services/services/drawing/draw-view.service';

@Component({
  selector: 'app-draw-view',
  templateUrl: './draw-view.component.html',
  styleUrls: ['./draw-view.component.scss']
})
export class DrawViewComponent implements OnInit, OnDestroy {
  functionality = functionality

  openToolOptions: boolean = false;
  width: number;
  height: number;
  selectedTool: string;
  backColor: string;

  canvas: Canvas;
  canvasSubscr: Subscription;

  @ViewChild('toolsOptionsRef', {static: false}) navBarRef: ElementRef
  renderer: Renderer2

  constructor(private canvBuildService: CanvasBuilderService,
              private winService: ModalWindowService,
              private dViewService: DrawViewService) { }

  ngOnInit() {

    this.canvasSubscr = this.canvBuildService.getCanvSubscription();
    this.canvas = this.canvBuildService.newCanvas; // use this element to get newly generated canvas data
    this.canvBuildService.emitCanvas();    
    this.initParams();
  }

  ngOnDestroy() { // quand le component est détruit, la subscription n'existe plus
    this.canvasSubscr.unsubscribe();
  }

  initParams() {
    this.width = this.canvas.canvasWidth;
    this.height = this.canvas.canvasHeight;
    this.backColor = this.canvas.canvasColor;
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
