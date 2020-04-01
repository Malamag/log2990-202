import { Injectable, Renderer2 } from '@angular/core';
import { ToolsAttributes } from '../attributes/tools-attribute';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { CanvasInteraction } from './canvas-interaction.service';
import { DrawingTool } from './drawing-tool';
import { ElementInfo } from './element-info.service';
import { Point } from './point';

const DEFAULTLINETHICKNESS = 5;
const DEFAULTTEXTURE = 0;
@Injectable({
    providedIn: 'root',
})
export class ColorEditorService extends DrawingTool {
    render: Renderer2;

    attr: ToolsAttributes;

    canvas: HTMLElement;

    // to change stroke color
    isRightClick: boolean;

    // used for undo-redo
    changedColorOnce: boolean;

    constructor(
        inProgess: HTMLElement,
        drawing: HTMLElement,
        selected: boolean,
        interaction: InteractionService,
        colorPick: ColorPickingService,
        render: Renderer2,
        selectedRef: HTMLElement,
        canvas: HTMLElement,
    ) {
        super(inProgess, drawing, selected, interaction, colorPick);
        this.attr = { lineThickness: DEFAULTLINETHICKNESS, texture: DEFAULTTEXTURE };
        this.updateColors();
        this.updateAttributes();

        this.changedColorOnce = false;

        this.canvas = canvas;

        this.render = render;

        this.isRightClick = false;
    }

    updateAttributes(): void {
        this.interaction.$toolsAttributes.subscribe((obj) => {
            if (obj) {
                this.attr = { lineThickness: obj.lineThickness, texture: obj.texture };
            }
        });
        this.colorPick.emitColors();
    }

    // updating on key change
    updateDown(keyboard: KeyboardHandlerService): void {
        // keyboard has no effect on color-editor
    }

    // updating on key up
    updateUp(keyCode: number): void {
        // nothing happens for color-editor tool
    }

    // mouse down with color-editor in hand
    down(position: Point, insideWorkspace: boolean, isRightClick: boolean): void {
        this.isRightClick = isRightClick;

        // in case we changed tool while the mouse was down
        this.ignoreNextUp = false;

        // the color-editor should affect the canvas
        this.isDown = true;

        // add the same point twice in case the mouse doesnt move
        this.currentPath.push(position);
        this.currentPath.push(position);

        this.updateProgress();

        //
        this.checkIfTouching();
    }

    // mouse up with color-editor in hand
    up(position: Point, insideWorkspace: boolean): void {
        // in case we changed tool while the mouse was down
        if (!this.ignoreNextUp) {
            // the color-editor should not affect the canvas
            this.isDown = false;

            // save canvas state for undo-redo
            if (this.changedColorOnce) {
                this.interaction.emitDrawingDone();
            }
            // reset
            this.changedColorOnce = false;
        }
    }

    // change the color of an element (fill : left click, stroke : right click)
    changeColor(el: Element): void {
        if (this.selected) {
            // iterate on every component of the element
            for (let i = 0; i < el.childElementCount; i++) {
                const ITEM_COMPONENT = el.children[i];
                // ignore componenent that do not have a color to change
                if (ITEM_COMPONENT.tagName === 'filter') {
                    continue;
                }
                if (this.isRightClick) {
                    this.changeBorder(ITEM_COMPONENT as HTMLElement);
                } else {
                    this.changeFill(ITEM_COMPONENT as HTMLElement);
                }
            }
        }
    }

    // change the stroke color of an element
    changeBorder(el: HTMLElement): void {
        if (el.getAttribute('stroke') !== this.chosenColor.secColor && el.getAttribute('stroke') !== 'none') {
            this.render.setAttribute(el, 'stroke', this.chosenColor.secColor);
            this.changedColorOnce = true;
        }
    }

    // change the fill color of an element
    changeFill(el: HTMLElement): void {
        if (el.getAttribute('fill') !== this.chosenColor.primColor && el.getAttribute('fill') !== 'none') {
            this.render.setAttribute(el, 'fill', this.chosenColor.primColor);
            this.changedColorOnce = true;
        }
    }

    // mouse move with color-editor in hand
    move(position: Point): void {
        // save mouse position
        this.currentPath.push(position);

        // to generate a square that connects every two points we need 3 points total at any given time [X - 0 - X]
        const MIN_LEN = 3;
        while (this.currentPath.length > MIN_LEN) {
            this.currentPath.shift();
        }

        this.updateProgress();

        // look for an item that intersects the color-editor brush
        this.checkIfTouching();
    }

    // when we go from inside to outside the canvas
    goingOutsideCanvas(): void {
        // remove brush preview while outside
        this.currentPath = [];
        this.inProgress.innerHTML = '';
    }

    // when we go from outside to inside the canvas
    goingInsideCanvas(): void {
        // nothing happens since we just update the preview
    }

    checkIfTouching(): void {
        // get the canvas offset
        const DIV = 10;
        const CANVAS_BOX = this.canvas ? this.canvas.getBoundingClientRect() : null;
        const CANV_OFFSET_X = CANVAS_BOX ? CANVAS_BOX.left : 0;
        const CANV_OFFSET_Y = CANVAS_BOX ? CANVAS_BOX.top : 0;

        // compute the color-editor brush dimension
        const W = Math.max(
            this.attr.lineThickness,
            Math.abs(this.currentPath[this.currentPath.length - 1].x - this.currentPath[0].x)
        );
        const H = Math.max(
            this.attr.lineThickness,
            Math.abs(this.currentPath[this.currentPath.length - 1].y - this.currentPath[0].y)
        );

        // it's a square
        const dim = Math.max(W, H);

        const TOP_LEFT = new Point(
            this.currentPath[this.currentPath.length - 1].x - dim / 2,
            this.currentPath[this.currentPath.length - 1].y - dim / 2,
        );
        const BOTTOM_RIGHT = new Point(TOP_LEFT.x + dim, TOP_LEFT.y + dim);

        // iterate every item
        for (let i = this.drawing.childElementCount - 1; i >= 0; i--) {

            let touching = false;
            // pencil-stroke, line-segments, etc.
            const FULL_ITEM = this.drawing.children[i];
            // item bounding box
            const POS = 3;
            const itemBox = CanvasInteraction.getPreciseBorder(FULL_ITEM);
            const ITEM_TOP_LEFT: Point = new Point(itemBox[0][0] - CANV_OFFSET_X, itemBox[2][0] - CANV_OFFSET_Y);
            const ITEM_BOTTOM_RIGHT: Point = new Point(itemBox[1][0] - CANV_OFFSET_X, itemBox[POS][0] - CANV_OFFSET_Y);
            // if the bounding boxes do not overlap, no need for edge detection
            if (!Point.rectOverlap(TOP_LEFT, BOTTOM_RIGHT, ITEM_TOP_LEFT, ITEM_BOTTOM_RIGHT)) {
                continue;
            }

            // the offset of the current item
            const objOffset: Point = ElementInfo.translate(FULL_ITEM);

            // iterate on every component of the current item for edge detection
            for (let j = 0; j < FULL_ITEM.childElementCount; j++) {
                const ITEM_COMPONENT = FULL_ITEM.children[j];
                // ignore useless or non-shape components
                if (ITEM_COMPONENT.classList.contains('aerosolPoints')) { break; }
                if (
                    ITEM_COMPONENT.classList.contains('clone') ||
                    ITEM_COMPONENT.classList.contains('noHighlights') ||
                    ITEM_COMPONENT.tagName === 'filter'
                ) {
                    continue;
                }
                // check the intersection between the color-editor and the item component
                if (this.inProgress.firstElementChild && this.inProgress.firstElementChild.firstElementChild) {
                    const COLOR_EDITOR_ELEMENT = this.inProgress.firstElementChild.firstElementChild;
                    touching = this.checkIfPathIntersection(COLOR_EDITOR_ELEMENT, ITEM_COMPONENT, dim / DIV, objOffset, touching);

                }
            }

            // if there is a match
            if (touching) {
                if (this.isDown) {
                    this.changeColor(FULL_ITEM);
                }
                break;
            }
        }
    }

    // iterate on points that compose the color-editor perimeter and check if they appear in the fill or stroke of the candidate
    checkIfPathIntersection(
        colorEditorElement: Element,
        candidateElement: Element,
        precision: number,
        objOffset: Point,
        touching: boolean): boolean {

        const COLOR_EDITOR_BRUSH = colorEditorElement as SVGGeometryElement;
        const COLOR_EDITOR_PERIMETER = COLOR_EDITOR_BRUSH.getTotalLength();

        const candidate = candidateElement as SVGGeometryElement;

        for (let v = 0; v < COLOR_EDITOR_PERIMETER; v += precision) {
            const testPoint = COLOR_EDITOR_BRUSH.getPointAtLength(v);
            testPoint.x -= objOffset.x;
            testPoint.y -= objOffset.y;
            if (
                candidate.isPointInStroke(testPoint) ||
                (candidate.isPointInFill(testPoint) && candidateElement.getAttribute('fill') !== 'none')
            ) {
                touching = true;
                break;
            }
        }
        return touching;
    }

    // mouse doubleClick with color-editor in hand
    doubleClick(position: Point): void {
        // since its down -> up -> down -> up -> doubleClick, nothing more happens for the color-editor
    }

    // Creates an svg path that connects every points of currentPath with the color-editor attributes
    createPath(p: Point[]): string {
        let s = '';

        // We need at least 2 points
        if (p.length < 2) {
            return s;
        }

        // create a divider
        s = '<g style="transform: translate(0px, 0px);" name = "colorEditor-brush">';
        const WIDTH = 10;
        const W = Math.max(WIDTH, Math.abs(p[p.length - 1].x - p[0].x));
        const H = Math.max(WIDTH, Math.abs(p[p.length - 1].y - p[0].y));

        const dim = Math.max(W, H);

        s += `<rect x="${p[p.length - 1].x - dim / 2}" y="${p[p.length - 1].y - dim / 2}"`;
        s += `width="${dim}" height="${dim}"`;

        s += `fill="${this.chosenColor.primColor}"`;
        s += `stroke-width="3" stroke="${this.chosenColor.secColor}"`;

        // end the divider
        s += '</g>';

        return s;
    }
}
