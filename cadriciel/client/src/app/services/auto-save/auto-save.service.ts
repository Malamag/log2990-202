import { Injectable } from '@angular/core';
import { SVGData } from '../../../../../svg-data';
import { DoodleFetchService } from '../doodle-fetch/doodle-fetch.service';
import { InteractionService } from '../service-interaction/interaction.service';

@Injectable({
  providedIn: 'root'
})
export class AutoSaveService {
  width: string;
  height: string;
  bgColor: string;
  innerHTML: string;
  constructor(private interact: InteractionService, private doodle: DoodleFetchService) {
    this.width = 'width';
    this.height = 'height';
    this.bgColor = 'color';
    this.innerHTML = 'htmlElem';
    this.editingSave();
    this.newSave();
  }
  clearLocal(data: SVGData): void {
    localStorage.removeItem(this.width);
    localStorage.removeItem(this.height);
    localStorage.removeItem(this.bgColor);
    for (let i = 0; i < data.innerHTML.length; ++i) {
      localStorage.removeItem(this.innerHTML + i.toString());
    }
  }
  saveLocal(data: SVGData): void {
    this.clearLocal(data);
    localStorage.setItem(this.width, data.width);
    localStorage.setItem(this.height, data.height);
    localStorage.setItem(this.bgColor, data.bgColor);
    for (let i = 0; i < data.innerHTML.length; ++i) {
      localStorage.setItem(this.innerHTML + i.toString(), data.innerHTML[i]);
    }
  }
  editingSave(): void {
    this.interact.$drawingDone.subscribe((sig) => {
      if (!sig) {
        return;
      }
      this.doodle.askForDoodle();
      const SVG_DATA = this.doodle.getDrawingDataNoGrid();
      this.saveLocal(SVG_DATA);
    });
  }

  newSave(): void {
    this.interact.$drawingContinued.subscribe((sig) => {
      if (!sig) {
        return;
      }
      this.doodle.askForDoodle();
      const SVG_DATA = this.doodle.getDrawingDataNoGrid();
      this.saveLocal(SVG_DATA);
    });
  }
}
