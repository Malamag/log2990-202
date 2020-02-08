import { TestBed } from '@angular/core/testing';

import { InteractionService } from './interaction.service';
import { LineAttributes } from '../attributes/line-attributes';
import { ToolsAttributes } from '../attributes/tools-attribute';
import { FormsAttribute } from '../attributes/attribute-form';
import { ElementRef } from '@angular/core';
import { Observable } from 'rxjs';

describe('InteractionService', () => {
  let service: InteractionService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      
    });
    service = TestBed.get(InteractionService);
  
  });

  it('should be created', () => {
    const service: InteractionService = TestBed.get(InteractionService);
    expect(service).toBeTruthy();
  });

  it('should emit the line attributes', () => {
    const spy = spyOn(service.lineAttributes, 'next');
    const ATTR: LineAttributes = new LineAttributes(false, 0, 0); //junction presence, thickness & junction diam.
    service.emitLineAttributes(ATTR);
    expect(spy).toHaveBeenCalled();
  });

  it('should emit the tool attributes', () => {
    const spy = spyOn(service.toolsAttributes, 'next');
    const ATTR: ToolsAttributes = new ToolsAttributes(0, 0); //thickness & texture number
    service.emitToolsAttributes(ATTR);
    expect(spy).toHaveBeenCalled();
  });

  it('should emit the selected tool', () => {
    const spy = spyOn(service.selectedTool, 'next');
    const ATTR: string = ""; //tool name
    service.emitSelectedTool(ATTR);
    expect(spy).toHaveBeenCalled();
  });

  it('should emit the forms attributes', () => {
    const spy = spyOn(service.formsAttributes, 'next');
    const ATTR: FormsAttribute = new FormsAttribute(0, 0, 0); //plot type, border thickness, num. of corners
    service.emitFormsAttributes(ATTR);
    expect(spy).toHaveBeenCalled();
  });

  it('should emit a kill signal for the tools', () => {
    const spy = spyOn(service.cancelTools, 'next');
    const willCancel = true;
    service.emitCancel(willCancel);
    expect(spy).toHaveBeenCalled();
  });

  it('should emit a DOM element reference', () => {
    const spy = spyOn(service.ref, 'next');
    const elRef = new ElementRef<any>(null);
    service.emitRef(elRef);
    expect(spy).toHaveBeenCalled();
  });

  it('selectedTool should have its own observable', () => {
    expect(service.$selectedTool).toEqual(jasmine.any(Observable));
  });

  it('formsAttributes should have its own observable', () => {
    expect(service.$formsAttributes).toEqual(jasmine.any(Observable));
  });

  it('toolsAttributes should have its own observable', () => {
    expect(service.$toolsAttributes).toEqual(jasmine.any(Observable));
  });

  it('lineAttributes should have its own observable', () => {
    expect(service.$lineAttributes).toEqual(jasmine.any(Observable));
  });

  it('cancelTools should have its own observable', () => {
    expect(service.$cancelToolsObs).toEqual(jasmine.any(Observable));
  });

  it('DOM element reference should have its own observable', () => {
    expect(service.$refObs).toEqual(jasmine.any(Observable));
  });


});
