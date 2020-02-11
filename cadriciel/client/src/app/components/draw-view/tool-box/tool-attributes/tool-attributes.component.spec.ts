import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolAttributesComponent } from './tool-attributes.component';
import {ColorPickerComponent} from '../../../color-picker/color-picker.component';
import {  
  MatFormFieldModule,
  MatIconModule, 
  MatToolbarModule,
  MatSliderModule,
  MatRadioModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InteractionService } from 'src/app/services/service-interaction/interaction.service';



describe('ToolAttributesComponent', () => {
  let component: ToolAttributesComponent;
  let fixture: ComponentFixture<ToolAttributesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolAttributesComponent, ColorPickerComponent],
      //providers:[{provide: InteractionService, useValue:interactionStub}],
      imports: [
        MatSliderModule, 
        FormsModule,
        MatIconModule, 
        MatToolbarModule,
        MatSliderModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatRadioModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolAttributesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to the tools on init and select a default', ()=>{
    const TOOL = "Pencil";
    component.interaction.emitSelectedTool(TOOL);
    component.ngOnInit();
    expect(component.selectedTool).toEqual(TOOL);
  });

  it('should emit forms attributes', ()=>{
    let spyObj = spyOn(component.interaction, 'emitFormsAttributes')
    component.updateForms()
    expect(spyObj).toHaveBeenCalled()
  })

  it('should emit line attributes',()=>{
    let spyObj = spyOn(component.interaction, 'emitLineAttributes')
    component.updateLine()
    expect(spyObj).toHaveBeenCalled()
  })

  it('should emit tools attributes',()=>{
    let spyObj = spyOn(component.interaction, 'emitToolsAttributes')
    component.updateTools()
    expect(spyObj).toHaveBeenCalled()
  })

  it('should dispatch the window', ()=>{
    let spyObj = spyOn(window, 'dispatchEvent')
    component.resize()
    expect(spyObj).toHaveBeenCalled()
  })

  it('should set default values',()=>{
    //component.ngAfterViewInit()
    expect(component.lineThickness).toBe(5)
    expect(component.texture).toBe(0)
    expect(component.numberCorners).toBe(3)
    expect(component.plotType).toBe(2)
    expect(component.junction).toBe(true)
    expect(component.junctionRadius).toBe(6)
  })
  it('should call update functions',()=>{
    let formsSpy = spyOn(component, 'updateForms')
    let toolsSpy = spyOn(component, 'updateTools')
    let lineSpy = spyOn(component, 'updateLine')
    component.ngAfterViewInit()
    expect(formsSpy).toHaveBeenCalled()
    expect(toolsSpy).toHaveBeenCalled()
    expect(lineSpy).toHaveBeenCalled()
  })

  it('should select tool', ()=>{
    component.interaction.emitSelectedTool("Rectangle")
  
    expect(component.selectedTool).toBe("Rectangle")
  })

  it('should not select tool',()=>{
    let interactionStub = new InteractionService()
    interactionStub.emitSelectedTool("Ellipse")
    let componentStub = new ToolAttributesComponent(interactionStub)
    componentStub.ngOnInit()
  
    expect(componentStub.selectedTool).toBe("Pencil")
  })
  
});
