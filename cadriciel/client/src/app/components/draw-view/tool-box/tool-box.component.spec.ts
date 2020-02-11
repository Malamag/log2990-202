import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolBoxComponent } from './tool-box.component';
import { 
  MatButtonModule, 
  MatTooltipModule, 
  MatIconModule, 
  MatToolbarModule,
  MatSliderModule,
  MatFormFieldModule,
  MatRadioModule} from '@angular/material';


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
        MatFormFieldModule,
        MatRadioModule]
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

  it('should emit a name with the interaction service', ()=>{
    let component = TestBed.createComponent(ToolBoxComponent).componentInstance;
    let spyObj= spyOn(component.interactionService, "emitSelectedTool")
    let name ="Rectangle"
    component.buttonAction(name);
    expect(spyObj).toHaveBeenCalled()
  })

  // this test fail I dont know why
  it('should call buttonAction following a good key from the keyboardEvent', ()=>{
    let component = TestBed.createComponent(ToolBoxComponent).componentInstance;
    const spy = spyOn(component, 'buttonAction');
    let mockKey = new KeyboardEvent("keyup", {
      key:"1"
      
    })
    component.updateBoard(mockKey);
    expect(spy).toHaveBeenCalled()
  })
  it('should not call buttonAction',()=>{
    let component = TestBed.createComponent(ToolBoxComponent).componentInstance;
    let mockKey = new KeyboardEvent("keyup", {
      key:"r"
      
    })
    component.updateBoard(mockKey)
    let spyObj = spyOn(component, 'buttonAction')
    expect(spyObj).toHaveBeenCalledTimes(0)
  })
});
