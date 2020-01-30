import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawViewComponent } from './draw-view.component';
import {functionality} from '../../functionality'
import { MatToolbarModule, MatIconModule, MatTooltipModule, MatButtonModule, MatSidenavModule, MatSliderModule, MatSelectModule } from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { CanvasBuilderService } from 'src/app/services/services/drawing/canvas-builder.service';

describe('DrawViewComponent', () => {
  let component: DrawViewComponent;
  let fixture: ComponentFixture<DrawViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawViewComponent ],
      providers :[{provide :functionality}],
      imports:[ MatToolbarModule, MatIconModule,MatTooltipModule, MatButtonModule,
        MatSidenavModule, MatSliderModule, MatSelectModule, BrowserModule, HttpClientModule, BrowserAnimationsModule]
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
    let service = new CanvasBuilderService();
    component = new DrawViewComponent(service);
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
