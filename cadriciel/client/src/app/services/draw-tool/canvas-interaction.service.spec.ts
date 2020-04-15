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
  // tslint:disable-next-line: no-any
  let fakeDomRECT: any;
  beforeEach(() => {
    fakeDomRECT = {
      left: 200,
      top: 150,
      right: 0,
      bottom: 50,
    };

    firstChild = {
      getBoundingClientRect: () => 0,
      x: 2,
      y: 2,
      tagName: 'filter',
      transform: {
        translate: (x: number, y: number) => 0,
        rotate: (x: number, y: number) => 0,
      },
    };
    select = {
      children: [firstChild, firstChild],
      style: {
        pointerEvents: 'none',
      },
      childElementCount: 2,
      innerHTML: 'test',
      getBoundingClientRect: () => fakeDomRECT,
      lastElementChild: firstChild,
      transform: 2,
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: HTMLElement, useValue: select },
        { provide: Number, useValue: 0 },
        { provide: String, useValue: '' },
        { provide: Boolean, useValue: true },
        { provide: InteractionService, useClass: FakeInteractionService },
        { provide: Renderer2, useValue: render },
        { provide: DOMRect, useValue: fakeDomRECT }
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
    spyOn(ElementInfo, 'rotate').and.returnValue(2);
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
    const SMALL_NUM = 3;
    const BIG_NUM = 4;
    const FAKE_BORDER = [[0, true], [BIG_NUM, true], [SMALL_NUM, true], [BIG_NUM, true]];
    const OLD_METHOD = CanvasInteraction.getPreciseBorder;
    CanvasInteraction.getPreciseBorder = jasmine.createSpy().and.returnValue(FAKE_BORDER);
    CanvasInteraction.createBoundingBox(service);
    expect(CanvasInteraction.getPreciseBorder).toHaveBeenCalled();
    CanvasInteraction.getPreciseBorder = OLD_METHOD; // Replaces the spy
  });
  it('should return an invalid border', () => {
    const ITEM = document.createElement('input');
    const FIRST_CHILD = document.createElement('filter');
    const SECOND_CHILD = document.createElement('g');
    ITEM.appendChild(FIRST_CHILD);
    ITEM.appendChild(SECOND_CHILD);
    const TUPLE = [0, true];
    const POS = 3;
    const RET = CanvasInteraction.getPreciseBorder(ITEM);
    expect(RET[0]).toEqual(TUPLE);
    expect(RET[1]).toEqual(TUPLE);
    expect(RET[2]).toEqual(TUPLE);
    expect(RET[POS]).toEqual(TUPLE);
  });
  it('should return a valid border', () => {
    const ITEM = document.createElement('input');
    const FIRST_CHILD = document.createElement('filter');
    const SECOND_CHILD = document.createElement('g');
    ITEM.appendChild(FIRST_CHILD);
    SECOND_CHILD.setAttribute('stroke-width', '10');
    const POS = 3;
    const NUM = 100;
    ITEM.appendChild(SECOND_CHILD);
    const FIRST_RECORD: [number, boolean] = [NUM, true];
    const SECOND_RECORD: [number, boolean] = [NUM, false];
    const THIRD_RECORD: [number, boolean] = [NUM, true];
    const FOURTH_RECORD: [number, boolean] = [NUM, false];
    SECOND_CHILD.getBoundingClientRect = jasmine.createSpy().and.returnValue(fakeDomRECT);
    const RET = CanvasInteraction.getPreciseBorder(ITEM, [FIRST_RECORD, SECOND_RECORD, THIRD_RECORD, FOURTH_RECORD]);

    expect(RET[0]).toEqual([0, true]);
    expect(RET[1]).toEqual(SECOND_RECORD);
    expect(RET[2]).toEqual([0, true]);
    expect(RET[POS]).toEqual(FOURTH_RECORD);
  });

  it('should check if the item is inside the selection rectangle', () => {
    const SPY = spyOn(Point, 'rectOverlap');
    CanvasInteraction.retrieveItemsInRect(select, select, [true], [true], false);
    expect(SPY).toHaveBeenCalled();
  });

  it('should invert the selection for every selected item', () => {
    const SEL = [false, true]; // 2 children (see select stub)
    const INV_SEL = [true, false];

    spyOn(Point, 'rectOverlap').and.returnValue(true);
    CanvasInteraction.retrieveItemsInRect(select, select, SEL, INV_SEL, true);

    expect(SEL).toEqual(INV_SEL);
  });
  it('should not invert the selection for every selected item', () => {
    const SEL = [false, true, true];
    const INV_SEL = [true, true, true];

    spyOn(Point, 'rectOverlap').and.returnValue(true);
    CanvasInteraction.retrieveItemsInRect(select, select, SEL, INV_SEL, false);
    SEL.forEach((sel) => {
      expect(sel).toBeTruthy();
    });

    expect(INV_SEL[0]).toBeFalsy();
    expect(INV_SEL[1]).toBeFalsy();
    expect(INV_SEL[2]).toBeTruthy();
  });
  it('should not invert the selection for every selected item if not inside the box', () => {
    const SEL = [false, true, true];
    const INV_SEL = [false, false, false];

    spyOn(Point, 'rectOverlap').and.returnValue(false);
    CanvasInteraction.retrieveItemsInRect(select, select, SEL, INV_SEL, true);
    SEL.forEach((sel) => {
      expect(sel).toBeTruthy();
    });
  });
  it('the selected items should be set to true when there is not items to invert', () => {
    const SEL = [false, true, true];
    spyOn(Point, 'rectOverlap').and.returnValue(true);
    CanvasInteraction.retrieveItemsInRect(select, select, SEL, [], true);
    SEL.forEach((sel) => {
      expect(sel).toBeTruthy();
    });
  });

  it('the selected items should be set to false when there is not items to invert and not inside the box', () => {
    const SEL = [false, true, false];
    spyOn(Point, 'rectOverlap').and.returnValue(false);
    CanvasInteraction.retrieveItemsInRect(select, select, SEL, [], true);
    SEL.forEach((sel) => {
      expect(sel).toBeFalsy();
    });
  });
  it('should call rect over lap with the expected points', () => {
    const OLD_METHOD = CanvasInteraction.getPreciseBorder;
    const SMALL_NUM = 3;
    const BIG_NUM = 4;
    const FAKE_BORDER = [[0, true], [BIG_NUM, true], [SMALL_NUM, true], [BIG_NUM, true]];
    CanvasInteraction.getPreciseBorder = jasmine.createSpy().and.returnValue(FAKE_BORDER);
    firstChild.getBoundingClientRect = jasmine.createSpy().and.returnValue(fakeDomRECT);
    const SPY = spyOn(Point, 'rectOverlap');
    const FIRST_POINT = new Point(fakeDomRECT.left, fakeDomRECT.top);
    const SECOND_POINT = new Point(fakeDomRECT.right, fakeDomRECT.bottom);
    const THIRD_POINT = new Point(0, SMALL_NUM);
    const FOURTH_POINT = new Point(BIG_NUM, BIG_NUM);
    CanvasInteraction.retrieveItemsInRect(select, select, [true, true], [false, false], true);
    expect(SPY).toHaveBeenCalledWith(FIRST_POINT, SECOND_POINT, THIRD_POINT, FOURTH_POINT);
    CanvasInteraction.getPreciseBorder = OLD_METHOD;
  });

  it('should get a precise border two times on null canvas', () => {
    service.selectedItems = [true, false];
    select = null;
    service.canvas = select;
    service.selected = true;
    const SMALL_NUM = 3;
    const BIG_NUM = 4;
    const FAKE_BORDER = [[0, true], [BIG_NUM, true], [SMALL_NUM, true], [BIG_NUM, true]];
    const OLD_METHOD = CanvasInteraction.getPreciseBorder;
    CanvasInteraction.getPreciseBorder = jasmine.createSpy().and.returnValue(FAKE_BORDER);
    CanvasInteraction.createBoundingBox(service);
    expect(CanvasInteraction.getPreciseBorder).toHaveBeenCalled();
    CanvasInteraction.getPreciseBorder = OLD_METHOD; // Replaces the spy
  });

  it('should return a valid border', () => {
    const ITEM = select;
    const SECOND_CHILD = document.createElement('g');

    SECOND_CHILD.setAttribute('stroke-width', '10');
    const POS = 3;
    const FIRST_RECORD: [number, boolean] = [0, true];
    const SECOND_RECORD: [number, boolean] = [0, false];
    const THIRD_RECORD: [number, boolean] = [0, true];
    const FOURTH_RECORD: [number, boolean] = [0, false];
    SECOND_CHILD.getBoundingClientRect = jasmine.createSpy().and.returnValue(fakeDomRECT);
    const RET = CanvasInteraction.getPreciseBorder(ITEM, [FIRST_RECORD, SECOND_RECORD, THIRD_RECORD, FOURTH_RECORD]);

    expect(RET[0]).toEqual(FIRST_RECORD);
    expect(RET[1]).toEqual(SECOND_RECORD);
    expect(RET[2]).toEqual(THIRD_RECORD);
    expect(RET[POS]).toEqual(FOURTH_RECORD);
  });

  it('should call rect over lap with the expected invalid points on null selection Rectangle', () => {
    select.lastElementChild = null;
    const OLD_METHOD = CanvasInteraction.getPreciseBorder;
    const SMALL_NUM = 3;
    const BIG_NUM = 4;
    const FAKE_BORDER = [[0, true], [BIG_NUM, true], [SMALL_NUM, true], [BIG_NUM, true]];
    CanvasInteraction.getPreciseBorder = jasmine.createSpy().and.returnValue(FAKE_BORDER);
    firstChild.getBoundingClientRect = jasmine.createSpy().and.returnValue(fakeDomRECT);
    const SPY = spyOn(Point, 'rectOverlap');
    // tslint:disable-next-line: no-magic-numbers
    const FIRST_POINT = new Point(-1, -1);
    // tslint:disable-next-line: no-magic-numbers
    const SECOND_POINT = new Point(-1, -1);
    const THIRD_POINT = new Point(0, SMALL_NUM);
    const FOURTH_POINT = new Point(BIG_NUM, BIG_NUM);
    CanvasInteraction.retrieveItemsInRect(select, select, [true, true], [false, false], true);
    expect(SPY).toHaveBeenCalledWith(FIRST_POINT, SECOND_POINT, THIRD_POINT, FOURTH_POINT);
    CanvasInteraction.getPreciseBorder = OLD_METHOD;
  });
  it('should not translate the elements on rotate function', () => {
    const ANGLE = 2;
    const AVERAGE = false;
    service.selectedItems = [false, false];
    const TRANSLATE_SPY = spyOn(service.canvas, 'getBoundingClientRect');
    CanvasInteraction.rotateElements(ANGLE, service, AVERAGE);
    expect(TRANSLATE_SPY).not.toHaveBeenCalled();
  });
  it('should set the style of the element', () => {
    const ANGLE = 2;
    const AVERAGE = true;
    service.selectedItems = [true, false];
    spyOn(service.canvas, 'getBoundingClientRect').and.returnValue(fakeDomRECT);
    spyOn(ElementInfo, 'center').and.returnValue(new Point(0, 0));
    spyOn(ElementInfo, 'rotate').and.returnValue(2);
    CanvasInteraction.rotateElements(ANGLE, service, AVERAGE);
    expect(render.setStyle).toHaveBeenCalled();
  });
});
