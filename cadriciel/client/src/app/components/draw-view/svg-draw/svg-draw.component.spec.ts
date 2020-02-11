import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgDrawComponent } from './svg-draw.component';
import { PencilService } from 'src/app/services/draw-tool/pencil.service';
import { RectangleService } from 'src/app/services/draw-tool/rectangle.service';

import{Canvas} from '../../../models/Canvas.model'
import { CanvasBuilderService } from 'src/app/services/drawing/canvas-builder.service';
import { KeyboardHandlerService } from 'src/app/services/keyboard-handler/keyboard-handler.service';
import { MouseHandlerService } from 'src/app/services/mouse-handler/mouse-handler.service';

const width = 67
const height = 10
const color='white'

describe('SvgDrawComponent', () => {
  let component: SvgDrawComponent;
  let fixture: ComponentFixture<SvgDrawComponent>;
  let mouseHandlerStub: any;
  let kbHandlerStub:any;

  beforeEach(async(() => {
    mouseHandlerStub = {
      move:()=>0,
      down:()=>0,
      up:()=>0
    }

    kbHandlerStub = {
      reset:(e:KeyboardEvent)=>e,
      logKey:(e:KeyboardEvent)=>e
    }
    TestBed.configureTestingModule({
      declarations: [ SvgDrawComponent ],
      providers:[
        {provide: KeyboardHandlerService, useValue: kbHandlerStub},
        {provide: MouseHandlerService, useValue: mouseHandlerStub}
      
      ]
      
    })
    .compileComponents();
  }));

  beforeEach(async(async() => {
    fixture = TestBed.createComponent(SvgDrawComponent);
    component = fixture.componentInstance;
    await fixture.whenStable()
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should deselect all tools', ()=>{
    let color1 = "1167B1";
    let color2 = "000000";
    let name1: string ="Pencil"
    let name2 : string = "rect"
    
    let pencil = new PencilService(component.workingSpace,component.workingSpace,true,67, color1, 10, component.interaction, component.colorPick)
    let rect = new RectangleService(component.workingSpace, component.workingSpace, true,65, color1,color2,0,68, component.interaction,component.colorPick)
    let mapTest = new Map()
    mapTest.set(name1, pencil)
    mapTest.set(name2, rect)
    component.closeTools(mapTest)
    expect(mapTest.get(name1).selected).toBeFalsy()
    expect(mapTest.get(name2).selected).toBeFalsy()
  })

  it('the containers length should be greater than zero', ()=>{
    component.ngAfterViewInit()
    expect(component.toolsContainer.size).toBeGreaterThan(0)
  })
  
  it('a dispatch should be sent', ()=>{
    let spyObj = spyOn(window,'dispatchEvent')
    component.ngAfterViewInit()
    expect(spyObj).toHaveBeenCalled()
  })

  it('should have the same parameters as the observer',()=>{
    let canvasBuilderStub = new CanvasBuilderService()
    let canvas =new Canvas(width, height, color)
    canvasBuilderStub.newCanvas = canvas

    let componentStub = new SvgDrawComponent(canvasBuilderStub,component.interaction, component.colorPick)
    componentStub.initCanvas();
    expect(componentStub.width).toBe(canvas.canvasWidth)
    expect(componentStub.height).toBe(canvas.canvasHeight)
    expect(componentStub.backColor).toBe(canvas.canvasColor)
    
  })

  it('should call initCanvas and the observable', ()=>{
    let spyObj = spyOn(component, 'initCanvas')
    let spyInteraction = spyOn(component.interaction.$refObs,'subscribe')
    component.ngOnInit()
    expect(spyObj).toHaveBeenCalled()
    expect(spyInteraction).toHaveBeenCalled()
  })

  it('should unsubscribe',()=>{
    let spyObj = spyOn(component.canvasSubscr,'unsubscribe')
    component.ngOnDestroy()
    expect(spyObj).toHaveBeenCalled
  })

  it('should call window addEventListener',()=>{
    let spyWindow = spyOn(window,'addEventListener');
    component.ngAfterViewInit()
    expect(spyWindow).toHaveBeenCalledTimes(6)
  });

  /*it('should call the mousehandler listeners on mouse action', ()=>{
    
    component.ngAfterViewInit(); // prepares the event listeners
    const spyDown = spyOn(mouseHandlerStub, "down");
    window.dispatchEvent(new MouseEvent("mousedown"));
    expect(spyDown).toHaveBeenCalled();

    const spyMove = spyOn(mouseHandlerStub, "move");
    window.dispatchEvent(new MouseEvent("mousemove")); // sending the events
    expect(spyMove).toHaveBeenCalled(); // we want to see if the functions get called after the event

    const spyUp = spyOn(mouseHandlerStub, "up");
    window.dispatchEvent(new MouseEvent("mouseup"));
    expect(spyUp).toHaveBeenCalled();
  });

  it('should call the kb handler listerners on kb action', ()=>{
    component.ngAfterViewInit(); // same principle goes for the keyboard events
    const spyKey = spyOn(kbHandlerStub, "logKey");
    window.dispatchEvent(new KeyboardEvent("keydown"));
    expect(spyKey).toHaveBeenCalled();

    const spyRes = spyOn(kbHandlerStub, "reset");
    window.dispatchEvent(new KeyboardEvent("keyup"));
    expect(spyRes).toHaveBeenCalled();

  });*/

  it('should affect the variables on subscription', ()=>{
    const spy = spyOn(component, "closeTools");
    component.ngAfterViewInit(); // init all
    component.interaction.emitCancel(true) //we want to cancel the tool selection
    expect(spy).toHaveBeenCalled();

    const TOOL = "Rectangle"; // arbitrary tool selection
    component.interaction.emitSelectedTool(TOOL); 
    expect(component.toolsContainer.get(TOOL).selected).toBeTruthy();
  
  });
});
