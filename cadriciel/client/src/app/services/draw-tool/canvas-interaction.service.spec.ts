import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { InteractionService } from '../service-interaction/interaction.service';
import { CanvasInteraction } from './canvas-interaction.service';
import { Point } from './point';
import { SelectionService } from './selection.service';
import { ElementInfo } from './element-info.service';

export class FakeInteractionService extends InteractionService { }

describe('CanvasInteractionService', () => {
  let service: SelectionService;
    // tslint:disable-next-line: prefer-const
  let render: Renderer2;
    // tslint:disable-next-line: no-any
  let select: any;
    // tslint:disable-next-line: no-any
  let firstChild: any;

  beforeEach(() => {
    firstChild = {
      getBoundingClientRect: () => 0,
    };
    select = {
      children: [firstChild, firstChild],
      style: {
          pointerEvents: 'none',
      },
      childElementCount: 2,
      innerHTML: 'test',
      getBoundingClientRect: () => 0,
    };
    TestBed.configureTestingModule({
      providers: [
          { provide: Point },
          { provide: HTMLElement, useValue: select },
          { provide: Number, useValue: 0 },
          { provide: String, useValue: '' },
          { provide: Boolean, useValue: true },
          { provide: InteractionService, useClass: FakeInteractionService },
          { provide: Renderer2, useValue: render },
      ],
  });
    service = TestBed.get(SelectionService);
  });

  it('should move the selected items', () => {
    service.selectedItems = [true, true];
    const OFFSET = 5;
    const SPY = spyOn(ElementInfo, 'translate');
    CanvasInteraction.moveElements(OFFSET, OFFSET, service);
    expect(SPY).toHaveBeenCalled();
  });

  it('should not move the items not selected', () => {
    service.selectedItems = [false, false];
    const OFFSET = 5;
    const SPY = spyOn(ElementInfo, 'translate');
    CanvasInteraction.moveElements(OFFSET, OFFSET, service);
    expect(SPY).not.toHaveBeenCalled();
  });

  it('should create a bounding box', () => {
    /**/
  });

  it('should get Precise Border', () => {
    /**/
  });

  it('should retrieve the items in rectangle', () => {
    /**/
  });

});
