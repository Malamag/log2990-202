import { TestBed } from '@angular/core/testing';
import {Renderer2} from '@angular/core';
import { SelectionService } from './selection.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { Point } from './point';

export class FakeInteractionService extends InteractionService{} 

fdescribe('SelectionService', () => {
    let service: SelectionService
    let render: Renderer2;
    let select: any
    let kbAllSelect: any;
    beforeEach(() => {
        select = {
            children: "hello",
        }
        kbAllSelect = {
            keyCode : 65,
            ctrlDown: true,
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

        service.updateDown(kbAllSelect);
    })

});
