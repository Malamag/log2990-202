import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportService } from '../services/exportation/export.service';
import { InteractionService } from '../services/service-interaction/interaction.service';
import { CanvasSwitchDirective } from './canvas-switch.directive';

@Component({
    // building a fake component for test purposes
    template: `
        <canvas #testRef></canvas>
        <svg appCanvasSwitch [width]="200" [height]="100">
            <rect width="100%" height="100%" fill="blue" />
        </svg>
    `,
})
class TestCanvasSwitchComponent {}
/*
This method for testing directives is inspired from
ASIM. 2020. 'Testing Directives'. [En ligne]: https://codecraft.tv/courses/angular/unit-testing/directives/
*/

describe('CanvasSwitchDirective', () => {
    let component: TestCanvasSwitchComponent;
    let fixture: ComponentFixture<TestCanvasSwitchComponent>;
    // tslint:disable-next-line: no-any
    let elemStub: any;
    // tslint:disable-next-line: no-any
    let exServiceStub: any;
    // tslint:disable-next-line: no-any
    let htmlElementStub: any;

    let itService: InteractionService;
    let dir: CanvasSwitchDirective;
    // tslint:disable-next-line: no-any
    let rdStub: any;
    beforeEach(() => {
        rdStub = {
            createElement: () => htmlElementStub,
            setAttribute: () => 0,
        };
        htmlElementStub = {
            style: {
                display: 'none',
            },
            getContext: () => 0,
        };
        elemStub = {
            nativeElement: htmlElementStub,
        };
        exServiceStub = {
            exportInCanvas: () => 0,
        };
        itService = new InteractionService();
        TestBed.configureTestingModule({
            declarations: [CanvasSwitchDirective, TestCanvasSwitchComponent],
            providers: [
                { provide: ElementRef, useValue: elemStub },
                { provide: ExportService, useValue: exServiceStub },
                { provide: HTMLCanvasElement, useValue: htmlElementStub },
                { provide: HTMLElement, useValue: htmlElementStub },
            ],
        });
        fixture = TestBed.createComponent(TestCanvasSwitchComponent);
        component = fixture.componentInstance;

        dir = new CanvasSwitchDirective(elemStub, exServiceStub, itService, rdStub);
        const TEST_WIDTH = 200;
        const TEST_HEIGHT = 100;
        dir.width = TEST_WIDTH;
        dir.height = TEST_HEIGHT;
        dir.canvas = htmlElementStub;
    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
        const directive = new CanvasSwitchDirective(elemStub, exServiceStub, itService, rdStub);
        expect(directive).toBeTruthy();
        expect(dir).toBeTruthy();
    });

    it('should set the image to convert in subscription execution', () => {
        dir.ngAfterViewInit();
        itService.emitSvgCanvasConversion(true);
        // tslint:disable-next-line: no-string-literal
        expect(dir['imageToConvert']).toEqual(dir['element'].nativeElement);
    });

    it('should call the svg to html canvas exportation method on positive conversion boolean', () => {
        jasmine.clock().install(); // the spied function is in a timer

        // tslint:disable-next-line: no-string-literal
        const spy = spyOn(dir['exService'], 'exportInCanvas');
        dir.ngAfterViewInit();
        itService.emitSvgCanvasConversion(true);
        const TIME = 50; // arbitrary 'large' amount of ms
        jasmine.clock().tick(TIME);
        expect(spy).toHaveBeenCalled(); // called in subscription and on AfterViewInit
        jasmine.clock().uninstall();
    });

    it('should not call the svg to html canvas exportation method on negative conversion boolean', () => {
        jasmine.clock().install(); // the spied function is in a timer

        // tslint:disable-next-line: no-string-literal
        const spy = spyOn(dir['exService'], 'exportInCanvas');
        dir.ngAfterViewInit();
        itService.emitSvgCanvasConversion(false);
        const TIME = 50;
        jasmine.clock().tick(TIME);
        expect(spy).not.toHaveBeenCalled(); // called on AfterViewInit only
        jasmine.clock().uninstall();
    });
});
