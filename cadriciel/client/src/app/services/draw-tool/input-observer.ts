import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { Point } from './point';

export abstract class InputObserver{
    //Keyboard
    abstract update(keyboard:KeyboardHandlerService):void;
    shortcut:number;
    abstract cancel():void;

    //Mouse
    abstract down(position:Point, insideWorkspace?:boolean):void;
    abstract up(position:Point):void;
    abstract move(position:Point):void;
    abstract doubleClick(position:Point,insideWorkspace?:boolean):void;
    selected:boolean;

    constructor(shortcut:number, selected:boolean){
        this.shortcut = shortcut;
        this.selected = selected;
    }
}