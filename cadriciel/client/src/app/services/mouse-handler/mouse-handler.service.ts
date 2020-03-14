import { Injectable } from '@angular/core';
import { InputObserver } from '../draw-tool/input-observer';
import { Point } from '../draw-tool/point';

@Injectable({
    providedIn: 'root',
})
export class MouseHandlerService {
    mouseWindowPosition: Point;
    mouseCanvasPosition: Point;
    startedInsideWorkspace: boolean;
    insideWorkspace: boolean;
    svgCanvas: HTMLElement | null;
    workingSpace: HTMLElement | null;
    svgBox: ClientRect;
    observers: InputObserver[];

    numberOfClicks: number;
    isFirstClick: boolean;
    upFromDoubleClick: boolean;

    constructor(svgCanvas: HTMLElement) {
        this.observers = [];

        this.svgCanvas = svgCanvas;

        this.updateWindowSize();

        this.mouseWindowPosition = new Point(0, 0);
        this.mouseCanvasPosition = this.windowToCanvas(this.mouseWindowPosition);
        this.startedInsideWorkspace = this.validPoint(this.mouseCanvasPosition);
        this.insideWorkspace = this.validPoint(this.mouseCanvasPosition);

        this.numberOfClicks = 0;
        this.isFirstClick = true;
        this.upFromDoubleClick = false;
    }

    updateWindowSize(): void {
        if (this.svgCanvas != null) {
            this.svgBox = this.svgCanvas.getBoundingClientRect();
        }
    }

    windowToCanvas(windowPosition: Point): Point {
        const canvasX: number = windowPosition.x - this.svgBox.left;
        const canvasY: number = windowPosition.y - this.svgBox.top;

        return new Point(canvasX, canvasY);
    }

    validPoint(clickedPoint: Point): boolean {
        const validX: boolean =
            clickedPoint.x + this.svgBox.left >= this.svgBox.left && clickedPoint.x + this.svgBox.left <= this.svgBox.right;
        const validY: boolean =
            clickedPoint.y + this.svgBox.top >= this.svgBox.top && clickedPoint.y + this.svgBox.top <= this.svgBox.bottom;

        return validX && validY;
    }

    addObserver(newObserver: InputObserver): void {
        this.observers.push(newObserver);
    }

    updatePosition(x: number, y: number): void {
        this.mouseWindowPosition = new Point(x, y);
        this.mouseCanvasPosition = this.windowToCanvas(this.mouseWindowPosition);
    }

    down(e: MouseEvent): void {
        this.updatePosition(e.x, e.y);
        this.startedInsideWorkspace = this.validPoint(this.mouseCanvasPosition);
        this.insideWorkspace = this.validPoint(this.mouseCanvasPosition);

        if (this.startedInsideWorkspace) {
            this.callObserverDown(e.button === 2);
        }
    }

    up(e: MouseEvent): void {
        this.updatePosition(e.x, e.y);

        this.insideWorkspace = this.validPoint(this.mouseCanvasPosition);

        if (this.startedInsideWorkspace) {
            this.callObserverUp();
            this.startedInsideWorkspace = false;
        }

        this.numberOfClicks++;

        if (this.isFirstClick) {
            this.isFirstClick = false;
            const TIME_MS = 200;
            setTimeout(() => {
                if (this.numberOfClicks > 1) {
                    this.callObserverDoubleClick();
                }
                this.numberOfClicks = 0;
                this.isFirstClick = true;
            }, TIME_MS);
        }
    }
    move(e: MouseEvent): void {
        this.updatePosition(e.x, e.y);

        const wasInside: boolean = this.insideWorkspace;
        this.insideWorkspace = this.validPoint(this.mouseCanvasPosition);

        if (this.insideWorkspace) {
            if (wasInside) {
                this.callObserverMove();
            } else {
                this.callObserverInsideCanvas();
            }
        } else {
            if (wasInside) {
                this.callObserverOutsideCanvas();
            }
        }
    }

    callObserverMove(): void {
        // console.log("MOVING");
        this.observers.forEach((element: InputObserver) => {
            if (element.selected) {
                element.move(this.mouseCanvasPosition);
            }
        });
    }

    callObserverDown(isRightClick: boolean): void {
        // console.log("DOWN");
        this.observers.forEach((element: InputObserver) => {
            if (element.selected) {
                element.down(this.mouseCanvasPosition, this.insideWorkspace, isRightClick);
            }
        });
    }

    callObserverOutsideCanvas(): void {
        this.observers.forEach((element: InputObserver) => {
            if (element.selected) {
                element.goingOutsideCanvas(this.mouseCanvasPosition);
            }
        });
    }

    callObserverInsideCanvas(): void {
        // console.log("InsideCanvas");
        this.observers.forEach((element: InputObserver) => {
            if (element.selected) {
                element.goingInsideCanvas(this.mouseCanvasPosition);
            }
        });
    }

    callObserverUp(): void {
        // console.log("UP");
        this.observers.forEach((element: InputObserver) => {
            if (element.selected) {
                element.up(this.mouseCanvasPosition, this.insideWorkspace);
            }
        });
    }

    callObserverDoubleClick(): void {
        // console.log("DOUBLECLICK");
        this.observers.forEach((element: InputObserver) => {
            if (element.selected) {
                element.doubleClick(this.mouseCanvasPosition, this.insideWorkspace);
            }
        });
    }
}
