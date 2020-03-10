import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ExportService } from '../services/exportation/export.service';
import { InteractionService } from '../services/service-interaction/interaction.service';
import { CanvasSwitchDirective } from './canvas-switch.directive';

@Component({
    // building a fake component for test purposes
    template: `
        <canvas #testRef></canvas>
        <svg appCanvasSwitch [appCanvasRef]="testRef">
            <rect width="25" height="50" fill="blue" />
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
    let elemStub: any;
    let exServiceStub: any;
    let htmlElementStub: any;

    let itService: InteractionService;
    let dir: CanvasSwitchDirective;
    beforeEach(() => {
        htmlElementStub = {
            style: {
                display: 'none',
            },
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

        dir = new CanvasSwitchDirective(elemStub, exServiceStub, itService);
        dir.canvas = fixture.debugElement.query(By.css('canvas')).nativeElement;
    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
        const directive = new CanvasSwitchDirective(elemStub, exServiceStub, itService);
        expect(directive).toBeTruthy();
        expect(dir).toBeTruthy();
    });

    it('should export in canvas at first initialisation', () => {
        dir.canvas = htmlElementStub;
        const spy = spyOn(dir.exService, 'exportInCanvas');
        dir.ngAfterViewInit();
        expect(spy).toHaveBeenCalled();
    });

    it('should set the image to convert in subscription execution', () => {
        dir.ngAfterViewInit();
        itService.emitSvgCanvasConversion(true);
        expect(dir.imageToConvert).toEqual(dir.element.nativeElement);
    });

    it('should call the svg to html canvas exportation method on positive conversion boolean', () => {
        jasmine.clock().install(); // the spied function is in a timer
        const CALL_NUM = 2;
        const spy = spyOn(dir.exService, 'exportInCanvas');
        dir.ngAfterViewInit();
        itService.emitSvgCanvasConversion(true);
        const TIME = 50; // arbitrary 'large' amount of ms
        jasmine.clock().tick(TIME);
        expect(spy).toHaveBeenCalledTimes(CALL_NUM); // called in subscription and on AfterViewInit
        jasmine.clock().uninstall();
    });

    it('should not call the svg to html canvas exportation method on negative conversion boolean', () => {
        jasmine.clock().install(); // the spied function is in a timer
        const CALL_NUM = 1;
        const spy = spyOn(dir.exService, 'exportInCanvas');
        dir.ngAfterViewInit();
        itService.emitSvgCanvasConversion(false);
        const TIME = 50;
        jasmine.clock().tick(TIME);
        expect(spy).toHaveBeenCalledTimes(CALL_NUM); // called on AfterViewInit only
        jasmine.clock().uninstall();
    });

    it('should call the canvas - svg display toggle on subscription activation', () => {
        const spy = spyOn(dir, 'toggleSvgCanvas');
        dir.ngAfterViewInit();
        itService.emitSvgCanvasConversion(true);
        expect(spy).toHaveBeenCalled();
    });

    it('should set the showCanvas attribute to the proper subscription value', () => {
        dir.showCanvas = false;
        dir.ngAfterViewInit();
        itService.emitSvgCanvasConversion(true);
        expect(dir.showCanvas).toBe(true);
    });

    it('should show the canvas and hide the svg on true showCanvas boolean', () => {
        dir.showCanvas = true;
        const NO_DISPLAY = 'none';
        const DISPLAY = 'block';
        dir.toggleSvgCanvas();
        expect(dir.canvas.style.display).toEqual(DISPLAY);
        expect(dir.imageToConvert.style.display).toEqual(NO_DISPLAY);
    });

    it('should not show the canvas and hide the svg on false showCanvas boolean', () => {
        dir.showCanvas = false;
        const NO_DISPLAY = 'none';
        const DISPLAY = 'block';
        dir.toggleSvgCanvas();
        expect(dir.canvas.style.display).toEqual(NO_DISPLAY);
        expect(dir.imageToConvert.style.display).toEqual(DISPLAY);
    });
});
