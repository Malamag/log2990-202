import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { CanvasSwitchDirective } from './canvas-switch.directive';

@Component({
    template: `<canvas #testRef></canvas><svg appCanvasSwitch [appCanvasRef]="testRef"><rect width="25" height="50" fill="blue"></svg>`,
})
class TestCanvasSwitchComponent {}

fdescribe('CanvasSwitchDirective', () => {
    let component: TestCanvasSwitchComponent;
    let fixture: ComponentFixture<TestCanvasSwitchComponent>;
    let elemStub: any;
    let exServiceStub: any;
    let itServiceStub: any;
    beforeEach(() => {
        elemStub = {};
        exServiceStub = {};
        itServiceStub = {};
        TestBed.configureTestingModule({
            declarations: [CanvasSwitchDirective, TestCanvasSwitchComponent],
            providers: [],
        });
        fixture = TestBed.createComponent(TestCanvasSwitchComponent);
        component = fixture.componentInstance;
    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
        const directive = new CanvasSwitchDirective(elemStub, exServiceStub, itServiceStub);
        expect(directive).toBeTruthy();
    });
});
