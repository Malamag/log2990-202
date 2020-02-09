import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorPickerComponent } from './color-picker.component';
/*import { Component, OnInit } from '@angular/core';
import { ColorPickingService } from '../../services/colorPicker/color-picking.service';
import { colorData } from './color-data';
import { ChoosenColors } from 'src/app/models/ChoosenColors.model';
import { Subscription } from 'rxjs';*/

describe('ColorPickerComponent',()=>{
    let component: ColorPickerComponent;
    let fixture: ComponentFixture<ColorPickerComponent>
    beforeEach(async(()=>{
        TestBed.configureTestingModule({})
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance
        fixture.detectChanges();
    });

    it('should create', ()=>{
        expect(component).toBeTruthy()
    }) 
})