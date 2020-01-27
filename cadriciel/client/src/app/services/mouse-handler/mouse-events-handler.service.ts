import { Injectable } from '@angular/core';
import {Point} from './point' 
@Injectable({
  providedIn: 'root'
})
export class MouseEventsHandlerService {

  constructor() { }

  getCoords(event: MouseEvent){
    return new Point(event.x, event.y);
  }
  
}
