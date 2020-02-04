import { Injectable } from '@angular/core';
import { Point } from './point';
import { PencilService } from './pencil.service';

@Injectable({
  providedIn: 'root'
})
export class BrushService extends PencilService {

  textureNumber:number;

  textures:{type:string, intensity:number, frequency:number}[];

  constructor(selected:boolean, width:number, primary_color:string, textureNumber:number,shortcut:number){
    super(selected,width,primary_color,shortcut);
    this.textureNumber = textureNumber;

    this.textures = [
      {"type":"blured","intensity":5, "frequency":0},
      {"type":"noise","intensity":0.5, "frequency":0.5},
      {"type":"noise","intensity":0.3, "frequency":0.3},
      {"type":"noise","intensity":0.9, "frequency":0.3},
      {"type":"noise","intensity":0.3, "frequency":0.9}
    ];
  }

  createPath(p:Point[]){

    let width = 50;
    let scale = this.textures[this.textureNumber].intensity;
    let frequency = this.textures[this.textureNumber].intensity/(width/10) * this.textures[this.textureNumber].frequency;

    let s = '<g name = "brush-stroke">';


    let uniqueID = new Date().getTime();

    if(this.textures[this.textureNumber].type == "blured"){
      s +=  this.createBluredFilter(scale,uniqueID);
    }else if(this.textures[this.textureNumber].type == "noise"){
      scale = width/((100/this.textures[this.textureNumber].intensity) / (100/width));
      s += this.createNoiseFilter(width, scale, frequency,uniqueID);
      width = (width-(width*scale)/2);
    }

    s += '<path d="';
    s += `M ${p[0].x} ${p[0].y} `;

    for(let i = 1; i < p.length;i++){
      s+= `L ${p[i].x} ${p[i].y} `;
    }

    s+= `"stroke="#${this.primary_color}" stroke-width="${width}"`;
    s+= 'fill="none" stroke-linecap="round" stroke-linejoin="round"';
    s+= `filter="url(#${this.textures[this.textureNumber].type}-${uniqueID})"/>`;

    s += "</g>";

    console.log(s);

    return s;
  }

  createBluredFilter(scale:number, ID:number){

    let filter = "";
    filter+= `<filter id="blured-${ID}" filterUnits="userSpaceOnUse">`;
    filter+= `<feGaussianBlur in="SourceGraphic" stdDeviation="${scale}"/>`
    filter+= '</filter>';

    return filter;
  }

  createNoiseFilter(width:number, scale:number, frequency:number, ID:number){

    let filter = "";
    filter += `<filter id="noise-${ID}" x="-100%" y="-100%" width="300%" height="300%" filterUnits="userSpaceOnUse">`;
    filter += `<feTurbulence type="turbulence" baseFrequency="${frequency}" numOctaves="2" result="turbulence"/>`;
    filter += `<feDisplacementMap in2="turbulence" in="SourceGraphic" scale="${width*scale}" xChannelSelector="R" yChannelSelector="G" result="turbulence"/>`;
    filter += `<feOffset in="turbulence" dx="${((-width*scale)/4)}" dy="${((-width*scale)/4)}"/>`;
    filter += '</filter>';

    return filter;
  }
}
