import { Component, OnInit, ElementRef, ViewChild, Renderer2, OnDestroy } from '@angular/core';
import {functionality} from '../../functionality'
import { CanvasBuilderService } from '../../services/services/drawing/canvas-builder.service';
import { Canvas } from '../../models/Canvas.model';
import {  Subscription } from 'rxjs';

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

  canvas: Canvas;
  canvasSubscr: Subscription;

  @ViewChild('toolsOptionsRef', {static: false}) navBarRef: ElementRef
  renderer: Renderer2

  constructor(private canvBuildService: CanvasBuilderService) { }

  ngOnInit() {
    this.width= 2000;
    this.height= 1000;
    this.canvasSubscr = this.canvBuildService.getCanvSubscription(); // patron observeur-observé
    this.canvBuildService.emitCanvas();    
  }

  ngOnDestroy() { // quand le component est détruit, la subscription n'existe plus
    this.canvasSubscr.unsubscribe();
  }

  buttonAction(name:string){
    this.openToolOptions= !this.openToolOptions;
    this.selectedTool= name;
  }



}
