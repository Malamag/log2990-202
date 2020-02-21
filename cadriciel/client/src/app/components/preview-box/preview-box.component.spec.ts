import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewBoxComponent } from './preview-box.component';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';

describe('PreviewBoxComponent', () => {
  let component: PreviewBoxComponent;
  let fixture: ComponentFixture<PreviewBoxComponent>;
  let dFetchStub: any;
  beforeEach(async(() => {
    dFetchStub = {
      askForDoodle:()=>0,
      getDrawing:()=>undefined
    }
    TestBed.configureTestingModule({
      declarations: [ PreviewBoxComponent ],
      providers: [{provide: DoodleFetchService, dFetchStub}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
