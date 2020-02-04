import { Injectable, ElementRef, Renderer2} from '@angular/core';
import { RectangleService } from './rectangle.service';
import { PencilService } from './pencil.service';
import { LineService } from './line.service';
import { BrushService } from './brush.service';

@Injectable({
  providedIn: 'root'
})
export class ToolCreator {

  static CreatePencil(selected:boolean, width:number, primary_color:string,shortcut:number, inProgressRef: ElementRef, drawingRef: ElementRef, renderer: Renderer2){
    return new PencilService(selected,width,primary_color,shortcut, inProgressRef, drawingRef, renderer);
  }

  static CreateRectangle(selected:boolean, width:number, primary_color:string, secondary_color:string,mode:number,shortcut:number, inProgressRef: ElementRef, drawingRef: ElementRef, renderer: Renderer2){
    return new RectangleService(selected,width,primary_color,secondary_color,mode,shortcut, inProgressRef, drawingRef, renderer);
  }

  static CreateLine(selected:boolean, width:number, primary_color:string,showJunctions:boolean,junctionWidth:number,shortcut:number, inProgressRef: ElementRef, drawingRef: ElementRef, renderer: Renderer2){
    return new LineService(selected,width,primary_color, showJunctions,junctionWidth,shortcut, inProgressRef, drawingRef, renderer);
  }

  static CreateBrush(selected:boolean, width:number, primary_color:string,textureNumber:number,shortcut:number, inProgressRef: ElementRef, drawingRef: ElementRef, renderer: Renderer2){
    return new BrushService(selected,width,primary_color,textureNumber,shortcut, inProgressRef, drawingRef, renderer);
  }
}