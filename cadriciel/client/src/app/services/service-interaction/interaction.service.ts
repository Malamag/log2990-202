import { Injectable, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { FormsAttribute } from '../attributes/attribute-form';
import { ToolsAttributes } from '../attributes/tools-attribute';
import { LineAttributes } from '../attributes/line-attributes';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  selectedTool = new Subject<String>();
  $selectedTool = this.selectedTool.asObservable();

  formsAttributes = new Subject<FormsAttribute>()
  $formsAttributes = this.formsAttributes.asObservable()

  toolsAttributes = new Subject<ToolsAttributes>()
  $toolsAttributes = this.toolsAttributes.asObservable()

  lineAttributes = new Subject<LineAttributes>()
  $lineAttributes = this.lineAttributes.asObservable()

  cancelTools = new Subject<boolean>()
  $cancelToolsObs = this.cancelTools.asObservable()

  ref= new Subject<ElementRef>()
  $refObs= this.ref.asObservable()

  constructor() { }

  emitSelectedTool(tool: string){
    this.selectedTool.next(tool);
  }

  emitLineAttributes(attr: LineAttributes){
    this.lineAttributes.next(attr)
  }

  emitFormsAttributes(attr: FormsAttribute){
    this.formsAttributes.next(attr)
  }

  emitToolsAttributes(attr: ToolsAttributes){
    this.toolsAttributes.next(attr)
  }

  emitCancel(sig:boolean){
    this.cancelTools.next(sig)
  }
  emitRef(el: ElementRef){
    
    this.ref.next(el)
  }
}
