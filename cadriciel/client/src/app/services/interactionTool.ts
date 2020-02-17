import { ElementRef } from '@angular/core';


export abstract class InteractionTool{
    constructor(){
    }

    getSVGElementFromRef(el: ElementRef): SVGElement{
        return el.nativeElement;
    }

    /*
    how to access parent methods/attributes:

    method(){ 
        super.maMethode() //just like in Java :)
    }*/

}