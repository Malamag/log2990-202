import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawViewComponent } from './draw-view.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { 
  MatTooltipModule, 
  MatToolbarModule, 
  MatIconModule,
  MatSidenavModule,
  MatSliderModule} from '@angular/material';

describe('DrawViewComponent', () => {
  let component: DrawViewComponent;
  let fixture: ComponentFixture<DrawViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawViewComponent ],
      imports: [
        MatToolbarModule, 
        MatTooltipModule, 
        MatIconModule, 
        MatSidenavModule, 
        MatSliderModule,
        BrowserAnimationsModule
      ]
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
});
