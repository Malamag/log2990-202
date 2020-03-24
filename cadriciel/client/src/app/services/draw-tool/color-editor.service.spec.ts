import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ColorEditorService } from './color-editor.service';

describe('ColorEditorService', () => {
    // tslint:disable-next-line: no-any
    let rdStub: any;
    // tslint:disable-next-line: no-any
    let htmlElementStub: any;
    beforeEach(() => {
        htmlElementStub = {
            style: {
                pointerEvents: 'none',
            },
        };
        rdStub = {
            /*Define render methods here*/
        };
        TestBed.configureTestingModule({
            providers: [
                { provide: HTMLElement, useValue: htmlElementStub },
                { provide: Boolean, useValue: false },
                { provide: Number, useValue: 0 },
                { provide: String, useValue: '' },
                { provide: Renderer2, useValue: rdStub },
            ],
        });
    });

    it('should be created', () => {
        const SERVICE: ColorEditorService = TestBed.get(ColorEditorService);
        expect(SERVICE).toBeTruthy();
    });
});
