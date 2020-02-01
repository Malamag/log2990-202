import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { Point } from './point';
import { PencilService } from './pencil.service';

@Injectable({
  providedIn: 'root'
})
export class BrushService extends PencilService {

  constructor(svg:HTMLElement | null, workingSpace:HTMLElement | null,selected:boolean, width:number, primary_color:string, renderer: Renderer2, 
    inProgressRef:ElementRef, doneRef:ElementRef){
    super(svg, workingSpace,selected,width,primary_color, renderer, inProgressRef, doneRef);
  }

  createPath(p:Point[]){

    let width = 75;
    let scale = width/((100/0.5) / (100/width));
    let octave = scale/(width/10) * 0.5;

    //let s = "<filter id=\"blurMe\" filterUnits=\"userSpaceOnUse\"><feGaussianBlur in=\"SourceGraphic\" stdDeviation=\"5\"/></filter>";
    let s = "<filter id=\"displacementFilter\" x=\"-100%\" y=\"-100%\" width=\"300%\" height=\"300%\" filterUnits=\"userSpaceOnUse\"><feTurbulence type=\"turbulence\" baseFrequency=\""+octave+"\"numOctaves=\"2\" result=\"turbulence\"/><feDisplacementMap in2=\"turbulence\" in=\"SourceGraphic\"scale=\""+(width*scale)+"\" xChannelSelector=\"R\" yChannelSelector=\"G\" result=\"first\"/><feOffset in=\"first\" dx=\""+((-width*scale)/4)+"\" dy=\""+((-width*scale)/4)+"\" /></filter>";
    s += "<path d=\"";
      s+= `M ${p[0].x} ${p[0].y} `;

      for(let i = 1; i < p.length;i++){
        s+= `L ${p[i].x} ${p[i].y} `;
      }

      s+="\" stroke=\"#" + this.primary_color + "\" stroke-width=\""+(width-(width*scale)/2)+"\" fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"round\" filter=\"url(#displacementFilter)\"/>";

    return s;
  }
}
