import { Injectable, Renderer2 } from '@angular/core';
import { ToolsAttributes } from '../attributes/tools-attribute';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { DrawingTool } from './drawing-tool';
import { Point } from './point';
import { CanvasInteraction } from './canvas-interaction.service';
import { ElementInfo } from './element-info.service';

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
        // keyboard has no effect on color-editor
    }

    // updating on key up
    updateUp(keyCode: number) {
        // nothing happens for color-editor tool
    }

    // mouse down with color-editor in hand
    down(position: Point, insideWorkspace: boolean, isRightClick: boolean) {
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
    up(position: Point, insideWorkspace: boolean) {
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
    changeColor(el: Element) {
        if (this.selected) {
            // iterate on every component of the element
            for (let i = 0; i < el.childElementCount; i++) {
                let itemComponent = el.children[i];
                // ignore componenent that do not have a color to change
                if (itemComponent.tagName == 'filter') {
                    continue;
                }
                if (this.isRightClick) {
                    this.changeBorder(itemComponent as HTMLElement);
                } else {
                    this.changeFill(itemComponent as HTMLElement);
                }
            }
        }
    }

    // change the stroke color of an element
    changeBorder(el: HTMLElement) {
        if (el.getAttribute('stroke') != this.chosenColor.secColor && el.getAttribute('stroke') != 'none') {
            this.render.setAttribute(el, 'stroke', this.chosenColor.secColor);
            this.changedColorOnce = true;
        }
    }

    // change the fill color of an element
    changeFill(el: HTMLElement) {
        if (el.getAttribute('fill') != this.chosenColor.primColor && el.getAttribute('fill') != 'none') {
            this.render.setAttribute(el, 'fill', this.chosenColor.primColor);
            this.changedColorOnce = true;
        }
    }

    // mouse move with color-editor in hand
    move(position: Point) {
        // save mouse position
        this.currentPath.push(position);

        // to generate a square that connects every two points we need 3 points total at any given time [X - 0 - X]
        while (this.currentPath.length > 3) {
            this.currentPath.shift();
        }

        this.updateProgress();

        // look for an item that intersects the color-editor brush
        this.checkIfTouching();
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

        // compute the color-editor brush dimension
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

        // iterate every item
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
                continue;
            }

            // the offset of the current item
            let objOffset: Point = ElementInfo.translate(fullItem);

            // iterate on every component of the current item for edge detection
            for (let j = 0; j < fullItem.childElementCount; j++) {
                let itemComponent = fullItem.children[j];

                // ignore useless or non-shape components
                if(itemComponent.classList.contains('aerosolPoints')) {break;}
                if (
                    itemComponent.classList.contains('clone') ||
                    itemComponent.classList.contains('noHighlights') ||
                    itemComponent.tagName == 'filter'
                ) {
                    continue;
                }

                // check the intersection between the color-editor and the item component
                if (this.inProgress.firstElementChild && this.inProgress.firstElementChild.firstElementChild) {
                    let colorEditorElement = this.inProgress.firstElementChild.firstElementChild;
                    touching = this.checkIfPathIntersection(colorEditorElement, itemComponent, dim / 10, objOffset, touching)
                }
            }

            // if there is a match
            if (touching) {
                if (this.isDown) {
                    this.changeColor(fullItem);
                }
                break;
            }
        }
    }

    // iterate on points that compose the color-editor perimeter and check if they appear in the fill or stroke of the candidate
    checkIfPathIntersection(colorEditorElement: Element, candidateElement: Element, precision: number, objOffset: Point, touching: boolean) {

        let colorEditorBrush = colorEditorElement as SVGGeometryElement;
        let colorEditorPerimeter = colorEditorBrush.getTotalLength();

        let candidate = candidateElement as SVGGeometryElement;

        for (let v = 0; v < colorEditorPerimeter; v += precision) {
            let testPoint = colorEditorBrush.getPointAtLength(v);
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

    // mouse doubleClick with color-editor in hand
    doubleClick(position: Point) {
        // since its down -> up -> down -> up -> doubleClick, nothing more happens for the color-editor
    }

    // Creates an svg path that connects every points of currentPath with the color-editor attributes
    createPath(p: Point[]) {
        let s = '';

        // We need at least 2 points
        if (p.length < 2) {
            return s;
        }

        // create a divider
        s = '<g style="transform: translate(0px, 0px);" name = "colorEditor-brush">';

        let w = Math.max(10, Math.abs(p[p.length - 1].x - p[0].x));
        let h = Math.max(10, Math.abs(p[p.length - 1].y - p[0].y));

        let dim = Math.max(w, h);

        s += `<rect x="${p[p.length - 1].x - dim / 2}" y="${p[p.length - 1].y - dim / 2}"`;
        s += `width="${dim}" height="${dim}"`;

        s += `fill="${this.chosenColor.primColor}"`;
        s += `stroke-width="3" stroke="${this.chosenColor.secColor}"`;

        // end the divider
        s += '</g>';

        return s;
    }
}
