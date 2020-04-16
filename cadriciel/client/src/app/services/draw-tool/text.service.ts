import { Injectable, Renderer2 } from '@angular/core';
import { TextAttributes } from '../attributes/text-attribute';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { DrawingTool } from './drawing-tool';
import { Point } from './point';
const DEFAULT_FONT_SIZE = 20;
const DEFAULT_FONT_FAMILY = 'arial';
const DEFAULT_ALIGNMENT = 'L';
@Injectable({
  providedIn: 'root'
})
export class TextService extends DrawingTool {
  private attr: TextAttributes;
  private render: Renderer2;
  // Indicates the location of the element under the mouse in the drawing.children array
  private itemUnderMouse: number | null;
  // Indicates true if an item is under the mouse
  private foundAnItem: boolean;
  constructor(
    inProgess: HTMLElement,
    drawing: HTMLElement,
    selected: boolean,
    interaction: InteractionService,
    colorPick: ColorPickingService,
    render: Renderer2
  ) {
    super(inProgess, drawing, selected, interaction, colorPick);
    this.attr = { fontSize: DEFAULT_FONT_SIZE,
                  fontFamily: DEFAULT_FONT_FAMILY,
                  alignment : DEFAULT_ALIGNMENT,
                  isBold : false,
                  isItalic: false };
    this.updateColors();
    this.updateAttributes();
    this.render = render;
    // whenever a new item is added, link it to a mousedown event to handle single click
    window.addEventListener('newDrawing', (e: Event) => {
      for (let i = 0; i < this.drawing.childElementCount; i++) {
          const EL: Element = this.drawing.children[i];
          let status: string | null;
          try { // in case the getAttribute method is not implemented for the item
              status = EL.getAttribute('isListening');
          } catch (err) {
              status = null;
          }
          if (status !== 'true') {
              this.render.listen(EL, 'mousedown', () => {
                  this.render.setAttribute(EL, 'isListening', 'true');
                  if (!this.foundAnItem) {
                      this.itemUnderMouse = i;
                      this.foundAnItem = true;
                  }
              });
          }
      }
    });
  }
  updateAttributes(): void {  // Subscribe the text attributes and colors
    this.interaction.$textAttributes.subscribe((obj: TextAttributes) => {
        this.attr = { fontSize: obj.fontSize,
                      fontFamily: obj.fontFamily,
                      alignment : obj.alignment,
                      isBold : obj.isBold,
                      isItalic: obj.isItalic };
    });
    this.colorPick.emitColors();
  }
  // updating on key change
  updateDown(keyboard: KeyboardHandlerService): void {
    // Nothing happens
  }
  // updating on key up
  updateUp(keyCode: number): void {
    // Nothing happens
  }
  // mouse up with pencil in hand
  up(position: Point, insideWorkspace: boolean): void {
    this.isDown = false;
    this.foundAnItem = false;
  }
  // mouse move with pencil in hand
  move(position: Point): void {
    this.isDown = false;
  }
  // mouse doubleClick with pencil in hand
  doubleClick(position: Point): void {
    // since its down -> up -> down -> up -> doubleClick, nothing more happens for the text
  }
  // Returns true if the element under the mouse is text
  isMouseClickingText(): boolean {
    if (this.foundAnItem && this.itemUnderMouse !== null) {
      if (this.drawing.children[this.itemUnderMouse].children[0].tagName === 'text') {
        return true;
      }
    }
    return false;
  }
  // mouse down with text in hand
  down(position: Point): void {
    // We don't create another text element if a text element is being selected
    if (this.isMouseClickingText()) {
      return;
    }
    // in case we changed tool while the mouse was down
    this.ignoreNextUp = false;
    // the text should affect the canvas
    this.isDown = true;
    // add the same point twice in case the mouse doesnt move
    this.currentPath.push(position);
    this.currentPath.push(position);
    this.updateDrawing();
  }
  // Returns the string to put in the font-weight attribute of the text
  getFontWeight(): string {
    if (this.attr.isBold) {
      return 'bold';
    } else {
      return 'normal';
    }
  }
  // Returns the string to put in the font-style attribute of the text
  getFontStyle(): string {
    if (this.attr.isItalic) {
      return 'italic';
    } else {
      return 'normal';
    }
  }
  // Returns the string to put in the text-anchor attribute of the text
  getTextAlignement(): string {
    switch (this.attr.alignment) {
      case 'C' : {
        return 'middle';
      }
      case 'R' : {
        return 'end';
      }
      default : {
        return 'start';
      }
    }
  }
  // Creates an svg path that connects every points of currentPath with the pencil attributes
  createPath(p: Point[]): string {
    let s = '';
    // create a divider
    s = '<g name = "text" style="transform: translate(0px, 0px);" >';
    s += `<text style="cursor: text" x="${p[0].x}" y="${p[0].y}" dy="0.5em" `;
    s += `fill="${this.chosenColor.primColor}" `;
    s += `font-family="${this.attr.fontFamily}" `;
    s += `font-size="${this.attr.fontSize}" `;
    s += `font-weight="${this.getFontWeight()}" `;
    s += `font-style="${this.getFontStyle()}" `;
    s += `text-anchor="${this.getTextAlignement()}" `;
    s += '><tspan>- Enter Text Here </tspan>';
    s += '</text>';
    // end the divider
    s += ' </g>';
    return s;
  }
}