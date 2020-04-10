import { Injectable, Renderer2 } from '@angular/core';
import { SelectionService } from './selection.service';
import { InteractionTool } from '../interaction-tool/interaction-tool';
import { InteractionService } from '../service-interaction/interaction.service';
import { CanvasInteraction } from './canvas-interaction.service';
import { Point } from './point';
@Injectable({
  providedIn: 'root'
})
export class ClipboardService extends InteractionTool {

  offset_x: number = 0;
  offset_y: number = 0;
  currentSelection: SelectionService;
  clipboardContent: Element[] = [];
  constructor(selection: SelectionService, interact: InteractionService, drawing: HTMLElement, render: Renderer2) {
    super(interact, drawing, render);
    this.currentSelection = selection;
  }

  // Fill the clipboard with the selected elements.
  copy(): void {
    this.offset_x = 0;
    this.offset_y = 0;
    this.clipboardContent = [];
    for (let i = this.currentSelection.drawing.children.length - 1; i >= 0; --i) {
      if (this.currentSelection.selectedItems[i] === true) {
        this.clipboardContent.push(this.currentSelection.drawing.children[i]);
      }
    }
  }

  // Paste the element in the clipboard on the canvas.
  paste(): void {
    this.offset_x += 10;
    this.offset_y += 10;
    let rect = this.currentSelection.selectedRef.getBoundingClientRect();
    const CANVAS_BOX = this.currentSelection.canvas.getBoundingClientRect();
    if (!Point.rectOverlap(new Point(rect.left, rect.top), new Point(rect.left + rect.width, rect.top + rect.height), new Point(CANVAS_BOX.left - 25, CANVAS_BOX.top - 25), new Point(CANVAS_BOX.right - 25, CANVAS_BOX.bottom - 25))) {
      this.offset_x = 10;
      this.offset_y = 10;
    }
    for (let i = 0; i < this.currentSelection.selectedItems.length; i++)
      this.currentSelection.selectedItems[i] = (false);

    for (let i = this.clipboardContent.length - 1; i >= 0; --i) {
      let clone = this.clipboardContent[i].cloneNode(true);
      this.render.setAttribute(clone, 'isListening', 'false');
      this.currentSelection.drawing.appendChild(clone);
      this.currentSelection.selectedItems.push(true);
      const EVENT = new Event('newDrawing');
      window.dispatchEvent(EVENT);
    }
    this.currentSelection.selectedRef.innerHTML = CanvasInteraction.createBoundingBox(this.currentSelection);
    CanvasInteraction.moveElements(this.offset_x, this.offset_y, this.currentSelection);
    this.currentSelection.interaction.emitDrawingDone();
  }

  // Remove the selected elements from the canvas and place them in the clipboard
  cut(): void {
    this.clipboardContent = [];
    for (let i = this.currentSelection.drawing.children.length - 1; i >= 0; --i) {
      console.log(this.currentSelection.selectedItems[i]);
      if (this.currentSelection.selectedItems[i] === true) {
        this.clipboardContent.push(this.currentSelection.drawing.children[i]);
        this.currentSelection.drawing.children[i].remove();
        this.currentSelection.selectedItems.splice(i);
      }
    }
    this.offset_x = -10;
    this.offset_y = -10;
    this.currentSelection.selectedRef.innerHTML = CanvasInteraction.createBoundingBox(this.currentSelection);
    this.currentSelection.interaction.emitDrawingDone();
  }

  // Duplicate the selected elements on the canvas without placing it in the clipboard.
  duplicate(): void {
    this.offset_x = 10;
    this.offset_y = 10;

    let size = this.currentSelection.drawing.children.length;
    for (let i = 0; i < size; i++) {
      if (this.currentSelection.selectedItems[i] === true) {
        let clone = this.currentSelection.drawing.children[i].cloneNode(true);
        this.render.setAttribute(clone, 'isListening', 'false');
        this.render.setAttribute(clone, 'test', 'yo');
        this.currentSelection.drawing.appendChild(clone);
        this.currentSelection.selectedItems[i] = false;
        this.currentSelection.selectedItems.push(true);
        const EVENT = new Event('newDrawing');
        window.dispatchEvent(EVENT);
      }
    }
    this.currentSelection.selectedRef.innerHTML = CanvasInteraction.createBoundingBox(this.currentSelection);
    CanvasInteraction.moveElements(this.offset_x, this.offset_y, this.currentSelection);
    this.currentSelection.interaction.emitDrawingDone();
  }
  // Delete entirely an element from the canvas.
  delete(): void {
    for (let i = this.currentSelection.drawing.children.length - 1; i >= 0; --i) {
      if (this.currentSelection.selectedItems[i] === true) {
        this.currentSelection.drawing.children[i].remove();
        const EVENT = new Event('newDrawing');
        window.dispatchEvent(EVENT);
      }
    }
    this.currentSelection.selectedRef.innerHTML = CanvasInteraction.createBoundingBox(this.currentSelection);
    this.currentSelection.interaction.emitDrawingDone();
  }
  // Apply different methods depending on tool selected.
  apply(name: string): void {
    switch (name) {
      case 'Copier':
        this.copy();
        break;
      case 'Coller':
        this.paste();
        break;
      case 'Couper':
        this.cut();
        break;
      case 'Dupliquer':
        this.duplicate();
        break;
      case 'Supprimer':
        this.delete();
        break;
    }
  }



}
