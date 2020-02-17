import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ExportService } from 'src/app/services/exportation/export.service';
import { FormGroup } from '@angular/forms';

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

  constructor(private exportService: ExportService) { }
  draw: SVGElement;
  exportForm: FormGroup;

  ngOnInit() {
    // get the element
    this.exportService.askForDoodle();
  }

  ngAfterViewInit() {
    this.draw = this.exportService.getDrawing();
    this.export.nativeElement.innerHTML = this.draw.outerHTML;
  }

 

}
