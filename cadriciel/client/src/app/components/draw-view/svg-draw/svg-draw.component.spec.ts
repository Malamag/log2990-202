import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PencilService } from 'src/app/services/draw-tool/pencil.service';
import { RectangleService } from 'src/app/services/draw-tool/rectangle.service';
import { SvgDrawComponent } from './svg-draw.component';

import { CUSTOM_ELEMENTS_SCHEMA, Renderer2 } from '@angular/core';
import { CanvasSwitchDirective } from 'src/app/directives/canvas-switch.directive';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';
import { CanvasBuilderService } from 'src/app/services/drawing/canvas-builder.service';
import { GridRenderService } from 'src/app/services/grid/grid-render.service';
import { KeyboardHandlerService } from 'src/app/services/keyboard-handler/keyboard-handler.service';
import { MouseHandlerService } from 'src/app/services/mouse-handler/mouse-handler.service';

const width = 67;
const height = 10;
const color = 'white';

describe('SvgDrawComponent', () => {
    let component: SvgDrawComponent;
    let fixture: ComponentFixture<SvgDrawComponent>;
    // tslint:disable-next-line: no-any
    let mouseHandlerStub: any;
    // tslint:disable-next-line: no-any
    let kbHandlerStub: any;

    // tslint:disable-next-line: no-any
    let rendererStub: any;
    // tslint:disable-next-line: no-any
    let gridServiceStub: any;
    let dFetch: DoodleFetchService;

    beforeEach(async(() => {
        rendererStub = {};
        mouseHandlerStub = {
            move: () => 0,
            down: () => 0,
            up: () => 0,
        };

        kbHandlerStub = {
            reset: () => 0,
            logkey: () => 0,
        };

        gridServiceStub = {
            initGrid: () => 0,
        };

        TestBed.configureTestingModule({
            declarations: [SvgDrawComponent, CanvasSwitchDirective],
            providers: [
                { provide: KeyboardHandlerService, useValue: kbHandlerStub },
                { provide: MouseHandlerService, useValue: mouseHandlerStub },

                { provide: Renderer2, useValue: rendererStub },
                { provide: GridRenderService, useValue: gridServiceStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(async () => {
        fixture = TestBed.createComponent(SvgDrawComponent);
        component = fixture.componentInstance;
        component.canvas = { canvasWidth: 100, canvasHeight: 100, canvasColor: '#ffffffff' };
        await fixture.whenStable();
        fixture.detectChanges();
        dFetch = new DoodleFetchService(gridServiceStub);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should deselect all tools', () => {
        const name1 = 'Pencil';
        const name2 = 'rect';
        const htmlElement = fixture.debugElement.nativeElement;
        const pencil = new PencilService(htmlElement, htmlElement, true, component.interaction, component.colorPick);
        const rect = new RectangleService(htmlElement, htmlElement, true, component.interaction, component.colorPick);
        const mapTest = new Map();
        mapTest.set(name1, pencil);
        mapTest.set(name2, rect);
        component.closeTools(mapTest);
        expect(mapTest.get(name1).selected).toBeFalsy();
        expect(mapTest.get(name2).selected).toBeFalsy();
    });

    it('the containers length should be greater than zero', () => {
        component.ngAfterViewInit();
        expect(component.toolsContainer.size).toBeGreaterThan(0);
    });

    it('a dispatch should be sent', () => {
        const spyObj = spyOn(window, 'dispatchEvent');
        component.ngAfterViewInit();
        expect(spyObj).toHaveBeenCalled();
    });

    it('should have the same parameters as the observer', () => {
        const canvasBuilderStub = new CanvasBuilderService(component.interaction);
        const canvas = { canvasWidth: width, canvasHeight: height, canvasColor: color };
        canvasBuilderStub.newCanvas = canvas;

        const componentStub = new SvgDrawComponent(
            canvasBuilderStub,
            component.interaction,
            component.colorPick,
            dFetch,
            rendererStub,
            gridServiceStub,
        );
        componentStub.initCanvas();
        expect(componentStub.width).toBe(canvas.canvasWidth);
        expect(componentStub.height).toBe(canvas.canvasHeight);
        expect(componentStub.backColor).toBe(canvas.canvasColor);
    });

    it('should call initCanvas and the observable', () => {
        const spyObj = spyOn(component, 'initCanvas');

        component.ngOnInit();
        expect(spyObj).toHaveBeenCalled();
    });

    it('should call window addEventListener', () => {
        const TOTAL_LISTENERS = 13;
        window.addEventListener = jasmine.createSpy().and.returnValue(0);
        component.ngAfterViewInit();
        expect(window.addEventListener).toHaveBeenCalledTimes(TOTAL_LISTENERS);
    });

    it('should call the mouse down listener on mouse down', () => {
        const spyDown = spyOn(mouseHandlerStub, 'down');
        window.addEventListener = jasmine.createSpy().and.callFake(() => {
            mouseHandlerStub.down();
        });
        component.ngAfterViewInit(); // prepares the event listeners
        expect(spyDown).toHaveBeenCalled();
    });

    it('should call the mouse move listener on mouse move', () => {
        const spyDown = spyOn(mouseHandlerStub, 'move');
        window.addEventListener = jasmine.createSpy().and.callFake(() => {
            mouseHandlerStub.move();
        });
        component.ngAfterViewInit(); // prepares the event listeners
        expect(spyDown).toHaveBeenCalled();
    });

    it('should call the mouse up listener on mouse up', () => {
        const spyDown = spyOn(mouseHandlerStub, 'up');
        window.addEventListener = jasmine.createSpy().and.callFake(() => {
            mouseHandlerStub.up();
        });
        component.ngAfterViewInit(); // prepares the event listeners
        expect(spyDown).toHaveBeenCalled();
    });

    it('should call the kb handler logkey listener', () => {
        const spyKey = spyOn(kbHandlerStub, 'logkey');
        window.addEventListener = jasmine.createSpy().and.callFake(() => {
            kbHandlerStub.logkey();
        });
        component.ngAfterViewInit(); // same principle goes for the keyboard events

        expect(spyKey).toHaveBeenCalled();
    });
    it('should call the kb handler logkey listener', () => {
        const spyKey = spyOn(kbHandlerStub, 'reset');
        window.addEventListener = jasmine.createSpy().and.callFake(() => {
            kbHandlerStub.reset();
        });
        component.ngAfterViewInit(); // same principle goes for the keyboard events

        expect(spyKey).toHaveBeenCalled();
    });

    it('should affect the variables on subscription', () => {
        const spy = spyOn(component, 'closeTools');
        component.ngAfterViewInit(); // init all
        component.interaction.emitCancel(true); // we want to cancel the tool selection
        expect(spy).toHaveBeenCalled();

        const TOOL = 'Rectangle'; // arbitrary tool selection
        component.interaction.emitSelectedTool(TOOL);
        expect(component.toolsContainer.get(TOOL).selected).toBeTruthy();
    });
});
