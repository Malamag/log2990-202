import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { InteractionService } from '../service-interaction/interaction.service';
import { CanvasInteraction } from './canvas-interaction.service';
import { ClipboardService } from './clipboard.service';
import { Point } from './point';

export class FakeInteractionService extends InteractionService { }

describe('ClipboardService', () => {
  let service: ClipboardService;
  // tslint:disable-next-line: no-any
  let render: any;
  // tslint:disable-next-line: no-any
  let domrect: any;
  // tslint:disable-next-line: no-any
  let firstChild: any;
  // tslint:disable-next-line: no-any
  let elementStub: any;
  beforeEach(() => {
    domrect = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    };
    render = {
      setAttribute: () => 0,
    };
    elementStub = {
      children: [firstChild, firstChild, firstChild],
      style: {
        pointerEvents: 'none',
      },
      cloneNode: () => 0,
      appendChild: () => 0,
      getBoundingClientRect: () => 0,
      remove: () => 0,
    };
    firstChild = {
      getBoundingClientRect: () => 0,
      getAttribute: () => 'false',
      remove: () => 0,
      cloneNode: () => 0,
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Point },
        { provide: HTMLElement, useValue: elementStub },
        { provide: HTMLCollection, useValue: elementStub },
        { provide: Element, useValue: elementStub },
        { provide: Number, useValue: 0 },
        { provide: String, useValue: '' },
        { provide: Boolean, useValue: true },
        { provide: InteractionService, useClass: FakeInteractionService },
        { provide: Renderer2, useValue: render },
        { provide: DOMRect, useValue: domrect },
      ],
    });
    service = TestBed.get(ClipboardService);
    service.currentSelection.drawing = elementStub;
    service.currentSelection.selectedRef = elementStub;
    service.currentSelection.canvas = elementStub;
    service.currentSelection.selectedItems = [true, false, true];
    service.clipboardContent = [elementStub, elementStub, elementStub];

  });

  it('should be created', () => {
    const SERVICE: ClipboardService = TestBed.get(ClipboardService);
    expect(SERVICE).toBeTruthy();
  });

  it('should call copy', () => {
    const SPY = spyOn(service, 'copy');
    service.apply('Copier');
    expect(SPY).toHaveBeenCalled();
  });

  it('should call cut', () => {
    const SPY = spyOn(service, 'cut');
    service.apply('Couper');
    expect(SPY).toHaveBeenCalled();
  });

  it('should call paste', () => {
    const SPY = spyOn(service, 'paste');
    service.apply('Coller');
    expect(SPY).toHaveBeenCalled();
  });

  it('should call duplicate', () => {
    const SPY = spyOn(service, 'duplicate');
    service.apply('Dupliquer');
    expect(SPY).toHaveBeenCalled();
  });

  it('should call delete', () => {
    const SPY = spyOn(service, 'delete');
    service.apply('Supprimer');
    expect(SPY).toHaveBeenCalled();
  });

  it('should emit drawing done when all clipboard functions called', () => {
    const NB_FUNC_CALLED = 4;
    spyOn(firstChild, 'remove').and.returnValue(0);
    const SPY = spyOn(service.interact, 'emitDrawingDone');
    service.apply('Couper');
    service.apply('Supprimer');
    service.apply('Coller');
    service.apply('Dupliquer');
    expect(SPY).toHaveBeenCalledTimes(NB_FUNC_CALLED);
  });

  it('should create a bounding box to update viusal feedback of selected items when all clipboard functions called', () => {
    const NB_FUNC_CALLED = 4;
    const SPY = spyOn(CanvasInteraction, 'createBoundingBox');
    service.apply('Couper');
    service.apply('Supprimer');
    service.apply('Coller');
    service.apply('Dupliquer');
    expect(SPY).toHaveBeenCalledTimes(NB_FUNC_CALLED);
  });

  it('should check if the element we will paste fits on the canvas', () => {
    const SPY = spyOn(Point, 'rectOverlap');
    service.apply('Coller');
    expect(SPY).toHaveBeenCalledTimes(1);
  });

  it('should check if the element we will duplicate fits on the canvas', () => {
    const SPY = spyOn(Point, 'rectOverlap');
    service.apply('Dupliquer');
    expect(SPY).toHaveBeenCalledTimes(1);
  });

  it('shoud get bounding client rect of the canvas', () => {
    const SPY = spyOn(service.currentSelection.canvas, 'getBoundingClientRect').and.returnValue(domrect);
    service.paste();
    expect(SPY).toHaveBeenCalled();
  });

  it('shoud get bounding client rect of the selectedRef', () => {
    const SPY = spyOn(service.currentSelection.selectedRef, 'getBoundingClientRect').and.returnValue(domrect);
    service.paste();
    expect(SPY).toHaveBeenCalled();
  });

  it('shoud set attribute isListening (true) of the clone were pasting on the canvas ', () => {
    const NB_FUNC_CALLED = 3;
    const SPY = spyOn(service.render, 'setAttribute');
    service.paste();
    expect(SPY).toHaveBeenCalledTimes(NB_FUNC_CALLED);
  });

  it('shoud clone each node in the clipboard when pasting', () => {
    const NB_FUNC_CALLED = 3;
    const SPY = spyOn(elementStub, 'cloneNode');
    service.paste();
    expect(SPY).toHaveBeenCalledTimes(NB_FUNC_CALLED);
  });

  it('shoud append each children clone created into drawing', () => {
    const NB_FUNC_CALLED = 3;
    const SPY = spyOn(service.currentSelection.drawing, 'appendChild');
    service.paste();
    expect(SPY).toHaveBeenCalledTimes(NB_FUNC_CALLED);
  });

  it('shoud dispatch new drawing when pasting ', () => {
    const NB_FUNC_CALLED = 3;
    const SPY = spyOn(window, 'dispatchEvent');
    service.paste();
    expect(SPY).toHaveBeenCalledTimes(NB_FUNC_CALLED);
  });

  it('should push true in the selectedItems array after pasting element on the canvas ', () => {
    const NB_FUNC_CALLED = 3;
    const SPY = spyOn(service.currentSelection.selectedItems, 'push');
    service.paste();
    expect(SPY).toHaveBeenCalledTimes(NB_FUNC_CALLED);
  });

  it('should move the selected items to be pasted with the offset  ', () => {
    const NB_FUNC_CALLED = 2;
    const SPY = spyOn(CanvasInteraction, 'moveElements');
    service.paste();
    service.duplicate();
    expect(SPY).toHaveBeenCalledTimes(NB_FUNC_CALLED);
  });

  it('shoud clone each node in drawing when duplicating', () => {
    const NB_FUNC_CALLED = 1;
    service.currentSelection.drawing.children[0] = elementStub;
    service.currentSelection.drawing.children[1] = elementStub;
    const SPY = spyOn(service.currentSelection.drawing.children[0], 'cloneNode');
    service.duplicate();
    expect(SPY).toHaveBeenCalledTimes(NB_FUNC_CALLED);
  });
});
