import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SvgDrawComponent } from './svg-draw.component';
import { CUSTOM_ELEMENTS_SCHEMA, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { DoodleFetchService } from 'src/app/services/doodle-fetch/doodle-fetch.service';
import { KeyboardHandlerService } from 'src/app/services/keyboard-handler/keyboard-handler.service';
import { MouseHandlerService } from 'src/app/services/mouse-handler/mouse-handler.service';
//import { CanvasBuilderService } from 'src/app/services/drawing/canvas-builder.service';

//const width: number = 67;
//const height: number = 10;
//const color: string = '#ffffff';

describe('SvgDrawComponent', () => {
    let component: SvgDrawComponent;
    let fixture: ComponentFixture<SvgDrawComponent>;
    let mouseHandlerStub: any;
    let kbHandlerStub: any;
    let dFetchService: any;
    let rendererStub: any;
    beforeEach(async(() => {
        mouseHandlerStub = {
            move: (e: MouseEvent) => 0,
            down: (e: MouseEvent) => 0,
            up: (e: MouseEvent) => 0,
        };
        kbHandlerStub = {
            reset: (e: KeyboardEvent) => e,
            logKey: (e: KeyboardEvent) => e,
        };
        dFetchService = {
            ask: new Subject<boolean>(),
        };
        rendererStub = {};
        TestBed.configureTestingModule({
            declarations: [SvgDrawComponent],
            providers: [
                { provide: KeyboardHandlerService, useValue: kbHandlerStub },
                { provide: MouseHandlerService, useValue: mouseHandlerStub },
                { provide: DoodleFetchService, useValue: dFetchService },
                { provide: Renderer2, useValue: rendererStub },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    }));
    beforeEach(async () => {
        fixture = TestBed.createComponent(SvgDrawComponent);
        component = fixture.componentInstance;

        await fixture.whenStable();
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    /* it('should deselect all tools', () => {
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
    });*/

    /* it('the containers length should be greater than zero', () => {
        component.ngAfterViewInit();
        expect(component.toolsContainer.size).toBeGreaterThan(0);
    });
    it('a dispatch should be sent', () => {
        const spyObj = spyOn(window, 'dispatchEvent');
        component.ngOnInit();
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
            component['doodleFetch'],
            rendererStub,
            component['gridService'],
        );
        componentStub.initCanvas();
        expect(componentStub.width).toBe(canvas.canvasWidth);
        expect(componentStub.height).toBe(canvas.canvasHeight);
        expect(componentStub.backColor).toBe(canvas.canvasColor);
    });*/

    /*TEST PASSING
    it('should call initCanvas and the observable', () => {
        const spyObj = spyOn(component, 'initCanvas');
        const spyInteraction = spyOn(component.interaction.$refObs, 'subscribe');
        component.ngOnInit();
        expect(spyObj).toHaveBeenCalled();
        expect(spyInteraction).toHaveBeenCalled();
    });*/

    /* TEST PASSING
    it('should call window addEventListener', () => {
        const LISTENER_NUM: number = 7;
        const spyWindow = spyOn(window, 'addEventListener');
        component.ngAfterViewInit();
        expect(spyWindow).toHaveBeenCalledTimes(LISTENER_NUM);
    });*/

    /*PROBLEMATIC - Events seem to not be fired or stubs are inactive
    it('should call the mousehandler listeners on mouse action', ()=>{

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

  PROBLEMATIC - Events seem to not be fired or stubs are inactive
    it('should call the kb handler listerners on kb action', () => {
        component.ngAfterViewInit(); // same principle goes for the keyboard events
        const spyKey = spyOn(kbHandlerStub, 'logKey');
        window.dispatchEvent(new KeyboardEvent('keydown'));
        expect(spyKey).toHaveBeenCalled();
        const spyRes = spyOn(kbHandlerStub, 'reset');
        window.dispatchEvent(new KeyboardEvent('keyup'));
        expect(spyRes).toHaveBeenCalled();
    });*/

    /*PROBLEMATIC - Need to call ngOnInit THEN ngAfterViewInit
    it('should affect the variables on subscription', () => {
        const spy = spyOn(component, 'closeTools');
        component.ngOnInit();
        component.ngAfterViewInit(); // init all
        component.interaction.emitCancel(true); // we want to cancel the tool selection
        expect(spy).toHaveBeenCalled();
        const TOOL = 'Rectangle'; // arbitrary tool selection
        component.interaction.emitSelectedTool(TOOL);
        expect(component.toolsContainer.get(TOOL).selected).toBeTruthy();
    });*/
});
