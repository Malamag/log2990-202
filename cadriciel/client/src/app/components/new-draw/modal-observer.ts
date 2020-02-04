import {KeyboardHandlerService } from '../../services/services/keyboard-handler/keyboard-handler.service';

export abstract class ModalObserver{
    //Keyboard
    abstract update(keyboard:KeyboardHandlerService):void;
    
    abstract cancel():void;

    shortcut:number;
    selected:boolean;

    constructor(shortcut:number, selected:boolean){
        this.shortcut = shortcut;
        this.selected = selected;
    }
}