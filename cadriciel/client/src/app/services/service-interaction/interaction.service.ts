import { ElementRef, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FormsAttribute } from '../attributes/attribute-form';
import { LineAttributes } from '../attributes/line-attributes';
import { ToolsAttributes } from '../attributes/tools-attribute';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  selectedTool = new Subject<String>();
  $selectedTool = this.selectedTool.asObservable();
  formsAttributes = new Subject<FormsAttribute>()
  $formsAttributes = this.formsAttributes.asObservable()
  drawingDone = new Subject<boolean>();
  $drawingDone = this.drawingDone.asObservable()
  enableDisableButtons = new Subject<boolean[]>()
  $enableDisableButtons = this.enableDisableButtons.asObservable()
  toolsAttributes = new Subject<ToolsAttributes>()
  $toolsAttributes = this.toolsAttributes.asObservable()
  lineAttributes = new Subject<LineAttributes>()
  $lineAttributes = this.lineAttributes.asObservable()
  cancelTools = new Subject<boolean>()
  $cancelToolsObs = this.cancelTools.asObservable()

  ref = new Subject<ElementRef>()
  $refObs = this.ref.asObservable()

  constructor() { }

  emitSelectedTool(tool: string) {
    this.selectedTool.next(tool);
  }

  emitLineAttributes(attr: LineAttributes) {
    this.lineAttributes.next(attr)
  }

  emitFormsAttributes(attr: FormsAttribute) {
    this.formsAttributes.next(attr)
  }

  emitToolsAttributes(attr: ToolsAttributes) {
    this.toolsAttributes.next(attr)
  }

  emitCancel(sig: boolean) {
    this.cancelTools.next(sig)
  }
  emitRef(el: ElementRef) {

    this.ref.next(el)
  }
  emitDrawingDone(){
    this.drawingDone.next(true);
  }
  emitEnableDisable(disableContainer: boolean[]){
    this.enableDisableButtons.next(disableContainer);
  }
}
