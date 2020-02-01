import {InputObserver } from './input-observer';
import { Point } from './point';
import { Renderer2, ElementRef } from '@angular/core';

export abstract class DrawingTool extends InputObserver{
  renderer:Renderer2
  inProgressElement:ElementRef
  doneRef: ElementRef
  svg:HTMLElement | null;
  workingSpace:HTMLElement | null;
  svgBox:ClientRect;
  startedInsideWorkSpace:boolean;
  isDown:boolean;
  clickedInside:boolean;
  currentPath:Point[];
  selected:boolean;
  width:number;
  primary_color:string;

  abstract down(position:Point, insideWorkspace?:boolean):void;
  abstract up(position:Point):void;
  abstract move(position:Point):void;
  abstract doubleClick(position:Point, insideWorkspace?:boolean):void;
  abstract createPath(path:Point[], doubleClickCheck?:boolean):void;

  constructor(svg:HTMLElement | null, workingSpace:HTMLElement | null,selected:boolean, width:number, primary_color:string, renderer: Renderer2, 
    inProgressRef:ElementRef, doneRef:ElementRef){
    
    super();
    this.renderer= renderer;
    this.inProgressElement = inProgressRef;
    this.doneRef = doneRef;
    this.svg = svg;
    this.workingSpace = workingSpace
    if(svg != null){
      this.svgBox = svg.getBoundingClientRect();
    }
    this.startedInsideWorkSpace = false;
    this.isDown = false;
    this.clickedInside = false;
    this.selected = selected;
    this.width = width;
    this.primary_color = primary_color;

    this.currentPath = [];
  }

  }