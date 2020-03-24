import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { InteractionService } from '../service-interaction/interaction.service';
import { CanvasInteraction } from './canvas-interaction.service';
import { MoveWithArrows } from './move-with-arrows.service';
import { Point } from './point';
import { SelectionService } from './selection.service';

export class FakeInteractionService extends InteractionService { }
describe('MoveWithArrows', () => {
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
  it('once should set the moved selection attribute to true', () => {
    service.singleUseArrows = [true, false, false, true];
    service.selectedItems = [true, true, true, false];
    MoveWithArrows.once(true, true, true, false, service);
    expect(service.movedSelectionWithArrowsOnce).toBeTruthy();
  });
  it('should move elements', () => {
    service.singleUseArrows = [true, false, false, true];
    service.selectedItems = [true, true, true, false];
    const SPY_MOVE = spyOn(CanvasInteraction, 'moveElements');
    const CREATE_SPY = spyOn(CanvasInteraction, 'createBoundingBox');
    MoveWithArrows.once(true, true, true, true, service);
    expect(SPY_MOVE).toHaveBeenCalled();
    expect(CREATE_SPY).toHaveBeenCalled();
  });
  it('should not move elements', () => {
    service.singleUseArrows = [true, false, false, true];
    service.selectedItems = [];
    const SPY_MOVE = spyOn(CanvasInteraction, 'moveElements');
    const CREATE_SPY = spyOn(CanvasInteraction, 'createBoundingBox');
    MoveWithArrows.once(true, true, true, true, service);
    expect(SPY_MOVE).toHaveBeenCalledTimes(0);
    expect(CREATE_SPY).toHaveBeenCalledTimes(0);
  });
  it('loop should set the value of move selection with arrows once to false', () => {
    service.selectedItems = [true, true, true, false];
    service.arrows = [true, false, true, false];
    const START_DELAY = 50;
    const MOUVEMENT_DELAY = 100;
    const EXTRA_TIME = 150;
    service.arrowTimers = [EXTRA_TIME, MOUVEMENT_DELAY, START_DELAY, 0];
    const MOVE_SPY = spyOn(CanvasInteraction, 'moveElements');
    MoveWithArrows.loop(service, START_DELAY, MOUVEMENT_DELAY);
    expect(MOVE_SPY).toHaveBeenCalled();
    expect(service.movedMouseOnce).toBeFalsy();
  });
  it('loop should not create a bounding box', () => {
    service.selectedItems = [];
    service.arrows = [true, false, true, true];
    const START_DELAY = 50;
    const MOUVEMENT_DELAY = 100;
    const EXTRA_TIME = 150;
    service.arrowTimers = [EXTRA_TIME, MOUVEMENT_DELAY, START_DELAY, 0];
    const CREATE_SPY = spyOn(CanvasInteraction, 'createBoundingBox');
    MoveWithArrows.loop(service, START_DELAY, MOUVEMENT_DELAY);
    expect(CREATE_SPY).toHaveBeenCalledTimes(0);
    expect(service.movedMouseOnce).toBeFalsy();
  });
  it('loop should set the moved selection attribute to false', () => {
    service.selectedItems = [];
    service.arrows = [true, true, true, true];
    const START_DELAY = 50;
    const MOUVEMENT_DELAY = 100;
    const EXTRA_TIME = 150;
    service.arrowTimers = [EXTRA_TIME, MOUVEMENT_DELAY, START_DELAY, 0];
    MoveWithArrows.loop(service, START_DELAY, MOUVEMENT_DELAY);
    expect(service.movedMouseOnce).toBeFalsy();
  });
});
