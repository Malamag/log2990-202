import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { Point } from './point';

export abstract class InputObserver {

    constructor(selected: boolean) {

        this.selected = selected;
    }
    shortcut: number;
    selected: boolean;
    // Keyboard
    abstract update(keyboard: KeyboardHandlerService): void;
    abstract cancel(): void;

    // Mouse
    abstract down(position: Point, insideWorkspace?: boolean, isRightClick?:boolean): void;
    abstract up(position: Point, insideWorkspace?: boolean): void;
    abstract move(position: Point): void;
    abstract doubleClick(position: Point, insideWorkspace?: boolean): void;
    abstract goingOutsideCanvas(position: Point): void;
    abstract goingInsideCanvas(position: Point): void;
}
