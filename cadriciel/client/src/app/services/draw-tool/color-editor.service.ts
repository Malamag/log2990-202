import { Injectable, Renderer2 } from '@angular/core';
import { ToolsAttributes } from '../attributes/tools-attribute';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { DrawingTool } from './drawing-tool';
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

    isRightClick: boolean;

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

        this.inProgress.style.pointerEvents = 'none';

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
        // keyboard has no effect on pencil
    }

    // updating on key up
    updateUp(keyCode: number) {
        // nothing happens for eraser tool
    }

    // mouse down with pencil in hand
    down(position: Point, insideWorkspace: boolean, isRightClick: boolean) {
        this.isRightClick = isRightClick;

        // in case we changed tool while the mouse was down
        this.ignoreNextUp = false;

        // the pencil should affect the canvas
        this.isDown = true;

        // add the same point twice in case the mouse doesnt move
        this.currentPath.push(position);
        this.currentPath.push(position);

        this.updateProgress();

        this.checkIfTouching();
    }

    // mouse up with pencil in hand
    up(position: Point, insideWorkspace: boolean) {
        // in case we changed tool while the mouse was down
        if (!this.ignoreNextUp) {
            // the pencil should not affect the canvas
            this.isDown = false;

            if (this.changedColorOnce) {
                this.interaction.emitDrawingDone();
            }
            this.changedColorOnce = false;
        }
    }

    changeColor(el: Element) {
        if (this.selected) {
            console.log(this.isRightClick);
            for (let i = 0; i < el.childElementCount; i++) {
                let current = el.children[i];
                if (current.tagName == 'filter') {
                    continue;
                }
                if (this.isRightClick) {
                    this.changeBorder(current as HTMLElement);
                } else {
                    this.changeFill(current as HTMLElement);
                }
            }
        }
    }

    changeBorder(el: HTMLElement) {
        if (el.getAttribute('stroke') != this.chosenColor.secColor && el.getAttribute('stroke') != 'none') {
            this.render.setAttribute(el, 'stroke', this.chosenColor.secColor);
            this.changedColorOnce = true;
        }
    }

    changeFill(el: HTMLElement) {
        if (el.getAttribute('fill') != this.chosenColor.primColor && el.getAttribute('fill') != 'none') {
            this.render.setAttribute(el, 'fill', this.chosenColor.primColor);
            this.changedColorOnce = true;
        }
    }

    // mouse move with pencil in hand
    move(position: Point) {
        // only if the pencil is currently affecting the canvas
        if (true) {
            // save mouse position
            this.currentPath.push(position);

            while (this.currentPath.length > 3) {
                this.currentPath.shift();
            }

            this.updateProgress();

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
        let w = Math.max(10, Math.abs(this.currentPath[this.currentPath.length - 1].x - this.currentPath[0].x));
        let h = Math.max(10, Math.abs(this.currentPath[this.currentPath.length - 1].y - this.currentPath[0].y));

        let dim = Math.max(w, h);

        for (let i = this.drawing.childElementCount - 1; i >= 0; i--) {
            let touching = false;
            let firstChild = this.drawing.children[i];

            let objOffset = (this.drawing.children[i] as HTMLElement).style.transform;
            let s = objOffset ? objOffset.split(',') : '';
            let objOffsetX = +s[0].replace(/[^\d.-]/g, '');
            let objOffsetY = +s[1].replace(/[^\d.-]/g, '');

            for (let j = 0; j < firstChild.childElementCount; j++) {
                let secondChild = firstChild.children[j];

                let width = (secondChild as HTMLElement).getAttribute('stroke-width');
                let offset = 0;
                if (width) {
                    offset = +width;
                } // only to be able to run the tests
                else {
                    offset = offset;
                }
                //let dim2 = 3 + offset;

                if (
                    secondChild.classList.contains('clone') ||
                    secondChild.classList.contains('noHighlights') ||
                    secondChild.tagName == 'filter'
                ) {
                    continue;
                }

                if (this.inProgress.firstElementChild) {
                    let test = this.inProgress.firstElementChild.firstElementChild as SVGGeometryElement;
                    let l = test.getTotalLength();

                    let path = secondChild as SVGGeometryElement;

                    for (let v = 0; v < l; v += dim / 10) {
                        let testPoint = test.getPointAtLength(v);
                        testPoint.x -= objOffsetX;
                        testPoint.y -= objOffsetY;
                        if (
                            path.isPointInStroke(testPoint) ||
                            (path.isPointInFill(testPoint) && secondChild.getAttribute('fill') != 'none')
                        ) {
                            touching = true;
                            break;
                        }
                    }
                }
            }

            if (touching) {
                if (this.isDown) {
                    this.changeColor(firstChild);
                }
                break;
            }
        }
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
