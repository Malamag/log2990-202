import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PencilService } from 'src/app/services/draw-tool/pencil.service';
import { RectangleService } from 'src/app/services/draw-tool/rectangle.service';
import { SvgDrawComponent } from './svg-draw.component';

import { Renderer2, CUSTOM_ELEMENTS_SCHEMA, RendererFactory2 } from '@angular/core';
import { Subject } from 'rxjs';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';
import { CanvasBuilderService } from 'src/app/services/drawing/canvas-builder.service';
import { KeyboardHandlerService } from 'src/app/services/keyboard-handler/keyboard-handler.service';
import { MouseHandlerService } from 'src/app/services/mouse-handler/mouse-handler.service';
import { Canvas } from '../../../models/Canvas.model';

const width = 67;
const height = 10;
const color = 'white';

describe('SvgDrawComponent', () => {
    let component: SvgDrawComponent;
    let fixture: ComponentFixture<SvgDrawComponent>;
    let mouseHandlerStub: any;
    let kbHandlerStub: any;
    let dFetchService: any;
    let rendererStub: any;
    let rdFactStub: any;

    beforeEach(async(() => {
        mouseHandlerStub = {
            move: () => 0,
            down: () => 0,
            up: () => 0,
        };

        kbHandlerStub = {
            reset: (e: KeyboardEvent) => e,
            logKey: (e: KeyboardEvent) => e,
        };

        dFetchService = {
            ask: new Subject<boolean>(),
        };

        rendererStub = {};
        rdFactStub = {};

        TestBed.configureTestingModule({
            declarations: [SvgDrawComponent],
            providers: [
                { provide: KeyboardHandlerService, useValue: kbHandlerStub },
                { provide: MouseHandlerService, useValue: mouseHandlerStub },
                { provide: DoodleFetchService, useValue: dFetchService },
                { provide: Renderer2, useValue: rendererStub },
                { provide: RendererFactory2, useValue: rdFactStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(async(async () => {
        fixture = TestBed.createComponent(SvgDrawComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should deselect all tools', () => {
        const name1 = 'Pencil';
        const name2 = 'rect';

        const pencil = new PencilService(component.workingSpace, component.workingSpace, true, component.interaction, component.colorPick);
        const rect = new RectangleService(component.workingSpace, component.workingSpace, true, component.interaction, component.colorPick);
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
        const canvasBuilderStub = new CanvasBuilderService();
        const canvas = new Canvas(width, height, color);
        canvasBuilderStub.newCanvas = canvas;

        const componentStub = new SvgDrawComponent(
            canvasBuilderStub,
            component.interaction,
            component.colorPick,
            dFetchService,
            rendererStub,
            rdFactStub,
        );
        componentStub.initCanvas();
        expect(componentStub.width).toBe(canvas.canvasWidth);
        expect(componentStub.height).toBe(canvas.canvasHeight);
        expect(componentStub.backColor).toBe(canvas.canvasColor);
    });

    it('should call initCanvas and the observable', () => {
        const spyObj = spyOn(component, 'initCanvas');
        const spyInteraction = spyOn(component.interaction.$refObs, 'subscribe');
        component.ngOnInit();
        expect(spyObj).toHaveBeenCalled();
        expect(spyInteraction).toHaveBeenCalled();
    });

    it('should call window addEventListener', () => {
        const spyWindow = spyOn(window, 'addEventListener');
        component.ngAfterViewInit();
        expect(spyWindow).toHaveBeenCalledTimes(6);
    });

    /*it('should call the mousehandler listeners on mouse action', ()=>{

    component.ngAfterViewInit(); // prepares the event listeners
    const spyDown = spyOn(mouseHandlerStub, "down");
    window.dispatchEvent(new MouseEvent("mousedown"));
    expect(spyDown).toHaveBeenCalled();

    const spyMove = spyOn(mouseHandlerStub, "move");
    window.dispatchEvent(new MouseEvent("mousemove")); // sending the events
    expect(spyMove).toHaveBeenCalled(); // we want to see if the functions get called after the event

    const spyUp = spyOn(mouseHandlerStub, "up");
    window.dispatchEvent(new MouseEvent("mouseup"));
    expect(spyUp).toHaveBeenCalled();
  });

  it('should call the kb handler listerners on kb action', ()=>{
    component.ngAfterViewInit(); // same principle goes for the keyboard events
    const spyKey = spyOn(kbHandlerStub, "logKey");
    window.dispatchEvent(new KeyboardEvent("keydown"));
    expect(spyKey).toHaveBeenCalled();

    const spyRes = spyOn(kbHandlerStub, "reset");
    window.dispatchEvent(new KeyboardEvent("keyup"));
    expect(spyRes).toHaveBeenCalled();

  });*/

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
