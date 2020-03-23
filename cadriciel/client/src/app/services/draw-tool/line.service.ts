import { Injectable } from '@angular/core';
import { LineAttributes } from '../attributes/line-attributes';
import { ColorPickingService } from '../colorPicker/color-picking.service';
import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { InteractionService } from '../service-interaction/interaction.service';
import { DrawingTool } from './drawing-tool';
import { Point } from './point';

const DEFAULT_JUNCTION = true;
const DEFAULT_JUNCTION_RADIUS = 6;
const DEFAULT_LINE_THICKNESS = 5;
const FULL_ROTATION = 360;
const HALF_ROTATION = 180;
const ONE_FOUR_ROTATION = 90;
const ONE_HEIGHT_ROTATION = 45;
const THREE_FOUR_ROTATION  = 270;
const THREE_EIGHT_ROTATION = 135;
const FIVE_EIGHT_ROTATION = 225;
const SEVEN_EIGHT_ROTATION  = 315;

@Injectable({
    providedIn: 'root',
})

export class LineService extends DrawingTool {
    forcedAngle: boolean;
    currentPos: Point;
    attr: LineAttributes;

    constructor(
        inProgess: HTMLElement,
        drawing: HTMLElement,
        selected: boolean,
        interaction: InteractionService,
        colorPick: ColorPickingService) {
        super(inProgess, drawing, selected, interaction, colorPick);
        this.attr = { junction: DEFAULT_JUNCTION, lineThickness: DEFAULT_LINE_THICKNESS, junctionDiameter: DEFAULT_JUNCTION_RADIUS };
        this.forcedAngle = false;
        this.currentPos = new Point(0, 0);
        this.updateAttributes();
        this.updateColors();
    }

    updateAttributes(): void {
        this.interaction.$lineAttributes.subscribe((obj) => {
            if (obj) {
                this.attr = { junction: obj.junction, lineThickness: obj.lineThickness, junctionDiameter: obj.junctionDiameter };
            }
        });
    }
    // updating on key change
    updateDown(keyboard: KeyboardHandlerService): void {
        // only if the lineTool is currently affecting the canvas
        if (this.isDown) {
            // lines are fixed at 45 degrees angle when shift is pressed
            this.forcedAngle = keyboard.shiftDown;

            // update progress, it is not a double click
            this.updateProgress(false);
            this.updateColors();
        }

        // backspace keycode
        const BCKSPACE = 8;
        if (keyboard.keyCode === BCKSPACE) {
            // always keep 2 points
            if (this.currentPath.length > 2) {
                // remove second last point
                this.currentPath[this.currentPath.length - 2] = this.currentPath[this.currentPath.length - 1];
                this.currentPath.pop();

                // update progress, it is not a double click
                this.updateProgress(false);
            }
        }

        // escape keycode
        const ESCAPE = 27;
        if (keyboard.keyCode === ESCAPE) {
            // cancel progress
            this.cancel();
        }
    }

    // updating on key up
    updateUp(keyCode: number): void {
        // nothing happens for line tool
    }

    // mouse down with lineTool in hand
    down(position: Point, mouseInsideWorkspace: boolean): void {
        // in case we changed tool while the mouse was down
        this.ignoreNextUp = false;

        // the lineTool should affect the canvas
        this.isDown = true;

        // save currentPosition for real time update when we go from forced to loose angle
        this.currentPos = position;

        // add the same point twice in case the mouse doesnt move on first point
        if (this.currentPath.length === 0) {
            this.currentPath.push(position);
        }
        this.currentPath.push(position);

        // update progress, it is not a double click
        this.updateProgress(false);
    }

    // mouse up with line in hand
    up(position: Point): void {
        // nothing happens
    }

    // mouse move with line in hand
    move(position: Point): void {
        // only if the lineTool is currently affecting the canvas
        if (this.isDown) {
            // save currentPosition for real time update when we go from forced to loose angle
            this.currentPos = position;

            // we only have one point, add a new one
            if (this.currentPath.length === 1) {
                this.currentPath.push(position);
            } else {
                this.currentPath[this.currentPath.length - 1] = position;
            }

            // update progress, it is not a double click
            this.updateProgress(false);
        }
    }

    // mouse doubleClick with line in hand
    doubleClick(position: Point, mouseInsideWorkspace: boolean): void {
        // we can only end a line inside the canvas
        if (mouseInsideWorkspace) {
            // we need 4 or more points in path because origin (1) + current (1) + double click (2) = 4 is the minimum
            const MIN_PTS = 4;
            if (this.currentPath.length >= MIN_PTS) {
                // only if double click is valid
                if (mouseInsideWorkspace) {
                    // the pencil should not affect the canvas
                    this.isDown = false;

                    if (this.currentPath.length >= 2) {
                        // Down is called twice before we get here -> remove the excess 2 points
                        this.currentPath.pop();
                        this.currentPath.pop();
                    }

                    // add everything to the canvas, it is a double click
                    this.updateDrawing(true);

                    // reset angle mode to default (loose)
                    this.forcedAngle = false;
                }
            } else {
                // we have no points -> can't start a line with a double click
                this.cancel();
            }
        }
    }

    // when we go from inside to outside the canvas
    goingOutsideCanvas(position: Point): void {
        // nothing happens since we don't want to end the preview
    }

    // when we go from outside to inside the canvas
    goingInsideCanvas(position: Point): void {
        // nothing happens since we keep updating the preview
    }

    // Creates an svg path that connects every points of currentPath
    // and adds svg circles on junctions if needed with the line attributes
    createPath(p: Point[], wasDoubleClick: boolean): string {
        let s = '';

        // We need at least 2 points
        if (p.length < 2) {
            return s;
        }

        // if we need to force an angle
        if (this.forcedAngle) {
            p[p.length - 1] = this.pointAtForcedAngle(p[p.length - 2], p[p.length - 1]);
        } else {
            p[p.length - 1] = this.currentPos;
        }

        // if the path closes on itself
        let closeIt = false;

        // if double click, the path is done
        if (wasDoubleClick) {
            // distance between first and last point
            const DIST: number = Point.distance(p[p.length - 1], p[0]);

            // threshold in pixels to close the path on itself
            const PIXEL_THRESHOLD = 3;
            const DISTANCE_TO_CONNECT: number = Math.sqrt(Math.pow(PIXEL_THRESHOLD, 2) + Math.pow(PIXEL_THRESHOLD, 2));

            // connect first and last if they meet distance threshold
            closeIt = DIST <= DISTANCE_TO_CONNECT;
        }

        // create a divider
        s = '<g style="transform: translate(0px, 0px);" name = "line-segments">';

        // start the path
        s += '<path d="';
        // move to first point
        s += `M ${p[0].x} ${p[0].y} `;
        // for each succeding point, connect it with a line, ignore last one if we're closing it on itself
        for (let i = 1; i < p.length - (closeIt ? 1 : 0); i++) {
            s += `L ${p[i].x} ${p[i].y} `;
        }
        // close the path
        if (closeIt) {
            s += 'Z';
        }

        // set render attributes
        s += `"stroke="${this.chosenColor.primColor}"`;
        s += `stroke-width="${this.attr.lineThickness}"`;
        s += 'fill="none"';
        s += 'stroke-linecap="round"';
        s += 'stroke-linejoin="round" />';
        // close the pathvoid

        // if we need to show the line junctions
        if (this.attr.junction) {
            // for each point, add a circle on it (ignore the last one if the path is closed)
            for (let i = 0; i < p.length - (closeIt ? 1 : 0); i++) {
                // set render attributes for the svg circle
                s += `<circle cx="${p[i].x}" cy="${p[i].y}"`;
                s += `r="${this.attr.junctionDiameter / 2}"`; // to get the radius
                s += 'stroke="none"';
                s += `fill="${this.chosenColor.primColor}"/>`;
            }
        }

        return s;
    }

    pointAtForcedAngle(firstPoint: Point, secondPoint: Point): Point {
        // x and y variation
        let xDelta = secondPoint.x - firstPoint.x;
        let yDelta = secondPoint.y - firstPoint.y;

        // calculate angle (radians) from x axis (counterclockwise) in first quadrant
        let angle = Math.atan(Math.abs(yDelta) / Math.abs(xDelta));
        // convert in degrees
        angle = (FULL_ROTATION * angle) / (2 * Math.PI);

        // adjust for 2nd, 3rd and 4th quadrants
        if (xDelta < 0) {
            angle = HALF_ROTATION - angle;
        }
        if (yDelta > 0) {
            angle = FULL_ROTATION - angle;
        }

        // get closest multiple of 45
        angle = ONE_HEIGHT_ROTATION * Math.round(angle / ONE_HEIGHT_ROTATION);

        // 360 degrees is the same as 0
        if (angle === FULL_ROTATION) {
            angle = 0;
        }

        // new point will be at same y
        if (angle === HALF_ROTATION || angle === 0) {
            yDelta = 0;
        }

        // new point will be at same x
        if (angle === ONE_FOUR_ROTATION || angle === THREE_FOUR_ROTATION) {
            xDelta = 0;
        }

        // same distance in y as in x
        if (angle === ONE_HEIGHT_ROTATION || angle === THREE_EIGHT_ROTATION) {
            yDelta = -Math.abs(xDelta);
        }
        if (angle === FIVE_EIGHT_ROTATION || angle === SEVEN_EIGHT_ROTATION) {
            yDelta = Math.abs(xDelta);
        }

        // add fixed variations to the first point
        const FIXED: Point = new Point(firstPoint.x + xDelta, firstPoint.y + yDelta);

        return FIXED;
    }
}
