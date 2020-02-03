import { Injectable} from '@angular/core';
import { RectangleService } from './rectangle.service';
import { PencilService } from './pencil.service';
import { LineService } from './line.service';
import { BrushService } from './brush.service';

@Injectable({
  providedIn: 'root'
})
export class ToolCreator {

  static CreatePencil(selected:boolean, width:number, primary_color:string,shortcut:number){
    return new PencilService(selected,width,primary_color,shortcut);
  }

  static CreateRectangle(selected:boolean, width:number, primary_color:string, secondary_color:string,mode:number,shortcut:number){
    return new RectangleService(selected,width,primary_color,secondary_color,mode,shortcut);
  }

  static CreateLine(selected:boolean, width:number, primary_color:string,showJunctions:boolean,junctionWidth:number,shortcut:number){
    return new LineService(selected,width,primary_color, showJunctions,junctionWidth,shortcut);
  }

  static CreateBrush(selected:boolean, width:number, primary_color:string,textureNumber:number,shortcut:number){
    return new BrushService(selected,width,primary_color,textureNumber,shortcut);
  }
}