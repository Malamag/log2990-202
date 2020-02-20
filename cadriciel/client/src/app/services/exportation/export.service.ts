import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class ExportService{


  constructor() {
    
    
  }

  svgToURL(svgElement: SVGElement){
    let data = new XMLSerializer().serializeToString(svgElement);
    let blob = new Blob([data], {type: 'image/svg+xml'});
    let domurl = window.URL;
    let url = domurl.createObjectURL(blob);
    return url;
  
  }
}
