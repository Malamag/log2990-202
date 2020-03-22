import { Injectable, Renderer2 } from '@angular/core';
import { ToolsAttributes } from '../attributes/tools-attribute';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { DrawingTool } from './drawing-tool';
import { Point } from './point';

const DEFAULT_LINE_THICKNESS = 5;
const DEFAULT_TEXTURE = 0;

@Injectable({
    providedIn: 'root',
})

export class EraserService extends DrawingTool {
    render: Renderer2;
    attr: ToolsAttributes;

    foundAnItem: boolean;

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

        this.foundAnItem = false;

        this.erasedSomething = false;

        this.inProgress.style.pointerEvents = 'none';

        window.addEventListener('newDrawing', (e: Event) => {
            for (let i = 0; i < this.drawing.childElementCount; i++) {
                const EL = this.drawing.children[i];
                const STATUS = EL.getAttribute('isListening2');
                this.render.setAttribute(EL, 'checkPreciseEdge', 'true');
                if (STATUS !== 'true') {
                    this.render.setAttribute(EL, 'isListening2', 'true');
                    this.render.listen(EL, 'mousemove', () => {
                        // console.log("enter");
                        if (!this.foundAnItem) {
                            this.highlight(EL);
                            this.render.setAttribute(EL, 'checkPreciseEdge', 'false');
                            this.foundAnItem = true;
                            if (this.isDown) {
                                this.erase(EL);
                                this.foundAnItem = false;
                            }
                        }
                    });
                    this.render.listen(EL, 'mouseleave', () => {
                        // console.log("leaving");
                        if (this.foundAnItem) {
                            this.unhighlight(EL);
                            this.foundAnItem = false;
                            this.render.setAttribute(EL, 'checkPreciseEdge', 'true');
                        }
                    });
                    this.render.listen(EL, 'mousedown', () => {
                        // console.log("click");
                        this.erase(EL);
                        this.foundAnItem = false;
                        this.render.setAttribute(EL, 'checkPreciseEdge', 'true');
                    });
                    this.render.listen(EL, 'mouseup', () => {
                        if (!this.foundAnItem) {
                            this.highlight(EL);
                            this.render.setAttribute(EL, 'checkPreciseEdge', 'false');
                            this.foundAnItem = false;
                        }
                    });
                }
            }
        });

        window.addEventListener('toolChange', (e: Event) => {
            this.foundAnItem = false;
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
        // keyboard has no effect on pencil
    }

    // updating on key up
    updateUp(keyCode: number): void {
        // nothing happens for eraser tool
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

        this.updateProgress();

        this.checkIfTouching();
    }

    // mouse up with pencil in hand
    up(position: Point, insideWorkspace: boolean): void {
        // in case we changed tool while the mouse was down
        if (!this.ignoreNextUp) {
            // the pencil should not affect the canvas
            this.isDown = false;

            if (this.erasedSomething) {
                this.interaction.emitDrawingDone();
                // console.log("now");
            }
            this.erasedSomething = false;
        }
    }

    erase(el: Element): void {
        if (this.selected) {
            this.render.removeChild(el.parentElement, el);
            this.erasedSomething = true;
        }
    }

    // highlights a 'g' tag by adding a clone as a child
    highlight(el: Element): void {
        if (this.selected && el.firstElementChild && !el.firstElementChild.classList.contains('clone')) {
            const CLONE: Element = this.render.createElement('g', 'http://www.w3.org/2000/svg');
            (CLONE as HTMLElement).innerHTML = el.innerHTML;
            for (let i = 0; i < el.childElementCount; i++) {
                const ORIGINAL_WIDTH: string | null = (el.children[i] as HTMLElement).getAttribute('stroke-width');
                const ORIGINAL_WIDTH_NUMBER = ORIGINAL_WIDTH ? + ORIGINAL_WIDTH : 0;
                const WIDER: number = Math.max(10, ORIGINAL_WIDTH_NUMBER + 10);
                this.render.setAttribute(CLONE.children[i], 'stroke-width', `${WIDER}`);

                // console.log(window.getComputedStyle(el.children[i]).getPropertyValue("stroke"));
                const ORIGINAL_STROKE_COLOR: string | null = (el.children[i] as HTMLElement).getAttribute('stroke');
                const ORIGINAL_FILL_COLOR: string | null = (el.children[i] as HTMLElement).getAttribute('fill');
                // 248 256
                const REF_COLOR: string | null = ORIGINAL_STROKE_COLOR !== 'none' ? ORIGINAL_STROKE_COLOR : ORIGINAL_FILL_COLOR;

                const ORIGINAL_STROKE_RGB: [number, number, number] = [0, 0, 0];
                if (REF_COLOR && REF_COLOR !== 'none') {
                    ORIGINAL_STROKE_RGB[0] = parseInt(REF_COLOR[1] + REF_COLOR[2], 16);
                    ORIGINAL_STROKE_RGB[1] = parseInt(REF_COLOR[3] + REF_COLOR[4], 16);
                    ORIGINAL_STROKE_RGB[2] = parseInt(REF_COLOR[5] + REF_COLOR[6], 16);
                }

                let redHighlight = 255;
                const ORIGINAL_TO_RED = ORIGINAL_STROKE_RGB[0] > (255 / 4) * 3;
                if (ORIGINAL_TO_RED) {
                    redHighlight = (ORIGINAL_STROKE_RGB[0] / 4) * 3;
                }

                this.render.setAttribute(CLONE.children[i], 'stroke', `rgb(${redHighlight},0,0)`);
            }
            this.render.setAttribute(CLONE, 'class', 'clone');
            this.render.insertBefore(el, CLONE, el.firstElementChild);
        }
    }

    // unhighlights the element by removing all of his "clone" children
    unhighlight(el: Element): void {
        if (el.firstElementChild) {
            if (el.firstElementChild.classList.contains('clone')) {
                this.render.removeChild(el, el.firstElementChild);
            }
        }
    }

    // mouse move with pencil in hand
    move(position: Point): void {
        // console.log(this.erasedSomething);

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
    goingOutsideCanvas(): void {
        // nothing happens since we might want to readjust the shape once back in
    }

    // when we go from outside to inside the canvas
    goingInsideCanvas(): void {
        // nothing happens since we just update the preview
    }

    checkIfTouching(): void {
        const CANV = this.canvas;
        const CANVAS_BOX = CANV ? CANV.getBoundingClientRect() : null;
        const CANV_OFFSET_X = CANVAS_BOX ? CANVAS_BOX.left : 0;
        const CANV_OFFSET_Y = CANVAS_BOX ? CANVAS_BOX.top : 0;

        // console.log(`${canvOffsetX}, ${canvOffsetY}`);

        const W = Math.max(10, Math.abs(this.currentPath[this.currentPath.length - 1].x - this.currentPath[0].x));
        const H = Math.max(10, Math.abs(this.currentPath[this.currentPath.length - 1].y - this.currentPath[0].y));

        const DIM = Math.max(W, H);

        const TL = new Point(this.currentPath[this.currentPath.length - 1].x - DIM / 2, this.currentPath[this.currentPath.length - 1].y - DIM / 2);
        const BR = new Point(TL.x + DIM, TL.y + DIM);

        for (let i = 0; i < this.drawing.childElementCount; i++) {
            let touching = false;
            const FIRST_CHILD = this.drawing.children[i];

            // item bounding box
            const ITEM_BOX = FIRST_CHILD.getBoundingClientRect();
            const ITEM_TOP_LEFT: Point = new Point(ITEM_BOX.left - CANV_OFFSET_X, ITEM_BOX.top - CANV_OFFSET_Y);
            const ITEM_BOTTOM_RIGHT: Point = new Point(ITEM_BOX.right - CANV_OFFSET_X, ITEM_BOX.bottom - CANV_OFFSET_Y);

            if (!Point.rectOverlap(TL, BR, ITEM_TOP_LEFT, ITEM_BOTTOM_RIGHT)) {
                this.unhighlight(FIRST_CHILD);
                continue;
            }

            if (FIRST_CHILD.getAttribute('checkPreciseEdge') !== 'true') {
                continue;
            }

            const OBJ_OFFSET = (this.drawing.children[i] as HTMLElement).style.transform;
            const S = OBJ_OFFSET ? OBJ_OFFSET.split(',') : '';
            const OBJ_OFFSET_X = + S[0].replace(/[^\d.-]/g, '');
            const OBJ_OFFSET_Y = + S[1].replace(/[^\d.-]/g, '');

            for (let j = 0; j < FIRST_CHILD.childElementCount; j++) {
                const SECOND_CHILD = FIRST_CHILD.children[j];

                const WIDTH = (SECOND_CHILD as HTMLElement).getAttribute('stroke-width');
                let offset = 0;
                if (WIDTH) {
                    offset = +WIDTH;
                }

                const dim2 = 3 + offset;

                if (SECOND_CHILD.classList.contains('clone') || SECOND_CHILD.tagName == 'filter') {
                    continue;
                }

                const PATH = SECOND_CHILD as SVGPathElement;
                const LENGTH = PATH.getTotalLength();
                const INC = LENGTH / 300;

                const CLOSEST: [Point, number] = [new Point(-1, -1), 10000];
                for (let a = 0; a < LENGTH; a += INC) {
                    const CANDIDATE = new Point(PATH.getPointAtLength(a).x + OBJ_OFFSET_X, PATH.getPointAtLength(a).y + OBJ_OFFSET_Y);
                    const DIST = Point.distance(this.currentPath[this.currentPath.length - 1], CANDIDATE);
                    if (DIST < CLOSEST[1]) {
                        CLOSEST[0] = CANDIDATE;
                        CLOSEST[1] = DIST;
                    }
                }

                if (true) {
                    const GOOD = CLOSEST[0];
                    // console.log(good);
                    const TLP = new Point(GOOD.x - dim2 / 2, GOOD.y - dim2 / 2);
                    const BRP = new Point(GOOD.x + dim2 / 2, GOOD.y + dim2 / 2);
                    if (Point.rectOverlap(TLP, BRP, TL, BR)) {
                        touching = true;
                        break;
                    }
                }

                // for(let a = 0; a < points.length; a++){

                // }

                if (touching) {
                    break;
                }
            }

            // console.log(touching);
            if (touching) {
                if (this.isDown) {
                    this.erase(FIRST_CHILD);
                } else {
                    this.highlight(FIRST_CHILD);
                }
            } else {
                this.unhighlight(FIRST_CHILD);
            }
        }
    }

    // mouse doubleClick with pencil in hand
    doubleClick(position: Point): void {
        // since its down -> up -> down -> up -> doubleClick, nothing more happens for the pencil
    }

    // Creates an svg path that connects every points of currentPath with the pencil attributes
    createPath(p: Point[]): string {
        let s = '';

        // We need at least 2 points
        if (p.length < 2) {
            return s;
        }

        // create a divider
        s = '<g style="transform: translate(0px, 0px);" name = "eraser-brush">';

        const W = Math.max(10, Math.abs(p[p.length - 1].x - p[0].x));
        const H = Math.max(10, Math.abs(p[p.length - 1].y - p[0].y));

        const DIM = Math.max(W, H);

        s += `<rect x="${p[p.length - 1].x - DIM / 2}" y="${p[p.length - 1].y - DIM / 2}"`;
        s += `width="${DIM}" height="${DIM}"`;

        s += 'fill="white"';
        s += 'stroke-width="1" stroke="black"';

        // end the divider
        s += '</g>';

        return s;
    }
}
