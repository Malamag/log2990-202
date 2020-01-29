import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawViewComponent } from './draw-view.component';
import {functionality} from '../../functionality'

describe('DrawViewComponent', () => {
  let func = functionality;
  let component: DrawViewComponent;
  let fixture: ComponentFixture<DrawViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawViewComponent ],
      imports:[functionality]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawViewComponent);
    component = fixture.componentInstance;
    component.functionality = func;
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

  it('OpenToolOptions should be true as selectedTool value is undefined', () => {
    component.selectedTool= "rectangle";
    const name: string = "crayon";
    component.buttonAction(name);
    expect(component.openToolOptions).toBe(true);
  });

  it('OpenToolOptions should be false with the name is the same as selectedTool', () => {
    const name: string = "crayon";
    component.selectedTool = name;
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
