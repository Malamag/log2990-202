import { CanvasInteraction } from './canvas-interaction.service';
import { SelectionService } from './selection.service';

export class MoveWithArrows {

  static once(left: boolean, up: boolean, right: boolean, down: boolean, selectionTool: SelectionService) {

    let pressedArrows: [boolean, boolean, boolean, boolean] = [left, up, right, down];

    let xoff = 0;
    let yoff = 0;

    for (let i = 0; i < pressedArrows.length; i++) {
      selectionTool.singleUseArrows[i] = pressedArrows[i] ? true : selectionTool.singleUseArrows[i];

      if (pressedArrows[i]) {
        xoff += i % 2 == 0 ? (3 * (i > 1 ? 1 : -1)) : 0;
        yoff += i % 2 != 0 ? (3 * (i > 1 ? 1 : -1)) : 0;
      }
    }

    selectionTool.movedSelectionWithArrowsOnce = selectionTool.movedSelectionWithArrowsOnce || (xoff != 0 || yoff != 0);

    if (selectionTool.selectedItems.length > 0) {
      CanvasInteraction.moveElements(xoff, yoff, selectionTool);

      selectionTool.selectedRef.innerHTML = CanvasInteraction.createBoundingBox(selectionTool);
    }
  }

  static loop(selectionTool: SelectionService, startArrowDelay: number, arrowMovementDelay: number) {

    selectionTool.existingLoop = true;

    if (selectionTool.arrowTimers.some(el => el >= startArrowDelay)) {
      let xoff = 0;
      let yoff = 0;

      for (let i = 0; i < selectionTool.arrows.length; i++) {
        if (selectionTool.arrows[i]) {
          xoff += i % 2 == 0 ? (3 * (i > 1 ? 1 : -1)) : 0;
          yoff += i % 2 != 0 ? (3 * (i > 1 ? 1 : -1)) : 0;
        }
      }

      selectionTool.movedSelectionWithArrowsOnce = selectionTool.movedSelectionWithArrowsOnce || (xoff !== 0 || yoff !== 0);

      if (selectionTool.selectedItems.length > 0) {
        CanvasInteraction.moveElements(xoff, yoff, selectionTool);

        selectionTool.selectedRef.innerHTML = CanvasInteraction.createBoundingBox(selectionTool);
      }
    }
    setTimeout(() => {
      this.loop(selectionTool, startArrowDelay, arrowMovementDelay);
      for (let i = 0; i < selectionTool.arrowTimers.length; i++) {
        selectionTool.arrowTimers[i] = selectionTool.arrows[i] ? selectionTool.arrowTimers[i] + arrowMovementDelay : selectionTool.arrowTimers[i];
      }
    }, arrowMovementDelay);
  }

}
