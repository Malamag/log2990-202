import { Injectable, Renderer2 } from '@angular/core';
import { InteractionTool } from '../interaction-tool/interaction-tool';
import { InteractionService } from '../service-interaction/interaction.service';
import { CanvasInteraction } from './canvas-interaction.service';
import { Point } from './point';
import { SelectionService } from './selection.service';

const OFFSET = 20;
const OUTSIDE_CANVAS_ADJUSTMENT_DUP = 50;
const OUTSIDE_CANVAS_ADJUSTMENT_PASTE = 50;
@Injectable({
  providedIn: 'root'
})
export class ClipboardService extends InteractionTool {
  dupOffsetY: number;
  dupOffsetX: number;
  pasteOffsetY: number;
  pasteOffsetX: number;
  currentSelection: SelectionService;
  clipboardContent: Element[] = [];
  constructor(selection: SelectionService, interact: InteractionService, drawing: HTMLElement, render: Renderer2) {
    super(interact, drawing, render);
    this.currentSelection = selection;
    this.dupOffsetX = 0;
    this.dupOffsetY = 0;
    this.pasteOffsetX = 0;
    this.pasteOffsetY = 0;
  }
  // Fill the clipboard with the selected elements.
  copy(): void {
    this.pasteOffsetX = 0;
    this.pasteOffsetY = 0;
    this.clipboardContent = [];
    for (let i = this.currentSelection.drawing.children.length - 1; i >= 0; --i) {
      if (this.currentSelection.selectedItems[i] === true) {
        this.clipboardContent.push(this.currentSelection.drawing.children[i]);
      }
    }
  }

  // Paste the element in the clipboard on the canvas.
  paste(): void {
    this.pasteOffsetX += OFFSET;
    this.pasteOffsetY += OFFSET;
    const rect = this.currentSelection.selectedRef.getBoundingClientRect();
    const CANVAS_BOX = this.currentSelection.canvas.getBoundingClientRect();
    const TOP_LEFT_SELECTION = new Point(rect.left, rect.top);
    const BOTTOM_RIGHT_SELECTION = new Point(rect.left + rect.width, rect.top + rect.height);
    const TOP_LEFT_CANVAS = new Point(CANVAS_BOX.left - OUTSIDE_CANVAS_ADJUSTMENT_PASTE, CANVAS_BOX.top - OUTSIDE_CANVAS_ADJUSTMENT_PASTE);
    const BOTTOM_RIGHT_CANVAS = new Point(CANVAS_BOX.right - OUTSIDE_CANVAS_ADJUSTMENT_PASTE,
      CANVAS_BOX.bottom - OUTSIDE_CANVAS_ADJUSTMENT_PASTE);
    if (!Point.rectOverlap(TOP_LEFT_SELECTION, BOTTOM_RIGHT_SELECTION, TOP_LEFT_CANVAS, BOTTOM_RIGHT_CANVAS)) {
      this.pasteOffsetX = OFFSET;
      this.pasteOffsetY = OFFSET;
    }
    for (let i = 0; i < this.currentSelection.drawing.children.length; i++) {
      this.currentSelection.selectedItems[i] = false;
    }
    for (let i = this.clipboardContent.length - 1; i >= 0; --i) {
      const clone = this.clipboardContent[i].cloneNode(true);
      this.render.setAttribute(clone, 'isListening', 'false');
      this.currentSelection.drawing.appendChild(clone);
      this.currentSelection.selectedItems.push(true);
      const EVENT = new Event('newDrawing');
      window.dispatchEvent(EVENT);
    }
    CanvasInteraction.moveElements(this.pasteOffsetX, this.pasteOffsetY, this.currentSelection);
    this.currentSelection.selectedRef.innerHTML = CanvasInteraction.createBoundingBox(this.currentSelection);
    this.currentSelection.interaction.emitDrawingDone();
  }

  // Remove the selected elements from the canvas and place them in the clipboard
  cut(): void {
    this.pasteOffsetX = 0;
    this.pasteOffsetY = 0;
    this.copy();
    this.delete();
  }

  // Duplicate the selected elements on the canvas without placing it in the clipboard.
  duplicate(): void {
    this.dupOffsetX = OFFSET;
    this.dupOffsetY = OFFSET;
    const rect = this.currentSelection.selectedRef.getBoundingClientRect();
    const CANVAS_BOX = this.currentSelection.canvas.getBoundingClientRect();
    const TOP_LEFT_SELECTION = new Point(rect.left, rect.top);
    const BOTTOM_RIGHT_SELECTION = new Point(rect.left + rect.width, rect.top + rect.height);
    const TOP_LEFT_CANVAS = new Point(CANVAS_BOX.left - OUTSIDE_CANVAS_ADJUSTMENT_DUP, CANVAS_BOX.top - OUTSIDE_CANVAS_ADJUSTMENT_DUP);
    const BOTTOM_RIGHT_CANVAS = new Point(CANVAS_BOX.right - OUTSIDE_CANVAS_ADJUSTMENT_DUP,
      CANVAS_BOX.bottom - OUTSIDE_CANVAS_ADJUSTMENT_DUP);
    const size = this.currentSelection.drawing.children.length;
    for (let i = 0; i < size; i++) {
      if (this.currentSelection.selectedItems[i] === true) {
        const clone = this.currentSelection.drawing.children[i].cloneNode(true);
        this.render.setAttribute(clone, 'isListening', 'false');
        this.currentSelection.drawing.appendChild(clone);
        this.currentSelection.selectedItems[i] = false;
        this.currentSelection.selectedItems.push(true);
        const EVENT = new Event('newDrawing');
        window.dispatchEvent(EVENT);
      }
    }

    if (!Point.rectOverlap(TOP_LEFT_SELECTION, BOTTOM_RIGHT_SELECTION, TOP_LEFT_CANVAS, BOTTOM_RIGHT_CANVAS)) {
      this.dupOffsetX = 0;
      this.dupOffsetY = 0;
    }
    CanvasInteraction.moveElements(this.dupOffsetX, this.dupOffsetY, this.currentSelection);
    this.currentSelection.selectedRef.innerHTML = CanvasInteraction.createBoundingBox(this.currentSelection);
    this.currentSelection.interaction.emitDrawingDone();
  }
  // Delete entirely an element from the canvas.
  delete(): void {
    for (let i = this.currentSelection.drawing.children.length - 1; i >= 0; --i) {
      if (this.currentSelection.selectedItems[i] === true) {
        this.currentSelection.drawing.children[i].remove();
        this.currentSelection.selectedItems.splice(i, 1);
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
