import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { AerosolAttributes } from '../attributes/aerosol-attribute';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { DrawingTool } from './drawing-tool';
import { Point } from './point';

const DEFAULTEMISSIONPERSECOND = 50;
const DEFAULTDIAMETER = 50;

@Injectable({
    providedIn: 'root',
})
export class AerosolService extends DrawingTool {
    constructor(
        inProgess: HTMLElement,
        drawing: HTMLElement,
        selected: boolean,
        interaction: InteractionService,
        colorPick: ColorPickingService,
    ) {
        super(inProgess, drawing, selected, interaction, colorPick);
        this.attr = { emissionPerSecond: DEFAULTEMISSIONPERSECOND, diameter: DEFAULTDIAMETER };
        this.updateColors();
        this.updateAttributes();
        this.lastPoint = new Point(0, 0);
        this.points = new Array();
    }
    private attr: AerosolAttributes;

    private lastPoint: Point;

    private points: Point[];

    private path: string;

    private sub: Subscription;
    
    updateDown(keyboard: KeyboardHandlerService): void {
        /*No defined behavior  */
    }

    updateUp(keyCode: number): void {
        /*No defined behavior  */
    }

    updateAttributes(): void {
        this.interaction.$aerosolAttributes.subscribe((obj) => {
            if (obj) {
                this.attr = new AerosolAttributes(obj.emissionPerSecond, obj.diameter);
            }
        });
    }

    subscribe(): void {
        const INTERVAL_DIV = 1000;
        const srcInterval = interval(INTERVAL_DIV / this.attr.emissionPerSecond);
        this.sub = srcInterval.subscribe(() => {
            if (this.isDown) {
                this.updateProgress();
            } else {
                this.sub.unsubscribe();
            }
        });
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

        this.subscribe();

        this.lastPoint = new Point(0, 0);
        this.points = new Array();

        this.updateProgress();
    }

    // mouse up with pencil in hand
    up(position: Point, insideWorkspace: boolean): void {
        // in case we changed tool while the mouse was down
        if (!this.ignoreNextUp) {
            // the pencil should not affect the canvas
            this.isDown = false;

            // no path is created while outside the canvas
            if (insideWorkspace) {
                // add everything to the canvas
                this.updateDrawing();
                this.sub.unsubscribe();
            }
        }
    }

    // mouse move with pencil in hand
    move(position: Point): void {
        // only if the pencil is currently affecting the canvas
        if (this.isDown) {
            // save mouse position
            this.currentPath.push(position);

            // this.updateProgress();
        }
    }

    // mouse doubleClick with pencil in hand
    doubleClick(position: Point): void {
        // since its down -> up -> down -> up -> doubleClick, nothing more happens for the pencil
    }

    // Creates an svg path that connects every points of currentPath with the pencil attributes
    createPath(p: Point[]): string {
        this.lastPoint = p[p.length - 1];

        this.generatePoint();

        // create a divider
        this.path = '<g name = "aerosol" style="transform: translate(0px, 0px);" >';

        // start the path
        this.path += ' <path d="';
        // move to the first point
        this.path += `M ${p[0].x} ${p[0].y} `;
        // for each succeding point, connect it with a line
        for (let i = 1; i < p.length; i++) {
            this.path += `L ${p[i].x} ${p[i].y} `;
        }
        // set render attributes
        this.path += ` stroke="none" stroke-width="${this.attr.diameter}"`;
        this.path += ' fill="none" stroke-linecap="round" stroke-linejoin="round" />';

        const RADIUS_DIV = 100;

        const pointRadius = this.attr.diameter / RADIUS_DIV;

        // this.path = "";
        let dString = '';
        const LINE_LENGTH = 1;
        // tslint:disable-next-line: prefer-for-of -> we want to keep track of the index
        for (let i = 0; i < this.points.length; i++) {
            dString += ` M ${this.points[i].x} ${this.points[i].y}`;
            dString += ` L ${this.points[i].x + LINE_LENGTH} ${this.points[i].y + LINE_LENGTH}`;
        }
        dString += ' z';
        // this.points = new Array();
        this.path += ' <path';
        this.path += ` d="${dString}"`;
        this.path += ` stroke="${this.chosenColor.primColor}"`;
        this.path += ' stroke-linejoin="round"';
        this.path += ` stroke-width="${pointRadius}"`;
        this.path += ' fill="none" /> </g>';

        return this.path;
    }

    generatePoint(): void {
        const PT_NUM = 5;
        if (this.isDown) {
            for (let j = 1; j < this.attr.diameter / 5 && this.isDown; j++) {
                const r = (this.attr.diameter / 2) * Math.sqrt(Math.random());
                const angle = Math.random() * 2 * Math.PI;
                for (let i = 1; i < PT_NUM; i++) {
                    const x = this.lastPoint.x + r * Math.cos(angle * i);
                    const y = this.lastPoint.y + r * Math.sin(angle * i);
                    this.points.push(new Point(x, y));
                }
            }
        }
    }
}
