import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgDrawComponent } from './svg-draw.component';
import { PencilService } from 'src/app/services/draw-tool/pencil.service';
import { RectangleService } from 'src/app/services/draw-tool/rectangle.service';
import { defer } from 'rxjs';
import{Canvas} from '../../../models/Canvas.model'
import { CanvasBuilderService } from 'src/app/services/drawing/canvas-builder.service';
//import { DrawingTool } from 'src/app/services/draw-tool/drawingTool';

export function fakeObsResponse<T>(data:T){
  return defer(()=>Promise.resolve(data))
}
const width = 67
const height = 10
const color='white'
const canvasBuilderStub={
 get(){
   let fakeCanvasBuilder = new CanvasBuilderService()
   let fakeCanvas = new Canvas(width, height, color)
   fakeCanvasBuilder.newCanvas
   return fakeObsResponse(fakeCanvas)
 } 
}
describe('SvgDrawComponent', () => {
  let component: SvgDrawComponent;
  let fixture: ComponentFixture<SvgDrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgDrawComponent ],
      providers:[{provide:CanvasBuilderService, useValue:canvasBuilderStub}]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgDrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should diselect all tools', ()=>{
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

  it('the containers length should be greater than zer', ()=>{
    component.ngAfterViewInit()
    expect(component.toolsContainer.size).toBeGreaterThan(0)
  })
  
  it('a dispatch should be sent', ()=>{
    let spyObj = spyOn(window,'dispatchEvent')
    component.ngAfterViewInit()
    expect(spyObj).toHaveBeenCalled()
  })

  //it('')
});
