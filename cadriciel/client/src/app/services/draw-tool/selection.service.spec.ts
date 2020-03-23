import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { CanvasInteraction } from './canvas-interaction.service';
import { MoveWithArrows } from './move-with-arrows.service';
import { Point } from './point';
import { SelectionService } from './selection.service';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { ColorConvertingService } from '../colorPicker/color-converting.service';

export class FakeInteractionService extends InteractionService { }

describe('SelectionService', () => {
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
        service.selectedItems = [false, false, false];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should call create bounding box of canvas interaction and move with the arrows', () => {
        const KEYBOARD = new KeyboardHandlerService();
        const CTRL_A = 65;
        KEYBOARD.keyCode = CTRL_A;
        KEYBOARD.ctrlDown = true;
        KEYBOARD.released = false;
        const CANVAS_SPY = spyOn(CanvasInteraction, 'createBoundingBox');
        const ARROW_SPY = spyOn(MoveWithArrows, 'once');
        service.updateDown(KEYBOARD);
        expect(CANVAS_SPY).toHaveBeenCalled();
        expect(ARROW_SPY).toHaveBeenCalled();
    });
    it('should reset the arrow at the expected position and not emit drawing', () => {
        const KEY_CODE = 37;
        const POS = 0;
        service.arrows = [true, true, true, true];
        const SPY = spyOn(service.interaction, 'emitDrawingDone');
        service.updateUp(KEY_CODE);
        expect(SPY).toHaveBeenCalledTimes(0);
        expect(service.arrows[POS]).toBeFalsy();
        expect(service.arrowTimers[POS]).toEqual(0);
        expect(service.singleUseArrows[POS]).toBeFalsy();
    });
    it('should call emit drawing', () => {
        const KEY_CODE = 37;
        service.movedSelectionWithArrowsOnce = true;
        service.arrows = [true, false, false, false];
        const SPY = spyOn(service.interaction, 'emitDrawingDone');
        service.updateUp(KEY_CODE);
        expect(SPY).toHaveBeenCalled();
    });
    it('should set the inverted items to false', () => {
        service.selectedItems = [true, true];
        const POINT = new Point(1, 1);
        service.down(POINT, false, true);
        for (let i = 0; i < service.selectedItems.length; ++i) {
            expect(service.invertedItems[i]).toBeFalsy();
        }
    });
    it('should empty the selected items array', () => {
        const POINT = new Point(1, 1);
        service.itemUnderMouse = 2;
        service.selectedItems[2] = false;
        service.down(POINT, false, false);
        expect(service.selectedItems[2]).toBeTruthy();
        expect(service.movingSelection).toBeTruthy();
    });
    it('should not call create bounding box', () => {
        const POINT = new Point(1, 1);
        const SPY = spyOn(CanvasInteraction, 'createBoundingBox');
        service.ignoreNextUp = true;
        service.up(POINT);
        expect(SPY).toHaveBeenCalledTimes(0);
    });
    it('should empty the selected items and the inverted items', () => {
        service.inverted = false;
        service.ignoreNextUp = false;
        service.currentPath = [new Point(0, 0), new Point(1, 1)];
        service.selectedItems = [true, false];
        service.invertedItems = [false, true];
        service.up(new Point(1, 1));
        expect(service.selectedItems).toEqual([]);
        expect(service.invertedItems).toEqual([]);
    });
    it('should set the inverted items to be opoosite to selected items', () => {
        service.inverted = true;
        service.itemUnderMouse = 1;
        service.ignoreNextUp = false;
        service.currentPath = [new Point(0, 0), new Point(1, 1)];
        service.selectedItems = [true, true];
        service.invertedItems = [];
        service.up(new Point(1, 1));
        for (let i = 0; i < service.selectedItems.length; ++i) {
            expect(service.invertedItems[i]).toBeFalsy();
        }
        expect(service.selectedItems[1]).toBeFalsy();
    });
    it('should set the selected items at the item under mouse to be truthy', () => {
        service.inverted = true;
        service.itemUnderMouse = 1;
        service.ignoreNextUp = false;
        service.currentPath = [new Point(0, 0), new Point(1, 1)];
        service.selectedItems = [true, false];
        service.up(new Point(1, 1));
        expect(service.selectedItems[1]).toBeTruthy();
    });
    it('should emit the drawing', () => {
        service.inverted = true;
        service.itemUnderMouse = 1;
        service.ignoreNextUp = false;
        service.currentPath = [new Point(0, 0), new Point(1, 1)];
        service.selectedItems = [true, false];
        service.movingSelection = true;
        service.movedSelectionOnce = true;
        const SPY = spyOn(service.interaction, 'emitDrawingDone');
        service.up(new Point(1, 1));
        expect(SPY).toHaveBeenCalled();
    });
    it('should not create the bounding box', () => {
        const SPY = spyOn(CanvasInteraction, 'createBoundingBox');
        service.isDown = false;
        service.move(new Point(1, 1));
        expect(SPY).toHaveBeenCalledTimes(0);
    });
    it('should move elements', () => {
        const SPY = spyOn(CanvasInteraction, 'moveElements');
        service.isDown = true;
        service.movingSelection = true;
        service.currentPath = [new Point(0, 0)];
        service.move(new Point(1, 1));
        expect(SPY).toHaveBeenCalled();
    });
    it('should empty the selected items container', () => {
        service.isDown = true;
        const SPY = spyOn(CanvasInteraction, 'retrieveItemsInRect');
        service.selectedItems = [true, true];
        service.inverted = false;
        service.currentPath = [new Point(0, 0)];
        service.movingSelection = false;
        const OFFSET = 11;
        service.move(new Point(OFFSET, OFFSET));
        expect(service.selectedItems).toEqual([]);
        expect(SPY).toHaveBeenCalled();
    });
    it('should return an empty string', () => {
        const POINT_CONTAINER = [new Point(0, 0)];
        expect(service.createPath(POINT_CONTAINER)).toEqual('');
    });
    it('should have a name', () => {
        const NUM = 10;
        const POINT_CONTAINER = [new Point(0, 0), new Point(NUM, NUM)];
        const EXPECTED_CONTAIN = '<g name = "selection-perimeter">';
        expect(service.createPath(POINT_CONTAINER)).toContain(EXPECTED_CONTAIN);
    });
    it('should return an empty string because the height is zero', () => {
        const NUM = 10;
        const POINT_CONTAINER = [new Point(0, 0), new Point(NUM, 0)];
        expect(service.createPath(POINT_CONTAINER)).toEqual('');
    });

    it('should construct', () => {
        const NEW_SEL_SERVICE = new SelectionService(
            select,
            select,
            true,
            new InteractionService(),
            new ColorPickingService(new ColorConvertingService()),
            render,
            select,
            select);
        expect(NEW_SEL_SERVICE).toBeTruthy();
    });
});
