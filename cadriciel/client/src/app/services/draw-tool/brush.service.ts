import { Injectable } from '@angular/core';
import { Point } from './point';
import { PencilService } from './pencil.service';

@Injectable({
  providedIn: 'root'
})
export class BrushService extends PencilService {

  textureNumber:number;

  textures:{type:string, intensity:number, frequency:number}[];

  constructor(inProgess:HTMLElement, drawing:HTMLElement, selected:boolean, width:number, primary_color:string, textureNumber:number,shortcut:number){
    
    super(inProgess,drawing, selected,width,primary_color,shortcut);
    
    this.textureNumber = textureNumber;

    //values used as texture presets
    this.textures = [
      {"type":"blured","intensity":5, "frequency":0},
      {"type":"noise","intensity":0.5, "frequency":0.5},
      {"type":"noise","intensity":0.3, "frequency":0.3},
      {"type":"noise","intensity":0.9, "frequency":0.3},
      {"type":"noise","intensity":0.3, "frequency":0.9}
    ];
  }

  //Creates an svg path that connects every points of currentPath and creates a filter with the brush attributes
  createPath(p:Point[]){

    //get parameters from the used texture
    let width = this.width;
    let scale = this.textures[this.textureNumber].intensity;

    //"normalize" the frequency to keep a constant render no mather the width or scale
    let frequency = scale/(width/10) * this.textures[this.textureNumber].frequency;

    //create a divider
    let s = '<g name = "brush-stroke">';

    //get a unique ID to make sure each stroke has it's own filter
    let uniqueID = new Date().getTime();

    //create the corresponding svg filter
    if(this.textures[this.textureNumber].type == "blured"){
      s +=  this.createBluredFilter(scale,uniqueID);
    }else if(this.textures[this.textureNumber].type == "noise"){
      //we use a displacement map so we need to resize the brush to keep the overall width
      scale = width/((100/scale) / (100/width));
      s += this.createNoiseFilter(width, scale, frequency,uniqueID);
      width = (width-(width*scale)/2);
    }

    //start the path
    s += '<path d="';
    //move to the first point
    s += `M ${p[0].x} ${p[0].y} `;
    //for each succeding point, connect it with a line
    for(let i = 1; i < p.length;i++){
      s+= `L ${p[i].x} ${p[i].y} `;
    }
    //set render attributes
    s+= `"stroke="#${this.primary_color}" stroke-width="${width}"`;
    s+= 'fill="none" stroke-linecap="round" stroke-linejoin="round"';
    s+= `filter="url(#${uniqueID})"/>`;
    //end the path
  
    //end the divider
    s += "</g>";

    return s;
  }

  //creates an svg filter with gaussian blur
  createBluredFilter(scale:number, ID:number){

    let filter = "";

    //filter
    filter+= `<filter id="${ID}" filterUnits="userSpaceOnUse">`;

    //gaussian blur
    filter+= `<feGaussianBlur in="SourceGraphic" stdDeviation="${scale}"/>`

    filter+= '</filter>';

    return filter;
  }

  //create an svg filter with a displacement map (turbulence)
  createNoiseFilter(width:number, scale:number, frequency:number, ID:number){

    let filter = "";

    //filter
    filter += `<filter id="${ID}"`;
    filter += 'x="-100%" y="-100%" width="300%" height="300%" filterUnits="userSpaceOnUse">';

    //turbulence
    filter += `<feTurbulence type="turbulence" baseFrequency="${frequency}" numOctaves="2" result="turbulence"/>`;
    filter += '<feDisplacementMap in2="turbulence" in="SourceGraphic"';
    filter += `scale="${width*scale}"`;
    filter += 'xChannelSelector="R" yChannelSelector="G" result="turbulence"/>';

    //offset to recenter the stroke after the displacement
    filter += `<feOffset in="turbulence" dx="${((-width*scale)/4)}" dy="${((-width*scale)/4)}"/>`;

    filter += '</filter>';

    return filter;
  }
}
