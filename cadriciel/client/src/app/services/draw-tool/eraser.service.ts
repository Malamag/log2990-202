import { Injectable, Renderer2 } from '@angular/core';
import { ToolsAttributes } from '../attributes/tools-attribute';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { CanvasInteraction } from './canvas-interaction.service';
import { DrawingTool } from './drawing-tool';
import { ElementInfo } from './element-info.service';
import { Point } from './point';

const DEFAULT_LINE_THICKNESS = 5;
const DEFAULT_TEXTURE = 0;
@Injectable({
    providedIn: 'root',
})
export class EraserService extends DrawingTool {
    render: Renderer2;
    attr: ToolsAttributes;
    erasedSomething: boolean;
    canvas: HTMLElement;

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
        this.attr = { lineThickness: DEFAULT_LINE_THICKNESS, texture: DEFAULT_TEXTURE };
        this.updateColors();
        this.updateAttributes();

        this.canvas = canvas;

        this.render = render;

        // used for undo-redo
        this.erasedSomething = false;

        // make sure to unhighlight everything on tool change
        window.addEventListener('toolChange', (e: Event) => {
            for (let i = 0; i < this.drawing.childElementCount; i++) {
                this.unhighlight(this.drawing.children[i]);
            }
        });
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
        // keyboard has no effect on eraser
    }

    // updating on key up
    updateUp(keyCode: number): void {
        // nothing happens for eraser tool
    }

    // mouse down with eraser in hand
    down(position: Point): void {
        // in case we changed tool while the mouse was down
        this.ignoreNextUp = false;

        // the eraser should affect the canvas
        this.isDown = true;

        // add the same point twice in case the mouse doesnt move
        this.currentPath.push(position);
        this.currentPath.push(position);

        this.updateProgress();

        // look for an item that intersects the eraser brush
        this.checkIfTouching();
    }

    // mouse up with eraser in hand
    up(position: Point, insideWorkspace: boolean): void {
        // in case we changed tool while the mouse was down
        if (this.ignoreNextUp) {
            return;
        }
        // the eraser should not affect the canvas
        this.isDown = false;

        // save canvas state for undo-redo
        if (this.erasedSomething) {
            this.interaction.emitDrawingDone();

        }
        // reset
        this.erasedSomething = false;
        // look for an item that intersects the eraser brush
        if (insideWorkspace) { this.checkIfTouching(); }
    }

    // delete an element
    erase(el: Element): void {
        if (!this.selected) {
            return;
        }
        this.render.removeChild(el.parentElement, el);
        this.erasedSomething = true;
    }

    // highlights a 'g' tag by adding a clone of it as a new child
    highlight(el: Element): void {
        // make sure that the element is valid and not already a clone
        if (!(this.selected && el.firstElementChild && !el.firstElementChild.classList.contains('clone'))) {
            return;
        }

        // create a clone of the element
        const clone: Element = this.render.createElement('g', 'http://www.w3.org/2000/svg');
        (clone as HTMLElement).innerHTML = el.innerHTML;
        const ADD = 10;
        // iterate on every children of the element
        for (let i = 0; i < el.childElementCount; i++) {
            // remove the ones that should not be highlighted
            if (el.children[i].classList.contains('invisiblePath')) {
                this.render.removeChild(clone, clone.children[i]);
            }
            // increase the stroke-width of the clone so it can be visible behind the original
            const originalWidth: string | null = (el.children[i] as HTMLElement).getAttribute('stroke-width');
            const originalWidthNumber = originalWidth ? +originalWidth : 0;
            const wider: number = Math.max(ADD, originalWidthNumber + ADD);
            this.render.setAttribute(clone.children[i], 'stroke-width', `${wider}`);

            // set the color of the clone
            const originalStrokeColor: string | null = (el.children[i] as HTMLElement).getAttribute('stroke');
            const originalFillColor: string | null = (el.children[i] as HTMLElement).getAttribute('fill');
            const refcolor: string | null = originalStrokeColor !== 'none' ? originalStrokeColor : originalFillColor;
            // chose the perfect red color for maximum visibility
            const originalStrokeRGB: [number, number, number] = [0, 0, 0];
            if (refcolor && refcolor !== 'none') {
                const THREE = 3;
                const FOUR = 4; const FIVE = 5; const SIX = 6;
                originalStrokeRGB[0] = parseInt(refcolor[1] + refcolor[2], 16);
                originalStrokeRGB[1] = parseInt(refcolor[THREE] + refcolor[FOUR], 16);
                originalStrokeRGB[2] = parseInt(refcolor[FIVE] + refcolor[SIX], 16);
            }
            // if original has a red value high enough, make it darker
            let redHighlight = 255;
            const MAX_RGB = 255;
            const DIV = 4;
            const MULT = 3;
            const originalTooRed = originalStrokeRGB[0] > (MAX_RGB / DIV) * MULT;
            if (originalTooRed) {
                redHighlight = (originalStrokeRGB[0] / DIV) * MULT;
            }
            this.render.setAttribute(clone.children[i], 'stroke', `rgb(${redHighlight},0,0)`);
        }
        // mark the clone
        this.render.setAttribute(clone, 'class', 'clone');
        // insert it as a new child behind all the existing ones
        this.render.insertBefore(el, clone, el.firstElementChild);
    }

    // unhighlights the element by removing all of his "clone" children
    unhighlight(el: Element): void {
        if (el.firstElementChild) {
            if (el.firstElementChild.classList.contains('clone')) {
                this.render.removeChild(el, el.firstElementChild);
            }
        }
    }

    // mouse move with eraser in hand
    move(position: Point): void {
        // save mouse position
        this.currentPath.push(position);
        const LENGTH = 3;
        // to generate a square that connects every two points we need 3 points total at any given time [X - 0 - X]
        while (this.currentPath.length > LENGTH) {
            this.currentPath.shift();
        }

        this.updateProgress();

        // look for an item that intersects the eraser brush
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

    // handles what happens when the eraser brush is touching an item
    checkIfTouching(): void {
        // get the canvas offset
        const canvasBox = this.canvas ? this.canvas.getBoundingClientRect() : null;
        const canvOffsetX = canvasBox ? canvasBox.left : 0;
        const canvOffsetY = canvasBox ? canvasBox.top : 0;

        // compute the eraser brush dimension
        const w = Math.max(
            this.attr.lineThickness,
            Math.abs(this.currentPath[this.currentPath.length - 1].x - this.currentPath[0].x)
        );
        const h = Math.max(
            this.attr.lineThickness,
            Math.abs(this.currentPath[this.currentPath.length - 1].y - this.currentPath[0].y)
        );

        // it's a square
        const dim = Math.max(w, h);

        const topLeft = new Point(
            this.currentPath[this.currentPath.length - 1].x - dim / 2,
            this.currentPath[this.currentPath.length - 1].y - dim / 2,
        );
        const bottomRight = new Point(topLeft.x + dim, topLeft.y + dim);
        const POS = 3;
        // iterate every item (do it backwards so no shift is needed when we delete an item)
        for (let i = this.drawing.childElementCount - 1; i >= 0; i--) {

            let touching = false;
            // pencil-stroke, line-segments, etc.
            const fullItem = this.drawing.children[i];

            // item bounding box
            const itemBox = CanvasInteraction.getPreciseBorder(fullItem);
            const itemTopLeft: Point = new Point(itemBox[0][0] - canvOffsetX, itemBox[2][0] - canvOffsetY);
            const itemBottomRight: Point = new Point(itemBox[1][0] - canvOffsetX, itemBox[POS][0] - canvOffsetY);

            // if the bounding boxes do not overlap, no need for edge detection
            if (!Point.rectOverlap(topLeft, bottomRight, itemTopLeft, itemBottomRight)) {
                this.unhighlight(fullItem);
                continue;
            }
            touching = this.loopAction(fullItem, touching, dim);
            /*
            // the offset of the current item
            const objOffset: Point = ElementInfo.translate(fullItem);

            // iterate on every component of the current item for edge detection
            for (let j = 0; j < fullItem.childElementCount; j++) {
                const itemComponent = fullItem.children[j];

                // ignore useless or non-shape components
                if (itemComponent.classList.contains('aerosolPoints')) { break; }
                if (
                    itemComponent.classList.contains('clone') ||
                    itemComponent.classList.contains('noHighlights') ||
                    itemComponent.tagName === 'filter'
                ) {
                    continue;
                }

                // check the intersection between the eraser and the item component
                if (this.inProgress.firstElementChild && this.inProgress.firstElementChild.firstElementChild) {
                    const eraserElement = this.inProgress.firstElementChild.firstElementChild;
                    const DIV = 10;
                    touching = this.checkIfPathIntersection(eraserElement, itemComponent, dim / DIV, objOffset, touching);
                }
            }
            */
            // if there is a match
            if (touching) {
                // erase if mouse down, else highlight
                if (this.isDown) {
                    this.erase(fullItem);
                } else {
                    this.highlight(fullItem);
                    // only one hightlight at a time
                    for (let k = 0; k < this.drawing.childElementCount; k++) {
                        if (k !== i) {
                            this.unhighlight(this.drawing.children[k]);
                        }
                    }
                }
                break;
            } else {
                // nothing should be highlighted
                this.unhighlight(fullItem);
            }
        }
    }
    loopAction(fullItem: Element, touching: boolean, dim: number ): boolean {
        // the offset of the current item
        const objOffset: Point = ElementInfo.translate(fullItem);

        // iterate on every component of the current item for edge detection
        for (let j = 0; j < fullItem.childElementCount; j++) {
            const itemComponent = fullItem.children[j];

            // ignore useless or non-shape components
            if (itemComponent.classList.contains('aerosolPoints')) { break; }
            if (
                itemComponent.classList.contains('clone') ||
                itemComponent.classList.contains('noHighlights') ||
                itemComponent.tagName === 'filter'
            ) {
                continue;
            }

            // check the intersection between the eraser and the item component
            if (this.inProgress.firstElementChild && this.inProgress.firstElementChild.firstElementChild) {
                const eraserElement = this.inProgress.firstElementChild.firstElementChild;
                const DIV = 10;
                touching = this.checkIfPathIntersection(eraserElement, itemComponent, dim / DIV, objOffset, touching);
            }
        }
        return touching;
    }

    // iterate on points that compose the eraser perimeter and check if they appear in the fill or stroke of the candidate
    checkIfPathIntersection(eraserElement: Element, candidateElement: Element, precision: number,
                            objOffset: Point, touching: boolean): boolean {

        const eraserBrush = eraserElement as SVGGeometryElement;
        const eraserPerimeter = eraserBrush.getTotalLength();

        const candidate = candidateElement as SVGGeometryElement;

        for (let v = 0; v < eraserPerimeter; v += precision) {
            const testPoint = eraserBrush.getPointAtLength(v);
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

    // mouse doubleClick with eraser in hand
    doubleClick(position: Point): void {
        // since its down -> up -> down -> up -> doubleClick, nothing more happens for the eraser
    }
    // Creates an svg path that connects every points of currentPath with the eraser attributes
    createPath(p: Point[]): string {
        let s = '';
        // We need at least 2 points
        if (p.length < 2) {
            return s;
        }
        // create a divider
        s = '<g style="transform: translate(0px, 0px);" name = "eraser-brush">';
        const w = Math.max(this.attr.lineThickness, Math.abs(p[p.length - 1].x - p[0].x));
        const h = Math.max(this.attr.lineThickness, Math.abs(p[p.length - 1].y - p[0].y));
        const dim = Math.max(w, h);
        s += `<rect x="${p[p.length - 1].x - dim / 2}" y="${p[p.length - 1].y - dim / 2}"`;
        s += `width="${dim}" height="${dim}"`;

        s += 'fill="white"';
        s += 'stroke-width="1" stroke="black"';

        // end the divider
        s += '</g>';
        return s;
    }
}
