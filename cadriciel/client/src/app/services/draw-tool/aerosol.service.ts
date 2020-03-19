import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { AerosolAttributes } from '../attributes/aerosol-attribute';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { DrawingTool } from './drawing-tool';
import { Point } from './point';

// Default attirbutes for the aerosol
const DEFAULTEMISSIONPERSECOND = 50;
const DEFAULTDIAMETER = 50;

@Injectable({
    providedIn: 'root',
})
export class AerosolService extends DrawingTool {
    attr: AerosolAttributes;

    points: Point[]; // All points of the aerosol for this path

    private lastPoint: Point; // Last point when registering

    private path: string; // Current svg path

    private sub: Subscription; // Subscription for updating through an interval

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
        this.points = new Array();
    }

    updateDown(keyboard: KeyboardHandlerService): void {
        /*No defined behavior  */
    }

    updateUp(keyCode: number): void {
        /*No defined behavior  */
    }

    updateAttributes(): void {
        this.interaction.$aerosolAttributes.subscribe((obj: AerosolAttributes) => {
            if (obj) {
                this.attr = { emissionPerSecond: obj.emissionPerSecond, diameter: obj.diameter };
            }
        });
    }

    subscribe(): void {
        const INTERVAL_DIV = 1000; // interval in milliseconds
        const srcInterval = interval(INTERVAL_DIV / this.attr.emissionPerSecond);
        // subscribe for updating with the desired interval
        this.sub = srcInterval.subscribe(() => {
            this.updateProgress();
        });
    }

    // click with aerosol in hand
    down(position: Point): void {
        // in case we changed tool while the mouse was down
        this.ignoreNextUp = false;

        // the aerosol should affect the canvas
        this.isDown = true;

        // add the same point twice in case the mouse doesn't move
        this.currentPath.push(position);
        this.currentPath.push(position);

        // Subscribe to an interval of updates
        this.subscribe();

        // Initialize points array for new path
        this.points = new Array();

        // Start without waiting for subscribe -> gives instant emission at first click
        this.updateProgress();
    }

    // unclick with aerosol in hand
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

    // mouse move with aerosol in hand
    move(position: Point): void {
        // only if the aerosol is currently affecting the canvas
        if (this.isDown) {
            // save mouse position
            this.currentPath.push(position);
        }
    }

    // mouse doubleClick with aerosol in hand
    doubleClick(position: Point): void {
        // since its down -> up -> down -> up -> doubleClick, nothing more happens for the aerosol
    }

    // when we go from inside to outside the canvas
    goingOutsideCanvas(position: Point): void {
        if (this.isDown) {
            // Do the same as when the mouse unclick,
            // but reassign isDown to true for goingInsideCanvas function
            this.up(position, true);
            this.isDown = true;
        }
    }

    // when we go from outside to inside the canvas
    goingInsideCanvas(position: Point): void {
        // if currently affecting the canvas
        if (this.isDown) {
            // start new drawing
            this.down(position);
        }
    }

    // Creates an svg path of multiple tiny lines with the aerosol attributes
    createPath(p: Point[]): string {
        this.lastPoint = p[p.length - 1];

        this.generatePoint();

        // create a divider
        this.path = '<g name = "aerosol" style="transform: translate(0px, 0px);" >';

        this.createInvisiblePath(p);

        // Initialize the d string attribute of the path
        let dString = '';
        const LINE_LENGTH = 1;
        // For each generated point, move to the point and put a tiny line that looks like a point
        for (const point of this.points) {
            dString += ` M ${point.x} ${point.y}`;
            dString += ` L ${point.x + LINE_LENGTH} ${point.y + LINE_LENGTH}`;
        }

        // Create a radius dependent of the diameter -> 1/100 of the diameter
        const DIVIDER = 100;
        const POINT_RADIUS = this.attr.diameter / DIVIDER;
        // Create the path of points
        this.path += ' <path';
        this.path += ` d="${dString}"`;
        this.path += ` stroke="${this.chosenColor.primColor}"`;
        this.path += ' stroke-linejoin="round"';
        this.path += ` stroke-width="${POINT_RADIUS}"`;
        this.path += ' fill="none" /> </g>';

        return this.path;
    }

    // Create an invisible path for the selection of the eraser
    // for it not having to highlight every lines of the aerosol path
    createInvisiblePath(p: Point[]): void {
        // start the path
        this.path += ' <path name="invisiblePath" d="';
        // move to the first point
        this.path += `M ${p[0].x} ${p[0].y} `;
        // for each succeding point, connect it with a line
        for (let i = 1; i < p.length; i++) {
            this.path += `L ${p[i].x} ${p[i].y} `;
        }
        // finish d path
        this.path += ' " ';

        // set render attributes
        this.path += ` stroke="none" stroke-width="${this.attr.diameter}"`;
        this.path += ' fill="none" stroke-linecap="round" stroke-linejoin="round" />';
    }

    generatePoint(): void {
        const PT_NUM = 5;
        const DEPENDENT_PT_NUM = this.attr.diameter / PT_NUM;

        // Generate a number of points depending on the diameter of the circle
        for (let j = 1; j < DEPENDENT_PT_NUM && this.isDown; j++) {
            // Find a randomized radius. sqrt(random) is for not having more points in the middle of the circle
            const radius = (this.attr.diameter / 2) * Math.sqrt(Math.random());
            // Find a randomized angle in radians
            const angle = Math.random() * 2 * Math.PI;

            // Push four points with same radius and changing the angle a little.
            // Seems almost as random, but has less operations to do
            for (let i = 1; i < PT_NUM && this.isDown; i++) {
                const x = this.lastPoint.x + radius * Math.cos(angle * i);
                const y = this.lastPoint.y + radius * Math.sin(angle * i);
                this.points.push(new Point(x, y));
            }
        }
    }
}
