import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';
import { SvgDrawComponent } from '../draw-view/svg-draw/svg-draw.component';
import { PreviewBoxComponent } from './preview-box.component';

describe('PreviewBoxComponent', () => {
  let component: PreviewBoxComponent;
  let fixture: ComponentFixture<PreviewBoxComponent>;
  let dFetchStub: any;

  beforeEach(async(() => {

    dFetchStub = {
      askForDoodle: () => 0,
      getDrawing: () => undefined
    }

    TestBed.configureTestingModule({
      declarations: [ PreviewBoxComponent, SvgDrawComponent ],
      providers: [
        {provide: DoodleFetchService, useValue: dFetchStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    dFetchStub.askForDoodle();
    fixture = TestBed.createComponent(PreviewBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {

    expect(component).toBeTruthy();
  });
});
