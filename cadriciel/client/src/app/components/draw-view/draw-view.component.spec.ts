import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawViewComponent } from './draw-view.component';
import {menuItems, toolsItems, welcomeItem} from '../../functionality'
import { OptionBarComponent } from './option-bar/option-bar.component';
import { ToolBoxComponent } from './tool-box/tool-box.component';
import { ToolAttributesComponent } from './tool-box/tool-attributes/tool-attributes.component';
import { SvgDrawComponent } from './svg-draw/svg-draw.component';
import { ColorFormComponent } from '../color-picker/color-form/color-form.component';

import {
  MatButtonModule, 
  MatTooltipModule, 
  MatIconModule, 
  MatToolbarModule,
  MatSliderModule,
  MatDialog,
  MatFormFieldModule,
  MatRadioModule} from '@angular/material';
import { ColorPickerComponent } from '../color-picker/color-picker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



describe('DrawViewComponent', () => {
  let component: DrawViewComponent;
  let fixture: ComponentFixture<DrawViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        DrawViewComponent, 
        OptionBarComponent, 
        ToolBoxComponent, 
        ToolAttributesComponent, 
        SvgDrawComponent,
        ColorPickerComponent,
      ColorFormComponent ],
      providers :[{provide :menuItems, toolsItems, welcomeItem},
                  {provide: MatDialog}],
      imports: [
        MatButtonModule, 
        MatTooltipModule, 
        MatIconModule, 
        MatToolbarModule, 
        MatSliderModule,
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatRadioModule]
      
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('selectedToolShouldChange', () => {
    const name: string = "crayon";
    component.buttonAction(name);
    expect(component.selectedTool).toBe(name);
  });

  it('OpenToolOptions should be true as selectedTool value is undefined', () => {
    const name: string = "crayon";
    component.buttonAction(name);
    expect(component.openToolOptions).toBe(true);
  });

  it('OpenToolOptions should be true as selectedTool value is deferent from the name', () => {
    component.selectedTool= "rectangle";
    const name: string = "crayon";
    component.buttonAction(name);
    expect(component.openToolOptions).toBe(true);
  });

  it('OpenToolOptions should be false as the button action function had been called twice for the same tool', () => {
    const name: string = "crayon";
    component.buttonAction(name);
    component.buttonAction(name);
    expect(component.openToolOptions).toBe(false);
  });

  it('OpenToolOptions should be false with selectedTool as sélectionner', () => {
    const name: string = "sélectionner";
    component.buttonAction(name);
    expect(component.openToolOptions).toBe(false);
  });

  it('OpenToolOptions should be false with selectedTool as pipette', () => {
    const name: string = "pipette";
    component.buttonAction(name);
    expect(component.openToolOptions).toBe(false);
  });

  it('OpenToolOptions should be false with selectedTool as défaire', () => {
    const name: string = "défaire";
    component.buttonAction(name);
    expect(component.openToolOptions).toBe(false);
  });

  it('OpenToolOptions should be false as refaire', () => {
    const name: string = "refaire";
    component.buttonAction(name);
    expect(component.openToolOptions).toBe(false);
  });
});
