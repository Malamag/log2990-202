import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CanvasBuilderService } from '../../../services/services/drawing/canvas-builder.service';



@Component({
  selector: 'app-new-draw',
  templateUrl: './new-draw.component.html',
  styleUrls: ['./new-draw.component.scss']
})
export class NewDrawComponent implements OnInit {

  newDrawForm: FormGroup;
  width: number;
  height: number;


  constructor(private formBuilder: FormBuilder,
              private canvasBuilder: CanvasBuilderService
              ) { }

  ngOnInit() {
    this.initForm();
    this.canvasBuilder.setDefaultSize();
    this.height = this.canvasBuilder.defHeight;
    this.width = this.canvasBuilder.defWidth;
  }

  initForm() {
    this.newDrawForm = this.formBuilder.group({
      canvWidth: ['', [this.canvasBuilder.isNumberValidator(), Validators.min(1)]], // TODO: ajouter validators
      canvHeight: ['', [this.canvasBuilder.isNumberValidator(), Validators.min(1)]],
      canvColor: ['', Validators.pattern(/^[a-fA-F0-9]{6}$/)]
    });
  }

  onSubmit() {
    const values = this.newDrawForm.value;
    
    const newDraw = this.canvasBuilder.makeNewCanvas(
      values['canvWidth'], 
      values['canvHeight'], 
      values['canvColor']
    );
    console.log(newDraw);
  }

}
