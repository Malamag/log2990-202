import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  private selectedTool = new Subject<String>();
  $selectedTool = this.selectedTool.asObservable();
  constructor() { }

  emitSelectedTool(tool: string){
    this.selectedTool.next(tool);
  }
}
