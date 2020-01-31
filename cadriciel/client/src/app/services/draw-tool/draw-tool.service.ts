import { Injectable} from '@angular/core';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { RectangleService } from './rectangle.service';
import { PencilService } from './pencil.service';
import { LineService } from './line.service';
import { BrushService } from './brush.service';

@Injectable({
  providedIn: 'root'
})
export class DrawToolService {

  keyboard:KeyboardHandlerService;

  constructor() { 
    //_ -> private
  }

  CreatePencil(_svg:HTMLElement | null,_workingSpace:HTMLElement | null, mouseX:number, mouseY:number,selected:boolean, width:number, primary_color:string){
    return new PencilService(_svg,_workingSpace,mouseX,mouseY,selected,width,primary_color);
  }

  CreateRectangle(_svg:HTMLElement | null,_workingSpace:HTMLElement | null, mouseX:number, mouseY:number,selected:boolean, width:number, primary_color:string, secondary_color:string){
    return new RectangleService(_svg,_workingSpace,mouseX,mouseY,selected,width,primary_color,secondary_color);
  }

  CreateLine(_svg:HTMLElement | null,_workingSpace:HTMLElement | null, mouseX:number, mouseY:number,selected:boolean, width:number, primary_color:string,showJunctions:boolean){
    return new LineService(_svg,_workingSpace,mouseX,mouseY,selected,width,primary_color, showJunctions);
  }

  CreateBrush(_svg:HTMLElement | null,_workingSpace:HTMLElement | null, mouseX:number, mouseY:number,selected:boolean, width:number, primary_color:string){
    return new BrushService(_svg,_workingSpace,mouseX,mouseY,selected,width,primary_color);
  }
}