import {KeyboardHandlerService } from '../../services/services/keyboard-handler/keyboard-handler.service';

export abstract class ModalObserver{
    //Keyboard
    abstract update(keyboard:KeyboardHandlerService):void;
    

    constructor(){
    }
}