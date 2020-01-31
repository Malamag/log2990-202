import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';
import { Point } from './point';

export abstract class InputObserver{
    //Keyboard
    abstract update(keyboard:KeyboardHandlerService):void;

    //Mouse
    abstract down(position:Point):void;
    abstract up(position:Point):void;
    abstract move(position:Point):void;
    abstract doubleClick(position:Point):void;
    abstract selected:boolean;
}