import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';

interface Formats {
  type: string,
  view: string
}

@Component({
  selector: 'app-export-form',
  templateUrl: './export-form.component.html',
  styleUrls: ['./export-form.component.scss']
})
export class ExportFormComponent implements OnInit, AfterViewInit {
  formats: Formats[] = [
    {type: "jpeg", view: ".jpeg"},
    {type: "png", view: ".png"},
    {type: "svg", view: ".svg"}
  ];
  
  @ViewChild('imgBox', {static:false}) export: ElementRef; // has an eye on the <canvas> element

  constructor(
    private formBuilder: FormBuilder,
    private winService: ModalWindowService,
    private doodleFetch: DoodleFetchService) { }
  
  exportForm: FormGroup;
  doodle: SVGElement;
 

  cWidth: number;
  cHeigth: number;

  ngOnInit() {

    this.initForm();
    this.doodleFetch.askForDoodle();
    this.cWidth = this.doodleFetch.widthAttr;
    this.cHeigth = this.doodleFetch.heightAttr;
    console.log(this.cWidth)
    
  }

  initForm() {
    this.exportForm = this.formBuilder.group({
      doodleName:['Dessin sans titre', Validators.required],
      formatSel: [null, Validators.required]
    })
  }
  
  
  ngAfterViewInit() {
    this.doodle = this.doodleFetch.getDrawing();
  }

  onSubmit() {
    const FORMVAL = this.exportForm.value;
    console.log(FORMVAL);
    // call the conversion & download functions from service with the givent values
    this.exportation();
    this.closeForm();


  }

  closeForm() {
    this.winService.closeWindow();
  }

    exportation(){
      
      let ctx = this.export.nativeElement.getContext('2d');
      let data = new XMLSerializer().serializeToString(this.doodle);

    
      let img = new Image();

      let blob = new Blob([data], {type: 'image/svg+xml'});
      let domurl = window.URL;
      let url = domurl.createObjectURL(blob);

      img.onload = ()=>{
        if(ctx){
          ctx.drawImage(img, 0, 0);
          domurl.revokeObjectURL(url);

          let dwnldImg = this.export.nativeElement.toDataURL('image/png');
          console.log(dwnldImg)
        }
        
      }
      img.src = url;
    }

    download() {

    }
    


}
