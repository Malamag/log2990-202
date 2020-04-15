import { CanvasInteraction } from './canvas-interaction.service';
import { SelectionService } from './selection.service';

export class MoveWithArrows {

  static once(left: boolean, up: boolean, right: boolean, down: boolean, selectionTool: SelectionService): void {

    const PRESSED_ARROWS: [boolean, boolean, boolean, boolean] = [left, up, right, down];

    let xoff = 0;
    let yoff = 0;

    for (let i = 0; i < PRESSED_ARROWS.length; i++) {
      selectionTool.singleUseArrows[i] = PRESSED_ARROWS[i] ? true : selectionTool.singleUseArrows[i];

      if (PRESSED_ARROWS[i]) {
        const MULT = 3;
        const INIT_VALUE = -1;
        xoff += i % 2 === 0 ? (MULT * (i > 1 ? 1 : INIT_VALUE)) : 0;
        yoff += i % 2 !== 0 ? (MULT * (i > 1 ? 1 : INIT_VALUE)) : 0;
      }
    }

    selectionTool.movedSelectionWithArrowsOnce = selectionTool.movedSelectionWithArrowsOnce || (xoff !== 0 || yoff !== 0);

    if (selectionTool.selectedItems.length > 0) {
      CanvasInteraction.moveElements(xoff, yoff, selectionTool);

      CanvasInteraction.createBoundingBox(selectionTool);
        if(left || up || right || down){
          CanvasInteraction.updateBoxCenter(selectionTool);
        }
    }
  }

  static loop(selectionTool: SelectionService, startArrowDelay: number, arrowMovementDelay: number): void {

    selectionTool.existingLoop = true;

    if (selectionTool.arrowTimers.some((el) => el >= startArrowDelay)) {
      let xoff = 0;
      let yoff = 0;

      for (let i = 0; i < selectionTool.arrows.length; i++) {
        if (selectionTool.arrows[i]) {
          const MULT = 3;
          const INIT_VALUE = -1;
          xoff += i % 2 === 0 ? (MULT * (i > 1 ? 1 : INIT_VALUE)) : 0;
          yoff += i % 2 !== 0 ? (MULT * (i > 1 ? 1 : INIT_VALUE)) : 0;
        }
      }

      selectionTool.movedSelectionWithArrowsOnce = selectionTool.movedSelectionWithArrowsOnce || (xoff !== 0 || yoff !== 0);

      if (selectionTool.selectedItems.length > 0) {
        CanvasInteraction.moveElements(xoff, yoff, selectionTool);

        CanvasInteraction.createBoundingBox(selectionTool);
        CanvasInteraction.updateBoxCenter(selectionTool);
      }
    }
    setTimeout(() => {
      this.loop(selectionTool, startArrowDelay, arrowMovementDelay);
      for (let i = 0; i < selectionTool.arrowTimers.length; i++) {
        selectionTool.arrowTimers[i] = selectionTool.arrows[i] ? selectionTool.arrowTimers[i]
         + arrowMovementDelay : selectionTool.arrowTimers[i];
      }
    }, arrowMovementDelay);
  }

}
