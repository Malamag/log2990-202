import { Component, OnInit, ElementRef, ViewChild, Renderer2, OnDestroy } from '@angular/core';
import {functionality} from '../../functionality'
import { CanvasBuilderService } from '../../services/services/drawing/canvas-builder.service';
import { Canvas } from '../../models/Canvas.model';
import { Subscription } from 'rxjs';

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

  constructor(private canvBuildService: CanvasBuilderService) { }

  ngOnInit() {

    this.canvasSubscr = this.canvBuildService.getCanvSubscription();
    this.canvas = this.canvBuildService.newCanvas; // use this element to get newly generated canvas data
    this.canvBuildService.emitCanvas();    

    this.width = this.canvas.canvasWidth;
    this.height = this.canvas.canvasHeight;
    this.backColor = this.canvas.canvasColor;
  }

  ngOnDestroy() { // quand le component est détruit, la subscription n'existe plus
    this.canvasSubscr.unsubscribe();
  }

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
