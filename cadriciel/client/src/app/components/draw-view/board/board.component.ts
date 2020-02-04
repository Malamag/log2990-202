import { Component, OnInit } from '@angular/core';
import { Canvas } from 'src/app/models/Canvas.model';
import { Subscription } from 'rxjs';
import { CanvasBuilderService } from 'src/app/services/services/drawing/canvas-builder.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  width: number;
  height: number;
  backColor: string;

  
  canvas: Canvas;
  canvasSubscr: Subscription;


  constructor(private canvBuildService: CanvasBuilderService) { }

  ngOnInit() {
    
    this.initCanvas();
    this.canvBuildService.emitCanvas();   
    this.canvBuildService.setOnGoing(document.getElementById('canvas'));   //devra être set à true dès l'usage d'un crayon
  }

  initCanvas() {
    this.canvasSubscr = this.canvBuildService.canvSubject.subscribe(
      (canvas: Canvas) => {
        if(canvas === undefined) {
          canvas = this.canvBuildService.getDefCanvas();
        }
        this.width = canvas.canvasWidth;
        this.height= canvas.canvasHeight;
        this.backColor = canvas.canvasColor;
      }
    );
  }
  
  ngOnDestroy() { // quand le component est détruit, la subscription n'existe plus
    this.canvasSubscr.unsubscribe();
  }

}
