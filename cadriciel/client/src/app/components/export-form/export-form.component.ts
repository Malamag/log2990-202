import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalWindowService } from 'src/app/services/window-handler/modal-window.service';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';
import { ExportService } from 'src/app/services/exportation/export.service';

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
    private doodleFetch: DoodleFetchService,
    private expService: ExportService) { }
  
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
    const TYPE = FORMVAL.formatSel;
    this.exportation(TYPE);
    this.closeForm();


  }

  closeForm() {
    this.winService.closeWindow();
  }

    exportation(type: string){
      /*https://stackoverflow.com/questions/12796513/html5-canvas-to-png-file*/
      let ctx = this.export.nativeElement.getContext('2d');
      let u = this.expService.svgToURL(this.doodle);
      let img = new Image();
      img.onload = () =>{
        if(ctx){
          ctx.drawImage(img, 0, 0);
          let dwn = this.export.nativeElement.toDataURL(`image/${type}`)
          console.log(dwn)
        }
      }
      img.src = u;
    }

    download() {
      
      
      
    }
    


}
