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

export class ColorEditorService extends DrawingTool {
    render: Renderer2;
    attr: ToolsAttributes;

    foundAnItem: boolean;

    erasedSomething: boolean;

    canvas: HTMLElement;

    isRightClick: boolean;

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

        this.isRightClick = false;

        window.addEventListener('newDrawing', (e: Event) => {
            for (let i = 0; i < this.drawing.childElementCount; i++) {
                const EL = this.drawing.children[i];
                const STATUS = EL.getAttribute('isListening3');
                this.render.setAttribute(EL, 'checkPreciseEdge2', 'true');
                if (STATUS !== 'true') {
                    this.render.setAttribute(EL, 'isListening3', 'true');
                    this.render.listen(EL, 'mousemove', () => {
                        // console.log("enter");
                        if (!this.foundAnItem) {
                            // this.highlight(el);
                            this.render.setAttribute(EL, 'checkPreciseEdge2', 'false');
                            this.foundAnItem = true;
                            if (this.isDown) {
                                this.changeColor(EL);
                                this.foundAnItem = false;
                            }
                        }
                    });
                    this.render.listen(EL, 'mouseleave', () => {
                        // console.log("leaving");
                        if (this.foundAnItem) {
                            // this.unhighlight(el);
                            this.foundAnItem = false;
                            this.render.setAttribute(EL, 'checkPreciseEdge2', 'true');
                        }
                    });
                    this.render.listen(EL, 'mousedown', () => {
                        this.changeColor(EL);
                        this.foundAnItem = false;
                        this.render.setAttribute(EL, 'checkPreciseEdge2', 'true');
                    });
                    this.render.listen(EL, 'mouseup', () => {
                        if (!this.foundAnItem) {
                            // this.highlight(el);
                            this.render.setAttribute(EL, 'checkPreciseEdge2', 'false');
                            this.foundAnItem = false;
                        }
                    });
                }
            }
        });

        window.addEventListener('toolChange', (e: Event) => {
            this.foundAnItem = false;
            for (let i = 0; i < this.drawing.childElementCount; i++) {
                // this.unhighlight(this.drawing.children[i]);
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
    down(position: Point, insideWorkspace: boolean, isRightClick: boolean): void {
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

    changeColor(el: Element): void {
        if (this.selected) {
            for (let i = 0; i < el.childElementCount; i++) {
                const CURRENT = el.children[i];
                if (CURRENT.tagName === 'filter') {
                    continue;
                }
                if (this.isRightClick) {
                    this.changeBorder(CURRENT as HTMLElement);
                } else {
                    this.changeFill(CURRENT as HTMLElement);
                }
            }
        }
    }

    changeBorder(el: HTMLElement): void {
        const NEW_COLOR = el.getAttribute('stroke') !== 'none' ? this.chosenColor.secColor : '';
        this.render.setAttribute(el, 'stroke', NEW_COLOR);
    }

    changeFill(el: HTMLElement): void {
        const NEW_COLOR = el.getAttribute('fill') !== 'none' ? this.chosenColor.primColor : '';
        this.render.setAttribute(el, 'fill', NEW_COLOR);
    }

    // mouse move with pencil in hand
    move(position: Point): void {
        // console.log(this.erasedSomething);

        // only if the pencil is currently affecting the canvas
        const MAX_LEN = 3;
        if (true) {
            // save mouse position
            this.currentPath.push(position);

            while (this.currentPath.length > MAX_LEN) {
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
        const OFFSET = 10;

        const W = Math.max(OFFSET, Math.abs(this.currentPath[this.currentPath.length - 1].x - this.currentPath[0].x));
        const H = Math.max(OFFSET, Math.abs(this.currentPath[this.currentPath.length - 1].y - this.currentPath[0].y));

        const DIM = Math.max(W, H);

        const TL = new Point(this.currentPath[this.currentPath.length - 1].x - DIM / 2, this.currentPath[this.currentPath.length - 1].y - DIM / 2);
        const BR = new Point(TL.x + DIM, TL.y + DIM);

        for (let i = 0; i < this.drawing.childElementCount; i++) {
            let touching = false;
            const firstChild = this.drawing.children[i];

            // item bounding box
            const itemBox = firstChild.getBoundingClientRect();
            const itemTopLeft: Point = new Point(itemBox.left - CANV_OFFSET_X, itemBox.top - CANV_OFFSET_Y);
            const itemBottomRight: Point = new Point(itemBox.right - CANV_OFFSET_X, itemBox.bottom - CANV_OFFSET_Y);

            if (!Point.rectOverlap(TL, BR, itemTopLeft, itemBottomRight)) {
                // this.unhighlight(firstChild);
                continue;
            }

            if (firstChild.getAttribute('checkPreciseEdge') !== 'true') {
                continue;
            }

            const OBJ_OFFSET = (this.drawing.children[i] as HTMLElement).style.transform;
            const S = OBJ_OFFSET ? OBJ_OFFSET.split(',') : '';
            const OBJ_OFFSET_X = +S[0].replace(/[^\d.-]/g, '');
            const OBJ_OFFSET_Y = +S[1].replace(/[^\d.-]/g, '');

            for (let j = 0; j < firstChild.childElementCount; j++) {
                const secondChild = firstChild.children[j];

                const width = (secondChild as HTMLElement).getAttribute('stroke-width');
                let offset = 0;
                if (width) {
                    offset = +width;
                }

                const DIM2 = 3 + offset;

                if (secondChild.classList.contains('clone') || secondChild.tagName === 'filter') {
                    continue;
                }

                const PATH = secondChild as SVGPathElement;
                const LENGTH = PATH.getTotalLength();
                const INC = LENGTH / 300;

                const BAD_COORD = -1;
                const MAX = 10000;
                const CLOSEST: [Point, number] = [new Point(BAD_COORD, BAD_COORD), MAX];
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
                    const TLP = new Point(GOOD.x - DIM2 / 2, GOOD.y - DIM2 / 2);
                    const BRP = new Point(GOOD.x + DIM2 / 2, GOOD.y + DIM2 / 2);
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
                    this.changeColor(firstChild);
                } else {
                    // this.highlight(firstChild);
                }
            } else {
                // this.unhighlight(firstChild);
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

        const OFFSET = 10;
        // create a divider
        s = '<g style="transform: translate(0px, 0px);" name = "eraser-brush">';

        const W = Math.max(OFFSET, Math.abs(p[p.length - 1].x - p[0].x));
        const H = Math.max(OFFSET, Math.abs(p[p.length - 1].y - p[0].y));

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
