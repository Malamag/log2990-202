import { TestBed } from '@angular/core/testing';
import { Renderer2 } from '@angular/core';
import { UndoRedoService } from './undo-redo.service';

describe('UndoRedoService', () => {
  let service: UndoRedoService;
  let drawingStub: any;
  let renderStub: Renderer2;
  beforeEach(() => TestBed.configureTestingModule({
    providers: [{provide: HTMLElement, useValue: drawingStub},
                {provide: Renderer2, useValue: renderStub}]
  }));
  beforeEach(() => {
    drawingStub ={
      innerHTML: "<div> hello world </div>"
    }
    service = TestBed.get(UndoRedoService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should empty the undone list and fill the done list and update the buttons',()=>{
    //service.drawing.innerHTML= "<div> hello world </div>"
    const spyUpdate = spyOn(service, 'updateButtons');
    service.interact.emitDrawingDone();
    service.updateContainer()
    expect(service.done.length).toBeGreaterThan(0);
    expect(service.undone.length).toEqual(0);
    expect(spyUpdate).toHaveBeenCalled();
  })

  it('undo should empty the done list and fill the undone list', () => {
    service.done.push(drawingStub);
    service.undo();
    expect(service.done.length).toEqual(0)
    expect(service.undone.length).toBeGreaterThan(0)
  })

  it('undo should call appendChild of renderer',()=>{
    service.done.push(drawingStub);
    service.done.push(drawingStub);
    const spyRenderer = jasmine.createSpy('appendChild');
    service.undo();
    expect(spyRenderer).toHaveBeenCalled()
  })

  it('redo should empty the undone list and fill the done list', () => {
    const spyRenderer = jasmine.createSpy('appendChild');
    service.undone.push(drawingStub);
    service.redo();
    expect(service.done.length).toEqual(0)
    expect(service.undone.length).toBeGreaterThan(0)
    expect(spyRenderer).toHaveBeenCalled()
  })

  it('apply should call undo function and updateButtons',()=>{
    const name = 'Annuler';
    const spyUndo = spyOn(service, 'undo');
    const spyUpdate = spyOn(service, 'updateButtons');
    service.apply(name);
    expect(spyUndo).toHaveBeenCalled();
    expect(spyUpdate).toHaveBeenCalled();
  })

  it('apply should call redo function and updateButtons',()=>{
    const name = 'Refaire';
    const spyRedo = spyOn(service, 'redo');
    const spyUpdate = spyOn(service, 'updateButtons');
    service.apply(name);
    expect(spyRedo).toHaveBeenCalled();
    expect(spyUpdate).toHaveBeenCalled();
  })

  it('should emit enable disable', ()=>{
    const spyInteraction = spyOn(service.interact,'emitEnableDisable');
    service.updateButtons();
    expect(spyInteraction).toHaveBeenCalled()
  })
});
