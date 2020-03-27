import { Injectable, Renderer2 } from '@angular/core';
import { ToolsAttributes } from '../attributes/tools-attribute';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { DrawingTool } from './drawing-tool';
import { Point } from './point';
import { CanvasInteraction } from './canvas-interaction.service';
import { ElementInfo } from './element-info.service';

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

    updateAttributes() {
        this.interaction.$toolsAttributes.subscribe(obj => {
            if (obj) {
                this.attr = { lineThickness: obj.lineThickness, texture: obj.texture };
            }
        });
        this.colorPick.emitColors();
    }

    // updating on key change
    updateDown(keyboard: KeyboardHandlerService) {
        // keyboard has no effect on pencil
    }

    // updating on key up
    updateUp(keyCode: number) {
        // nothing happens for eraser tool
    }

    // mouse down with pencil in hand
    down(position: Point) {
        // in case we changed tool while the mouse was down
        this.ignoreNextUp = false;

        // the pencil should affect the canvas
        this.isDown = true;

        // add the same point twice in case the mouse doesnt move
        this.currentPath.push(position);
        this.currentPath.push(position);

        this.updateProgress();

        // look for an item that intersects the eraser brush
        this.checkIfTouching();
    }

    // mouse up with pencil in hand
    up(position: Point, insideWorkspace: boolean) {
        // in case we changed tool while the mouse was down
        if (!this.ignoreNextUp) {
            // the eraser should not affect the canvas
            this.isDown = false;

            // save canvas state for undo-redo
            if (this.erasedSomething) {
                this.interaction.emitDrawingDone();

            }
            // reset
            this.erasedSomething = false;
            // look for an item that intersects the eraser brush
            this.checkIfTouching();
        }
    }

    // delete an element
    erase(el: Element) {
        if (this.selected) {
            this.render.removeChild(el.parentElement, el);
            this.erasedSomething = true;
        }
    }

    // highlights a 'g' tag by adding a clone of it as a new child
    highlight(el: Element) {
        //make sure that the element is valid and not already a clone
        if (!(this.selected && el.firstElementChild && !el.firstElementChild.classList.contains('clone'))) {
            return;
        }

        // create a clone of the element
        let clone: Element = this.render.createElement('g', 'http://www.w3.org/2000/svg');
        (clone as HTMLElement).innerHTML = el.innerHTML;

        // iterate on every children of the element
        for (let i = 0; i < el.childElementCount; i++) {
            // remove the ones that should not be highlighted
            if (el.children[i].classList.contains("invisiblePath")) {
                this.render.removeChild(clone, clone.children[i]);
            }
            // increase the stroke-width of the clone so it can be visible behind the original
            let originalWidth: string | null = (el.children[i] as HTMLElement).getAttribute('stroke-width');
            let originalWidthNumber = originalWidth ? +originalWidth : 0;
            let wider: number = Math.max(10, originalWidthNumber + 10);
            this.render.setAttribute(clone.children[i], 'stroke-width', `${wider}`);

            // set the color of the clone
            let originalStrokeColor: string | null = (el.children[i] as HTMLElement).getAttribute('stroke');
            let originalFillColor: string | null = (el.children[i] as HTMLElement).getAttribute('fill');
            let refcolor: string | null = originalStrokeColor != 'none' ? originalStrokeColor : originalFillColor;
            // chose the perfect red color for maximum visibility
            let originalStrokeRGB: [number, number, number] = [0, 0, 0];
            if (refcolor && refcolor != 'none') {
                originalStrokeRGB[0] = parseInt(refcolor[1] + refcolor[2], 16);
                originalStrokeRGB[1] = parseInt(refcolor[3] + refcolor[4], 16);
                originalStrokeRGB[2] = parseInt(refcolor[5] + refcolor[6], 16);
            }
            // if original has a red value high enough, make it darker
            let redHighlight: number = 255;
            let originalTooRed = originalStrokeRGB[0] > (255 / 4) * 3;
            if (originalTooRed) {
                redHighlight = (originalStrokeRGB[0] / 4) * 3;
            }
            this.render.setAttribute(clone.children[i], 'stroke', `rgb(${redHighlight},0,0)`);
        }
        // mark the clone
        this.render.setAttribute(clone, 'class', 'clone');
        // insert it as a new child behind all the existing ones
        this.render.insertBefore(el, clone, el.firstElementChild);
    }

    //unhighlights the element by removing all of his "clone" children
    unhighlight(el: Element) {
        if (el.firstElementChild) {
            if (el.firstElementChild.classList.contains('clone')) {
                this.render.removeChild(el, el.firstElementChild);
            }
        }
    }

    // mouse move with pencil in hand
    move(position: Point) {
        // only if the pencil is currently affecting the canvas
        if (true) {
            // save mouse position
            this.currentPath.push(position);

            // to generate a square that connects every two points we need 3 points total at any given time [X - 0 - X]
            while (this.currentPath.length > 3) {
                this.currentPath.shift();
            }

            this.updateProgress();

            // look for an item that intersects the eraser brush
            this.checkIfTouching();
        }
    }

    // when we go from inside to outside the canvas
    goingOutsideCanvas() {
        // nothing happens since we might want to readjust the shape once back in
    }

    // when we go from outside to inside the canvas
    goingInsideCanvas() {
        // nothing happens since we just update the preview
    }

    checkIfTouching() {
        // get the canvas offset
        let canvasBox = this.canvas ? this.canvas.getBoundingClientRect() : null;
        let canvOffsetX = canvasBox ? canvasBox.left : 0;
        let canvOffsetY = canvasBox ? canvasBox.top : 0;

        // compute the eraser brush dimension
        let w = Math.max(
            this.attr.lineThickness,
            Math.abs(this.currentPath[this.currentPath.length - 1].x - this.currentPath[0].x)
        );
        let h = Math.max(
            this.attr.lineThickness,
            Math.abs(this.currentPath[this.currentPath.length - 1].y - this.currentPath[0].y)
        );

        // it's a square
        let dim = Math.max(w, h);

        let topLeft = new Point(
            this.currentPath[this.currentPath.length - 1].x - dim / 2,
            this.currentPath[this.currentPath.length - 1].y - dim / 2,
        );
        let bottomRight = new Point(topLeft.x + dim, topLeft.y + dim);

        // iterate every item (do it backwards so no shift is needed when we delete an item)
        for (let i = this.drawing.childElementCount - 1; i >= 0; i--) {

            let touching = false;
            // pencil-stroke, line-segments, etc.
            let fullItem = this.drawing.children[i];

            // item bounding box
            let itemBox = CanvasInteraction.getPreciseBorder(fullItem);
            let itemTopLeft: Point = new Point(itemBox[0][0] - canvOffsetX, itemBox[2][0] - canvOffsetY);
            let itemBottomRight: Point = new Point(itemBox[1][0] - canvOffsetX, itemBox[3][0] - canvOffsetY);

            //if the bounding boxes do not overlap, no need for edge detection
            if (!Point.rectOverlap(topLeft, bottomRight, itemTopLeft, itemBottomRight)) {
                this.unhighlight(fullItem);
                continue;
            }

            // the offset of the current item
            let objOffset: Point = ElementInfo.translate(fullItem);

            // iterate on every component of the current item for edge detection
            for (let j = 0; j < fullItem.childElementCount; j++) {
                let itemComponent = fullItem.children[j];

                // ignore non-shape components
                if (
                    itemComponent.classList.contains('clone') ||
                    itemComponent.classList.contains('noHighlights') ||
                    itemComponent.tagName == 'filter'
                ) {
                    continue;
                }

                // check the intersection between the eraser and the item component
                if (this.inProgress.firstElementChild && this.inProgress.firstElementChild.firstElementChild) {
                    let eraserElement = this.inProgress.firstElementChild.firstElementChild;
                    touching = this.checkIfPathIntersection(eraserElement, itemComponent, dim / 10, objOffset, touching)
                }
            }

            // if there is a match
            if (touching) {
                // erase if mouse down, else highlight
                if (this.isDown) {
                    this.erase(fullItem);
                } else {
                    this.highlight(fullItem);
                    // only one hightlight at a time
                    for (let k = 0; k < this.drawing.childElementCount; k++) {
                        if (k != i) {
                            this.unhighlight(this.drawing.children[k]);
                        }
                    }
                }
                break;
            }
            // no match
            else {
                // nothing should be highlighted
                this.unhighlight(fullItem);
            }
        }
    }

    // iterate on points that compose the eraser perimeter and check if they appear in the fill or stroke of the candidate
    checkIfPathIntersection(eraserElement: Element, candidateElement: Element, precision: number, objOffset: Point, touching: boolean) {

        let eraserBrush = eraserElement as SVGGeometryElement;
        let eraserPerimeter = eraserBrush.getTotalLength();

        let candidate = candidateElement as SVGGeometryElement;

        for (let v = 0; v < eraserPerimeter; v += precision) {
            let testPoint = eraserBrush.getPointAtLength(v);
            testPoint.x -= objOffset.x;
            testPoint.y -= objOffset.y;
            if (
                candidate.isPointInStroke(testPoint) ||
                (candidate.isPointInFill(testPoint) && candidateElement.getAttribute('fill') != 'none')
            ) {
                touching = true;
                break;
            }
        }
        return touching;
    }

    // mouse doubleClick with pencil in hand
    doubleClick(position: Point) {
        // since its down -> up -> down -> up -> doubleClick, nothing more happens for the pencil
    }

    // Creates an svg path that connects every points of currentPath with the pencil attributes
    createPath(p: Point[]) {
        let s = '';

        // We need at least 2 points
        if (p.length < 2) {
            return s;
        }

        // create a divider
        s = '<g style="transform: translate(0px, 0px);" name = "eraser-brush">';

        let w = Math.max(this.attr.lineThickness, Math.abs(p[p.length - 1].x - p[0].x));
        let h = Math.max(this.attr.lineThickness, Math.abs(p[p.length - 1].y - p[0].y));

        let dim = Math.max(w, h);

        s += `<rect x="${p[p.length - 1].x - dim / 2}" y="${p[p.length - 1].y - dim / 2}"`;
        s += `width="${dim}" height="${dim}"`;

        s += `fill="white"`;
        s += `stroke-width="1" stroke="black"`;

        // end the divider
        s += '</g>';

        return s;
    }
}
