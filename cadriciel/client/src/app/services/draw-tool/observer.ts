import { KeyboardHandlerService } from '../keyboard-handler/keyboard-handler.service';

export abstract class Observer{
    abstract update(keyboard:KeyboardHandlerService):void;
}