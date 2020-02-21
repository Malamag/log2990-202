import { Injectable, ElementRef } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class ExportService{

  imageURL: string;

  constructor() {
    
    
  }

  svgToURL(svgElement: SVGElement){
    let data = new XMLSerializer().serializeToString(svgElement);
    let blob = new Blob([data], {type: 'image/svg+xml'});
    let domurl = window.URL;
    let url = domurl.createObjectURL(blob);
    return url;
  
  }

  download(name: string, format: string, src:string) {

    // https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
    // utilisation de document absolument nécessaire ici??
    const downloadLink = document.createElement("a");
    downloadLink.href = src;
    downloadLink.download = `${name + '.' + format}`; //produces name.format image
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);     
  }

  exportCanvas(name:string, type: string, canvasRef: ElementRef ) {
    //https://stackoverflow.com/questions/12796513/html5-canvas-to-png-file
    //const DOWNLOAD_CANVAS: ElementRef = this.drawInCanvas(svgElem, canvasRef);
    if(type == "svg"){
      this.download(name, type, this.imageURL);
      
    }else{
      let dwn = canvasRef.nativeElement.toDataURL(`image/${type}`)
      this.download(name, type, dwn);
    }   
  }

  exportInCanvas(svgElem: SVGElement, canvasRef: ElementRef, name?: string, type?:string): ElementRef {
    //https://stackoverflow.com/questions/12796513/html5-canvas-to-png-file
    let ctx: CanvasRenderingContext2D = canvasRef.nativeElement.getContext('2d');
    let img = new Image();
    this.imageURL = this.svgToURL(svgElem);
    img.onload = () =>{

      if(ctx){
        ctx.drawImage(img, 0, 0);
      }

      if(name && type){ // exportation needs to happen in
        this.exportCanvas(name, type, canvasRef);
      }
    }
    img.src = this.imageURL;
    return canvasRef;
  }
}
