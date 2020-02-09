import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatButtonModule, 
  MatToolbarModule, 
  MatIconModule, 
  MatTooltipModule,
  MatDialog} from '@angular/material';

import { OptionBarComponent } from './option-bar.component';


describe('OptionBarComponent', () => {
  let component: OptionBarComponent;
  let fixture: ComponentFixture<OptionBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionBarComponent ],
      imports: [MatButtonModule, MatToolbarModule, MatIconModule, MatTooltipModule],
      providers: [{provide: MatDialog}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should react on a window event',()=>{
    let spy = spyOn(window, 'addEventListener')
    expect(spy).toHaveBeenCalled()
  })

  it ('should open a modal window',()=>{
    let spy = spyOn(component.winService,'openWindow')
    component.openUserGuide()
    expect(spy).toHaveBeenCalled()
  })

  it('should emit a boolean using the observer',()=>{
    let spy = spyOn(component.interaction,'emitCancel')
    component.sendSigKill()
    expect(spy).toHaveBeenCalled()
  })

  it ('should open a modal window',()=>{
    let spy = spyOn(component.winService,'openWindow')
    component.openNewDrawForm()
    expect(spy).toHaveBeenCalled()
  })
});
