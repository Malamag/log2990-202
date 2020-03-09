import { TestBed } from '@angular/core/testing';
import {Renderer2} from '@angular/core';
import { SelectionService } from './selection.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { Point } from './point';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';

export class FakeInteractionService extends InteractionService{} 

describe('SelectionService', () => {
    let service: SelectionService
    let render: Renderer2;
    let select: any
    let firstChild: any
    beforeEach(() => {
        firstChild ={
            getBoundingClientRect : () => 0,
        }
        select = {
            children: [firstChild, firstChild],
            style: {
                pointerEvents: "none",
            },
            getBoundingClientRect :  () => 0,
        }
        TestBed.configureTestingModule({
            providers: [{ provide: Point },
                { provide: HTMLElement, useValue: select },
                { provide: Number, useValue: 0 },
                { provide: String, useValue: '' },
                { provide: Boolean, useValue: true },
                { provide: InteractionService, useClass: FakeInteractionService },
                {provide: Renderer2, useValue: render},],
        });
        service = TestBed.get(SelectionService)
        service.selectedItems = [false, false, false];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should select all the items', () => {
        const kbStub = new KeyboardHandlerService()
        const spyRect = spyOn(service, 'updateBoundingBox')
        kbStub.keyCode = 65;
        kbStub.ctrlDown = true;
        service.updateDown(kbStub);
        expect(service.selectedItems[0]).toBeTruthy()
        expect(spyRect).toHaveBeenCalled()
    })
    it('should move wirh the arrows to the left direction', () => {
        const spyMove = spyOn(service, 'moveWithArrowOnce')
        const kbStub = new KeyboardHandlerService()
        kbStub.keyCode = 37;
        service.updateDown(kbStub)
        expect(spyMove).toHaveBeenCalled()
        expect(service.arrows[0]).toBeTruthy()
    })

    it('should move wirh the arrows to the up direction', () => {
        const spyMove = spyOn(service, 'moveWithArrowOnce')
        const kbStub = new KeyboardHandlerService()
        kbStub.keyCode = 38;
        service.updateDown(kbStub)
        expect(spyMove).toHaveBeenCalled()
        expect(service.arrows[1]).toBeTruthy()
    })

    it('should move with the arrows to right direction', () => {
        const spyMove = spyOn(service, 'moveWithArrowOnce')
        const kbStub = new KeyboardHandlerService()
        kbStub.keyCode = 39;
        service.updateDown(kbStub)
        expect(spyMove).toHaveBeenCalled()
        expect(service.arrows[2]).toBeTruthy()
    })
    it('should move with the arrows to the down direction', () => {
        const spyMoveOnce = spyOn(service, 'moveWithArrowOnce')
        const kbStub = new KeyboardHandlerService()
        kbStub.keyCode = 40;
        service.updateDown(kbStub)
        expect(spyMoveOnce).toHaveBeenCalled()
        expect(service.arrows[3]).toBeTruthy()
    })
    it('should move the selection with one arrow to the left ', ()=> {
        const spyMove = spyOn(service, 'moveSelection');
        const spyRect = spyOn(service, 'updateBoundingBox')
        service.selectedItems = [true, true]
        service.moveWithArrowOnce(true, false, false, false);
        expect(service.movedSelectionWithArrowsOnce).toBeTruthy()
        expect(spyMove).toHaveBeenCalled()
        expect(spyRect).toHaveBeenCalled()
        expect(service.singleUseArrows[0]).toBeTruthy()
    })

    it('should move the selection with the up arrow', () =>{
        service.moveWithArrowOnce(false, true, false, false)
        expect(service.singleUseArrows[1]).toBeTruthy()
    })
    it('should move the selection to the right direction', () => {
        service.moveWithArrowOnce(false, false, true, false)
        expect(service.singleUseArrows[2]).toBeTruthy()
    })
    it('should move the selection with the down arrow', ()=>{
        service.moveWithArrowOnce(false, false, false, true)
        expect(service.singleUseArrows[3]).toBeTruthy()
    })

    it('should move the selection to the left and to the up direction', () =>{
        service.arrows[0] = true;
        service.arrows[1] = true;
        const spyMove = spyOn(service, 'moveSelection');
        const spyRect = spyOn(service, 'updateBoundingBox')
        service.selectedItems = [true, true];
        service.moveWithArrowsLoop()
        expect(service.existingLoop).toBeTruthy()
        expect(spyMove).toHaveBeenCalled()
        expect(spyRect).toHaveBeenCalled()
        expect(service.movedSelectionWithArrowsOnce).toBeTruthy()
    })
    it('should move the selection to the right and to the down direction', () => {
        service.arrows[2] = true;
        service.arrows[3] = true;
        service.selectedItems = [true, true];
        const spyMove = spyOn(service, 'moveSelection');
        const spyRect = spyOn(service, 'updateBoundingBox')
        service.moveWithArrowsLoop()
        expect(service.existingLoop).toBeTruthy()
        expect(spyMove).toHaveBeenCalled()
        expect(spyRect).toHaveBeenCalled()
        expect(service.movedSelectionWithArrowsOnce).toBeTruthy()
    })
    it('should emit the drawing when the key is up', ()=>{
        service.arrows[0] = true;
        service.movedSelectionWithArrowsOnce = true;
        const spyEmit = spyOn(service.interaction, 'emitDrawingDone')
        service.updateUp(37);
        expect(service.movedSelectionWithArrowsOnce).toBeFalsy()
        expect(spyEmit).toHaveBeenCalled()
        expect(service.canMoveSelection).toBeFalsy()
        expect(service.arrows[0]).toBeFalsy()
    })

    it('should be able move the selection', () => {
        service.arrows[0]= true;
        service.arrows[1] = true;
        service.updateUp(38);
        expect(service.canMoveSelection).toBeTruthy();
        expect(service.arrows[1]).toBeFalsy()
    })
    it(' should not call the emit drawing method', () => {
        service.arrows[2]= true;
        service.arrows[3] = true;
        const spyEmit = spyOn(service.interaction, 'emitDrawingDone')
        service.updateUp(39);
        expect(service.arrows[2]).toBeFalsy()
        expect(service.canMoveSelection).toBeTruthy()
        expect(spyEmit).toHaveBeenCalledTimes(0)
    })
    it(' should reset the arrow timer', () => {
        service.arrows[3] = true;
        service.arrowTimers[3] = 400;
        service.singleUseArrows[3] = true;
        service.updateUp(40)
        expect(service.arrows[3]).toBeFalsy()
        expect(service.arrowTimers[3]).toEqual(0)
        expect(service.singleUseArrows[3]).toBeFalsy()
    })
    
    it(' should include the points to the current path twice and set some attributes' , () => {
        const POINT = new Point(0, 0 );
        const RIGHTCLICK = true;
        const insideWorkingSpace = false;
        const pushSpy = spyOn(service.currentPath, 'push');
        const updateSpy = spyOn(service, 'updateProgress');
        service.selectedItems = [true, true]
        service.down(POINT, insideWorkingSpace, RIGHTCLICK);
        for(let i = 0; i < service.selectedItems.length; ++i){
            expect(service.invertedItems[i]).toBeFalsy()
        }
        expect(service.ignoreNextUp).toBeFalsy()
        expect(service.isDown).toBeTruthy()
        expect(service.inverted).toBeTruthy()
        expect(pushSpy).toHaveBeenCalledTimes(2)
        expect(updateSpy).toHaveBeenCalled()
        expect(service.movingSelection).toBeFalsy()
    })

    it('should empty the selected array and set some attributes', () => {
        service.itemUnderMouse = 3;
        service.selectedItems[3] = false
        const rightClick = false;
        const POINT = new Point(0, 0 );
        const insideWorkingSpace = false;
        service.down(POINT, insideWorkingSpace, rightClick);
        expect(service.selectedItems[3]).toBeTruthy()
        expect(service.movingSelection).toBeTruthy()
    })
    it('isDown atrribuute should be truthy and not call functions', () => {
        service.ignoreNextUp = true;
        service.isDown = true;
        const updateSpy = spyOn(service, 'updateBoundingBox');
        service.up(new Point(0, 0))
        expect(service.isDown).toBeTruthy();
        expect(updateSpy).toHaveBeenCalledTimes(0);
    })
    it('should set some attributes and emit the drawing', () => {
        service.currentPath[0] = new Point(0, 0);
        service.currentPath.push(new Point(10, 10));
        service.inverted = true;
        service.ignoreNextUp = false;
        service.selectedItems = [true, true, true, true]
        service.movingSelection = true;
        service.movedSelectionOnce = true;
        service.itemUnderMouse = 3;
        const emitSpy = spyOn(service.interaction, 'emitDrawingDone')
        service.up(new Point(0, 0))
        expect(service.isDown).toBeFalsy()
        for(let i = 0; i < service.selectedItems.length; ++i){
            expect(service.invertedItems[i]).toBeFalsy()
        }
        expect(emitSpy).toHaveBeenCalled()
        expect(service.itemUnderMouse).toBeNull()
        expect(service.currentPath.length).toEqual(0)
        expect(service.selectedItems[3]).toBeTruthy()
    })
    it('should empty the selected items array and the inverted items', () => {
        service.currentPath[0] = new Point(0, 0);
        service.currentPath.push(new Point(10, 10));
        service.inverted = false;
        service.itemUnderMouse = 3;
        service.up(new Point(0, 0));
        expect(service.invertedItems).toEqual([]);
    })
    it('move should not update the bounding box', () => {
        service.isDown = false;
        const spy = spyOn(service, 'updateBoundingBox')
        service.move(new Point(0, 0));
        expect(spy).toHaveBeenCalledTimes(0);
    })
    it('should update the progress and retreive ithe items in the rectangle', ()=>{
        service.currentPath = []
        service.isDown = true;
        service.movingSelection = false;
        service.inverted = false;
        service.currentPath.push(new Point(0, 0))
        const retreiveSpy = spyOn(service, 'retrieveItemsInRect')
        const progressSpy = spyOn(service, 'updateProgress')
        const boxSpy = spyOn(service, 'updateBoundingBox')
        service.move(new Point(10, 10));
        expect(service.selectedItems).toEqual([])
        expect(retreiveSpy).toHaveBeenCalled()
        expect(progressSpy).toHaveBeenCalled()
        expect(boxSpy).toHaveBeenCalled()
    })
    it('should move the selection', () => {
        const moveSpy = spyOn(service, 'moveSelection');
        service.currentPath.push(new Point(0 , 0))
        service.isDown = true;
        service.movingSelection = true;
        service.move(new Point(0 , 0))
        expect(moveSpy).toHaveBeenCalled()
    })
    it('should empty the selected items array', () => {
        service.selectedItems = [true, true, true]
        service.selected = false;
        service.updateBoundingBox()
        expect(service.selectedItems).toEqual([]);
    })
    it('the result should contain a rectangle', () => {
        service.selected = true;
        let ret = service.updateBoundingBox()
        expect(ret).toBe('')
    })


    it('should call set style of renderer', () => {
        service.selectedItems = [true, true, false, true]
        const styleSpy = jasmine.createSpy('setStyle')
        service.drawing.innerHTML = '<div> hello world </div>';
        service.moveSelection(10, 10);
        expect(styleSpy).toHaveBeenCalled()
    })

    it('should select items', () => {
        service.drawing.innerHTML = '<div> hello world </div>';
        service.inverted = true;
        Point.rectOverlap = jasmine.createSpy().and.returnValue(true);
        service.retrieveItemsInRect();
        expect(service.selectedItems[0]).toBeTruthy()
        expect(service.invertedItems[0]).toBeTruthy()
    })
    it('should return an empty string', () => {
        const point = new Point(0 , 0);
        const pointContainer = [point];
        const ret = service.createPath(pointContainer)
        expect(ret).toEqual('');
    })
    it('should return an empty string because the width and height equal zero', () => {
        const point = new Point(0 , 0);
        const pointConatiner = [point, point, point];
        const ret = service.createPath(pointConatiner)
        expect(ret).toEqual('')
    })
    it('should return a valid string', () => {
        const firstPoint = new Point(0 , 0)
        const secondPoint = new Point(5 , 5)
        const pointConatiner = [firstPoint , secondPoint]
        const ret = service.createPath(pointConatiner)
        expect(ret).toContain('<g name = "selection-perimeter">')
    })
});

