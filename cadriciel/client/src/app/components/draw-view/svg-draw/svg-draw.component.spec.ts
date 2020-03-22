import { CUSTOM_ELEMENTS_SCHEMA, Renderer2 } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CanvasSwitchDirective } from 'src/app/directives/canvas-switch.directive';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';
import { PencilService } from 'src/app/services/draw-tool/pencil.service';
import { RectangleService } from 'src/app/services/draw-tool/rectangle.service';
import { GridRenderService } from 'src/app/services/grid/grid-render.service';
import { KeyboardHandlerService } from 'src/app/services/keyboard-handler/keyboard-handler.service';
import { MouseHandlerService } from 'src/app/services/mouse-handler/mouse-handler.service';
import { CanvasBuilderService } from 'src/app/services/new-doodle/canvas-builder.service';
import { SvgDrawComponent } from './svg-draw.component';

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
        const NAME1 = 'Pencil';
        const NAME2 = 'rect';
        const HTML_ELEMENT = fixture.debugElement.nativeElement;
        const pencil = new PencilService(HTML_ELEMENT, HTML_ELEMENT, true, component.interaction, component.colorPick);
        const rect = new RectangleService(HTML_ELEMENT, HTML_ELEMENT, true, component.interaction, component.colorPick);
        const mapTest = new Map();
        mapTest.set(NAME1, pencil);
        mapTest.set(NAME2, rect);
        component.closeTools(mapTest);
        expect(mapTest.get(NAME1).selected).toBeFalsy();
        expect(mapTest.get(NAME2).selected).toBeFalsy();
    });

    it('the containers length should be greater than zero', () => {
        component.ngAfterViewInit();
        expect(component.toolsContainer.size).toBeGreaterThan(0);
    });

    it('a dispatch should be sent', () => {
        const SPY_OBJ = spyOn(window, 'dispatchEvent');
        component.ngAfterViewInit();
        expect(SPY_OBJ).toHaveBeenCalled();
    });

    it('should have the same parameters as the observer', () => {
        const CANVAS_BUILDER_STUB = new CanvasBuilderService(component.interaction);
        const CANVAS = { canvasWidth: width, canvasHeight: height, canvasColor: color };
        CANVAS_BUILDER_STUB.newCanvas = CANVAS;

        const componentStub = new SvgDrawComponent(
            CANVAS_BUILDER_STUB,
            component.interaction,
            component.colorPick,
            dFetch,
            rendererStub,
            gridServiceStub,
        );
        componentStub.initCanvas();
        expect(componentStub.width).toBe(CANVAS.canvasWidth);
        expect(componentStub.height).toBe(CANVAS.canvasHeight);
        expect(componentStub.backColor).toBe(CANVAS.canvasColor);
    });

    it('should call initCanvas and the observable', () => {
        const SPY_OBJ = spyOn(component, 'initCanvas');

        component.ngOnInit();
        expect(SPY_OBJ).toHaveBeenCalled();
    });

    it('should call window addEventListener', () => {
        const TOTAL_LISTENERS = 13;
        window.addEventListener = jasmine.createSpy().and.returnValue(0);
        component.ngAfterViewInit();
        expect(window.addEventListener).toHaveBeenCalledTimes(TOTAL_LISTENERS);
    });

    it('should call the mouse down listener on mouse down', () => {
        const SPY_DOWN = spyOn(mouseHandlerStub, 'down');
        window.addEventListener = jasmine.createSpy().and.callFake(() => {
            mouseHandlerStub.down();
        });
        component.ngAfterViewInit(); // prepares the event listeners
        expect(SPY_DOWN).toHaveBeenCalled();
    });

    it('should call the mouse move listener on mouse move', () => {
        const SPY_DOWN = spyOn(mouseHandlerStub, 'move');
        window.addEventListener = jasmine.createSpy().and.callFake(() => {
            mouseHandlerStub.move();
        });
        component.ngAfterViewInit(); // prepares the event listeners
        expect(SPY_DOWN).toHaveBeenCalled();
    });

    it('should call the mouse up listener on mouse up', () => {
        const SPY_DOWN = spyOn(mouseHandlerStub, 'up');
        window.addEventListener = jasmine.createSpy().and.callFake(() => {
            mouseHandlerStub.up();
        });
        component.ngAfterViewInit(); // prepares the event listeners
        expect(SPY_DOWN).toHaveBeenCalled();
    });

    it('should call the kb handler logkey listener', () => {
        const SPY_KEY = spyOn(kbHandlerStub, 'logkey');
        window.addEventListener = jasmine.createSpy().and.callFake(() => {
            kbHandlerStub.logkey();
        });
        component.ngAfterViewInit(); // same principle goes for the keyboard events

        expect(SPY_KEY).toHaveBeenCalled();
    });
    it('should call the kb handler logkey listener', () => {
        const SPY_KEY = spyOn(kbHandlerStub, 'reset');
        window.addEventListener = jasmine.createSpy().and.callFake(() => {
            kbHandlerStub.reset();
        });
        component.ngAfterViewInit(); // same principle goes for the keyboard events

        expect(SPY_KEY).toHaveBeenCalled();
    });

    it('should affect the variables on subscription', () => {
        const SPY = spyOn(component, 'closeTools');
        component.ngAfterViewInit(); // init all
        component.interaction.emitCancel(true); // we want to cancel the tool selection
        expect(SPY).toHaveBeenCalled();

        const TOOL = 'Rectangle'; // arbitrary tool selection
        component.interaction.emitSelectedTool(TOOL);
        expect(component.toolsContainer.get(TOOL).selected).toBeTruthy();
    });
});
