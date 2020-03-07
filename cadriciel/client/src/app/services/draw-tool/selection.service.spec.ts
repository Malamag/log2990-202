import { TestBed } from '@angular/core/testing';
import {Renderer2} from '@angular/core';
import { SelectionService } from './selection.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { Point } from './point';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';

export class FakeInteractionService extends InteractionService{} 

fdescribe('SelectionService', () => {
    let service: SelectionService
    let render: Renderer2;
    let select: any
    
    beforeEach(() => {
        select = {
            children: ['1','2','3'],
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
        const spyMove = spyOn(service, 'moveSelection');
        const spyRect = spyOn(service, 'updateBoundingBox')
        service.selectedItems = [true, true];
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
    
});
