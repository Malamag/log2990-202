import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DrawViewService {
  height: number;
  width: number;
  color: string;

  constructor() { }

  newDrawOnView() {
  }

  hasCurrentDraw(): boolean {
    return (false);
  }
}
