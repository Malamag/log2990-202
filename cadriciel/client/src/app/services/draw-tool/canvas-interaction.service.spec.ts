import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { InteractionService } from '../service-interaction/interaction.service';
import { CanvasInteraction } from './canvas-interaction.service';
import { ElementInfo } from './element-info.service';
import { HtmlSvgFactory } from './html-svg-factory.service';
import { Point } from './point';
import { SelectionService } from './selection.service';

export class FakeInteractionService extends InteractionService { }

describe('CanvasInteractionService', () => {
  let service: SelectionService;
  // tslint:disable-next-line: prefer-const
  let render = jasmine.createSpyObj('Renderer2', ['setStyle']);
  // tslint:disable-next-line: no-any
  let select: any;
  // tslint:disable-next-line: no-any
  let firstChild: any;

  beforeEach(() => {
    firstChild = {
      getBoundingClientRect: () => 0,
      x: 2,
      y: 2,
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
    spyOn(ElementInfo, 'translate').and.returnValue(new Point(0, 2));
    spyOn(HtmlSvgFactory, 'svgDetailedCircle').and.returnValue('fakeCircle');
    spyOn(HtmlSvgFactory, 'svgRectangle').and.returnValue('fakeRect');
  });

  it('should move the selected items', () => {
    service.selectedItems = [true, false];
    const OFFSET = 5;

    service.drawing = select;
    CanvasInteraction.moveElements(OFFSET, OFFSET, service);
    expect(ElementInfo.translate).toHaveBeenCalled();
  });

  it('should not move the items not selected', () => {
    service.selectedItems = [false, false];
    const OFFSET = 5;

    CanvasInteraction.moveElements(OFFSET, OFFSET, service);
    expect(ElementInfo.translate).not.toHaveBeenCalled();
  });

  it('should empty the selected items', () => {
    service.selected = false;
    CanvasInteraction.createBoundingBox(service);
    expect(service.selectedItems).toEqual([]);
  });

  it('should get a precise border two times', () => {
    service.selectedItems = [true, false];
    service.selected = true;

    // tslint:disable-next-line: no-magic-numbers
    const FAKE_BORDER = [[0, true], [4, true], [3, true], [4, true]];
    const OLD_METHOD = CanvasInteraction.getPreciseBorder;
    CanvasInteraction.getPreciseBorder = jasmine.createSpy().and.returnValue(FAKE_BORDER);
    CanvasInteraction.createBoundingBox(service);
    expect(CanvasInteraction.getPreciseBorder).toHaveBeenCalled();
    CanvasInteraction.getPreciseBorder = OLD_METHOD; // Replaces the spy
  });
});
