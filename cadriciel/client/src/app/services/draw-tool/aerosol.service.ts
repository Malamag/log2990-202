import { Injectable } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { AerosolAttributes } from '../attributes/aerosol-attribute';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { DrawingTool } from './drawing-tool';
import { Point } from './point';

// Default attirbutes for the aerosol
const DEFAULT_EMISSION_PER_SECOND = 50;
const DEFAULT_DIAMETER = 50;

@Injectable({
    providedIn: 'root',
})

export class AerosolService extends DrawingTool {

    private attr: AerosolAttributes;

    private points: Point[]; // All points of the aerosol for this path

    private lastPoint: Point; // Last point when registering

    private path: string; // Current svg path

    private sub: Subscription; // Subscription for updating through an interval

    private insideCanvas: boolean; // True if the mouse is inside the canvas

    constructor(
        inProgess: HTMLElement,
        drawing: HTMLElement,
        selected: boolean,
        interaction: InteractionService,
        colorPick: ColorPickingService,
    ) {
        super(inProgess, drawing, selected, interaction, colorPick);
        this.attr = { emissionPerSecond: DEFAULT_EMISSION_PER_SECOND, diameter: DEFAULT_DIAMETER };
        this.updateColors();
        this.updateAttributes();
        this.points = new Array();
        this.insideCanvas = true;
    }

    updateDown(keyboard: KeyboardHandlerService): void {
        /* No defined behavior */
    }

    updateUp(keyCode: number): void {
        /* No defined behavior */
    }

    updateAttributes(): void {
        this.interaction.$aerosolAttributes.subscribe((obj: AerosolAttributes) => {
            this.attr = { emissionPerSecond: obj.emissionPerSecond, diameter: obj.diameter };
        });
    }

    // Subscribe to the updateProgress for a constant intervaled spray
    subscribe(): void {
        const INTERVAL_DIV = 1000; // interval in milliseconds
        const SRC_INTERVAL = interval(INTERVAL_DIV / this.attr.emissionPerSecond);
        // subscribe for updating with the desired interval
        this.sub = SRC_INTERVAL.subscribe(() => {
            this.updateProgress();
        });
    }

    // cancel the current progress
    cancel(): void {

        super.cancel();

        // Reinitialize insideCanvas
        this.insideCanvas = true;
    }

    // click with aerosol in hand
    down(position: Point): void {
        // in case we changed tool while the mouse was down
        this.ignoreNextUp = false;

        // the aerosol should affect the canvas
        this.isDown = true;

        // We need to positions for making a line with the invisible path
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
    up(position: Point): void {
        // in case we changed tool while the mouse was down
        if (this.ignoreNextUp) {
            return;
        }
        // the pencil should not affect the canvas
        this.isDown = false;

        // no path is created while outside the canvas
        if (this.insideCanvas) {
            // add everything to the canvas
            this.updateDrawing();
            this.sub.unsubscribe();
        }

    }

    // mouse move with aerosol in hand
    move(position: Point): void {
        // only if the aerosol is currently affecting the canvas
        if (this.isDown && this.insideCanvas) {
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
            this.up(position);
            this.isDown = true;
        }
        this.insideCanvas = false;
    }

    // when we go from outside to inside the canvas
    goingInsideCanvas(position: Point): void {
        // if currently affecting the canvas
        if (this.isDown) {
            // start new drawing
            this.down(position);
        }
        this.insideCanvas = true;
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
        // For each generated point, move to the point and put a tiny line that looks like a point
        for (const POINT of this.points) {
            dString += ` M ${POINT.x} ${POINT.y}`;
            dString += ` L ${POINT.x} ${POINT.y}`;
        }

        // Create a radius dependent of the diameter -> 1/100 of the diameter
        const DIVIDER = 100;
        const POINT_RADIUS = this.attr.diameter / DIVIDER;
        // Create the path of points
        this.path += ' <path';
        this.path += ` d="${dString}"`;
        this.path += ` stroke="${this.chosenColor.primColor}"`;
        this.path += ' stroke-linecap="round"';
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
            const RADIUS = (this.attr.diameter / 2) * Math.sqrt(Math.random());
            // Find a randomized angle in radians
            const ANGLE = Math.random() * 2 * Math.PI;

            // Push four points with same radius and changing the angle a little.
            // Seems almost as random, but has less operations to do
            for (let i = 1; i < PT_NUM && this.isDown; i++) {
                const X = this.lastPoint.x + RADIUS * Math.cos(ANGLE * i);
                const Y = this.lastPoint.y + RADIUS * Math.sin(ANGLE * i);
                this.points.push(new Point(X, Y));
            }
        }
    }
}
