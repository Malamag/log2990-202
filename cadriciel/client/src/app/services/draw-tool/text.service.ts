import { Injectable } from '@angular/core';
import { TextAttributes } from '../attributes/text-attribute';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { DrawingTool } from './drawing-tool';
import { Point } from './point';

const DEFAULT_FONT_SIZE = 20;
const DEFAULT_FONT_FAMILY = 'arial';
const DEFAULT_ALIGNMENT = 'L';

// const LEFT_ARROW = 37;
// const UP_ARROW = 38;
// const RIGHT_ARROW = 39;
// const DOWN_ARROW = 40;

// const BACKSPACE = 8;
// const ENTER = 13;

@Injectable({
  providedIn: 'root'
})
export class TextService extends DrawingTool {
  attr: TextAttributes;

  // private textString: string;

  // private cursorPosition: number;
  // private lineNumber: number;

  // private keyDown: boolean;

  constructor(
    inProgess: HTMLElement,
    drawing: HTMLElement,
    selected: boolean,
    interaction: InteractionService,
    colorPick: ColorPickingService,
  ) {
    super(inProgess, drawing, selected, interaction, colorPick);
    this.attr = { fontSize: DEFAULT_FONT_SIZE,
                  fontFamily: DEFAULT_FONT_FAMILY,
                  alignment : DEFAULT_ALIGNMENT,
                  isBold : false,
                  isItalic: false };
    this.updateColors();
    this.updateAttributes();
    // this.textString = '';
    // this.cursorPosition = 0;
    // this.keyDown = false;
  }

  updateAttributes(): void {
    this.interaction.$textAttributes.subscribe((obj: TextAttributes) => {
      if (obj) {
        this.attr = { fontSize: obj.fontSize,
                      fontFamily: obj.fontFamily,
                      alignment : obj.alignment,
                      isBold : obj.isBold,
                      isItalic: obj.isItalic };
      }
    });
    this.colorPick.emitColors();
  }

  // updating on key change
  updateDown(keyboard: KeyboardHandlerService): void {
    // move cursor TODO
  }

  // updating on key up
  updateUp(keyCode: number): void {
    //
  }

  // mouse up with pencil in hand
  up(position: Point, insideWorkspace: boolean): void {
    // nothing happens
    this.isDown = false;
  }

  // mouse move with pencil in hand
  move(position: Point): void {
    this.isDown = false;
  }

  // mouse doubleClick with pencil in hand
  doubleClick(position: Point): void {
    // since its down -> up -> down -> up -> doubleClick, nothing more happens for the pencil
  }

  // mouse down with pencil in hand
  down(position: Point): void {
    // in case we changed tool while the mouse was down
    this.ignoreNextUp = false;

    // the pencil should affect the canvas
    this.isDown = true;

    // add the same point twice in case the mouse doesnt move
    this.currentPath.push(position);
    this.currentPath.push(position);

    this.updateDrawing();
  }

  getFontWeight(): string {
    if (this.attr.isBold) {
      return 'bold';
    } else {
      return 'normal';
    }
  }

  getFontStyle(): string {
    if (this.attr.isItalic) {
      return 'italic';
    } else {
      return 'normal';
    }
  }

  getTextAlignement(): string {
    switch (this.attr.alignment) {
      case 'C' : {
        return 'center';
      }
      case 'R' : {
        return 'right';
      }
      default : {
        return 'left';
      }
    }
  }

  // Creates an svg path that connects every points of currentPath with the pencil attributes
  createPath(p: Point[]): string {
    let s = '';

    // We need at least 2 points
    if (p.length < 2) {
      return s;
    }

    // create a divider
    s = '<g name = "text" style="transform: translate(0px, 0px);" >';

    // start the path
/*
    s += `
      <foreignObject x="20" y="0" width="50" height="50">
        <p contenteditable style="cursor: text" >Yeet!</p>
      </foreignObject>
    `;
*/

    s += `<text x="${p[0].x}" y="${p[0].y}" `;
    s += `color="${this.chosenColor.primColor}" `;
    s += `font-family="${this.attr.fontFamily}" `;
    s += `font-size="${this.attr.fontSize}" `;
    s += `font-weight="${this.getFontWeight()}" `;
    s += `font-style="${this.getFontStyle()}" `;
    s += `text-align="${this.getTextAlignement()}" `;
    s += '>Yeet! </text>';
    // end the divider
    s += ' </g>';
    return s;
  }
}

/*

// Creates an svg path that connects every points of currentPath with the pencil attributes
  createPath(p: Point[]): string {
    let s = '';

    // We need at least 2 points
    if (p.length < 2) {
      return s;
    }

    // create a divider
    s = '<g name = "text" style="transform: translate(0px, 0px);" >';

    // start the path
    s += `<defs> <path id="textPath${this.drawing.childElementCount}" fill: rgb(170, 170, 170) d="`;
    // move to first point
    let longestLine = 0;
    for (const TEXT_S of this.textString) {
      if(TEXT_S.length > longestLine) {
        longestLine = TEXT_S.length;
      }
    }

    const X_TEXT_SIZE = this.attr.fontSize * longestLine;
    const Y_TEXT_SIZE = this.attr.fontSize * this.textString.length;

    s += `M ${p[0].x} ${p[0].y} `;
    s += `L ${p[0].x + X_TEXT_SIZE} ${p[0].y}" /> </defs>`;

    for (const TEXT_LINE of this.textString) {
      s += ` <text> <textPath xlink:href="#textPath${this.drawing.childElementCount}"`;
      s += ` stroke="${this.chosenColor.primColor}" >`;
      s += ` ${TEXT_LINE}"`;
      s += ' </textPath> </text>';
    }

    // end the divider
    s += ' </g>';
    return s;
  }

  // updating on key change
  updateDown(keyboard: KeyboardHandlerService): void {
    // move cursor TODO
    if (this.keyDown === true) {
      return;
    }
    this.keyDown = true;
    if (keyboard.keyCode === UP_ARROW) {
      if (this.lineNumber > 0) {
        --this.lineNumber;
      }
      return;
    }
    if (keyboard.keyCode === DOWN_ARROW) {
      if (this.lineNumber < this.textString.length) {
        ++this.lineNumber;
      }
      return;
    }
    if (keyboard.keyCode === LEFT_ARROW) {
      if (this.cursorPosition > 0) {
        --this.cursorPosition;
      }
      return;
    }
    if (keyboard.keyCode === RIGHT_ARROW) {
      if (this.cursorPosition < this.textString.length) {
        ++this.cursorPosition;
      }
      return;
    }
    if (keyboard.keyCode === BACKSPACE) {
      if (this.cursorPosition > 0) {
      this.textString[this.lineNumber] = this.textString[this.lineNumber].slice(0, this.cursorPosition) +
                        this.textString[this.lineNumber].slice(this.cursorPosition + 1, this.textString.length);
      --this.cursorPosition;
      } else if (this.lineNumber > 0) {
        // remove textString[this.lineNumber];
      }
      return;
    }
    if (keyboard.keyCode === ENTER) {
      this.textString[this.lineNumber] = this.textString[this.lineNumber].slice(0, this.cursorPosition) +
                        this.textString[this.lineNumber].slice(this.cursorPosition + 1, this.textString.length);
      ++this.lineNumber;
      return;
    }
    // else
    this.textString[this.lineNumber] += this.textString[this.lineNumber].slice(0, this.cursorPosition) +
                                        String.fromCharCode(keyboard.keyCode) +
                                        this.textString[this.lineNumber].slice(this.cursorPosition + 1, this.textString.length);
    return;
  }

*/
