import { Point } from './point';
import { KeyboardHandlerService } from './services/keyboard-handler/keyboard-handler.service';

export abstract class InputObserver {
    constructor(shortcut: number, selected: boolean) {
        this.shortcut = shortcut;
        this.selected = selected;
    }
    shortcut: number;
    selected: boolean;
    // Keyboard
    abstract update(keyboard: KeyboardHandlerService): void;
    abstract cancel(): void;

    // Mouse
    abstract down(position: Point, insideWorkspace?: boolean): void;
    abstract up(position: Point): void;
    abstract move(position: Point): void;
    abstract doubleClick(position: Point, insideWorkspace?: boolean): void;
}
