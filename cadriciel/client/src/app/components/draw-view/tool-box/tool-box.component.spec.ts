import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolBoxComponent } from './tool-box.component';
import { 
  MatButtonModule, 
  MatTooltipModule, 
  MatIconModule, 
  MatToolbarModule,
  MatSliderModule,
  MatFormFieldModule} from '@angular/material';


describe('ToolBoxComponent', () => {
  let component: ToolBoxComponent;
  let fixture: ComponentFixture<ToolBoxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolBoxComponent ],
      imports: [
        MatButtonModule, 
        MatTooltipModule,
        MatIconModule, 
        MatToolbarModule,
        MatSliderModule,
        MatFormFieldModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
