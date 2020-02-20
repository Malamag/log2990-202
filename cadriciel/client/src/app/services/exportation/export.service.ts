import { Injectable, ElementRef } from '@angular/core';



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

  exportLocal(name:string, type: string, svgElem: SVGElement, canvasRef: ElementRef ) {
    //https://stackoverflow.com/questions/12796513/html5-canvas-to-png-file
    let ctx = canvasRef.nativeElement.getContext('2d');
    let u = this.svgToURL(svgElem);

    if(type == "svg"){
      this.download(name, type, u);
      return;
    }

    let img = new Image();
    img.onload = () =>{

      if(ctx){
        ctx.drawImage(img, 0, 0);
        let dwn = canvasRef.nativeElement.toDataURL(`image/${type}`)
        console.log(dwn)
        this.download(name, type, dwn);
      }
    }
    img.src = u;


  }

  drawInCanvas(svgElem: SVGElement, canvasRef: ElementRef) {

  }
}
