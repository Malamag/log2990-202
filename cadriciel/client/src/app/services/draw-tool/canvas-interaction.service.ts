import { ElementInfo } from './element-info.service';
import { Point } from './point';
import { HtmlSvgFactory } from './html-svg-factory.service';
import { SelectionService } from './selection.service';

export class CanvasInteraction {

  static moveElements(xoff: number, yoff: number, selectionTool: SelectionService) {
    // if there is at least 1 item selected
    if (selectionTool.selectedItems.includes(true)) {

      // iterate through all items
      for (let i = 0; i < Math.min(selectionTool.selectedItems.length, selectionTool.drawing.childElementCount); i++) {

        // ignore those who aren't selected
        if (!selectionTool.selectedItems[i]) { continue; }

        // get the current item's translate and add the offsets
        let newX = ElementInfo.translate(selectionTool.drawing.children[i]).x + xoff;
        let newY = ElementInfo.translate(selectionTool.drawing.children[i]).y + yoff;

        // set the new values
        selectionTool.render.setStyle(selectionTool.drawing.children[i], "transform", `translate(${newX}px,${newY}px)`);
      }
    }
  }

  static createBoundingBox(selectionTool: SelectionService) {
    if (!selectionTool.selected) {
      selectionTool.selectedItems = [];
    }

    let canvasBox = selectionTool.canvas ? selectionTool.canvas.getBoundingClientRect() : null;

    // default values, is the value valid?
    let minX: [number, boolean] = [Infinity, false];
    let maxX: [number, boolean] = [-1, false];
    let minY: [number, boolean] = [Infinity, false];
    let maxY: [number, boolean] = [-1, false];

    // iterate through all items
    for (let j = 0; j < Math.min(selectionTool.selectedItems.length, selectionTool.drawing.childElementCount); j++) {

      // ignore those who aren't selected
      if (!selectionTool.selectedItems[j]) { continue; }

      let currentBorder = this.getPreciseBorder(selectionTool.drawing.children[j], [minX, maxX, minY, maxY]);

      minX = currentBorder[0];
      maxX = currentBorder[1];
      minY = currentBorder[2];
      maxY = currentBorder[3];
    };

    // convert
    if (canvasBox != null) {
      minX[0] -= canvasBox.left;
      maxX[0] -= canvasBox.left;
      minY[0] -= canvasBox.top;
      maxY[0] -= canvasBox.top;
    }

    selectionTool.wrapperDimensions[0] = new Point(minX[0], minY[0]);
    selectionTool.wrapperDimensions[1] = new Point(maxX[0], maxY[0]);

    let wrapper = "";
    if (minX[1] && maxX[1] && minY[1] && maxY[1]) {

      let w = maxX[0] - minX[0];
      let h = maxY[0] - minY[0];

      wrapper += HtmlSvgFactory.svgRectangle("selection", null, minX[0], minY[0], w, h, "0,120,215,0.3", "0,120,215,0.9", 1, null);

      wrapper += HtmlSvgFactory.svgDetailedCircle(2, minX[0] + w / 2, minY[0], [7, 5], ["0,120,215", "0,120,215"], ["255,255,255", "255,255,255"], [0, 2]);
      wrapper += HtmlSvgFactory.svgDetailedCircle(2, minX[0] + w / 2, maxY[0], [7, 5], ["0,120,215", "0,120,215"], ["255,255,255", "255,255,255"], [0, 2]);
      wrapper += HtmlSvgFactory.svgDetailedCircle(2, minX[0], minY[0] + h / 2, [7, 5], ["0,120,215", "0,120,215"], ["255,255,255", "255,255,255"], [0, 2]);
      wrapper += HtmlSvgFactory.svgDetailedCircle(2, maxX[0], minY[0] + h / 2, [7, 5], ["0,120,215", "0,120,215"], ["255,255,255", "255,255,255"], [0, 2]);
    }

    return wrapper;
  }

  static getPreciseBorder(item: Element, record?: [number, boolean][]) {

    let minX: [number, boolean] = record ? record[0] : [Infinity, false];
    let maxX: [number, boolean] = record ? record[1] : [-1, false];
    let minY: [number, boolean] = record ? record[2] : [Infinity, false];
    let maxY: [number, boolean] = record ? record[3] : [-1, false];

    // iterate through every svg element
    for (let i = 0; i < item.childElementCount; i++) {

      let current = item.children[i] as HTMLElement;

      // ignore the brush filters
      if (current.tagName.toString() == "filter") { continue; }

      // offset due to the stroke width
      let childStrokeWidth = current.getAttribute("stroke-width");
      let currentOffset = childStrokeWidth ? +childStrokeWidth / 2 : 0;

      // item bounding box
      let box = current.getBoundingClientRect();
      let topLeft: Point = new Point(box.left - currentOffset, box.top - currentOffset);
      let bottomRight: Point = new Point(box.right + currentOffset, box.bottom + currentOffset);

      // get smallest rectangle that includes every item
      minX = topLeft.x < minX[0] ? [topLeft.x, true] : [minX[0], minX[1]];
      maxX = bottomRight.x > maxX[0] ? [bottomRight.x, true] : [maxX[0], maxX[1]];
      minY = topLeft.y < minY[0] ? [topLeft.y, true] : [minY[0], minY[1]];
      maxY = bottomRight.y > maxY[0] ? [bottomRight.y, true] : [maxY[0], maxY[1]];
    }

    return [minX, maxX, minY, maxY];
  }

  static retrieveItemsInRect(inProgress: HTMLElement, drawing: HTMLElement, selectedItems: boolean[], invertedItems: boolean[], inverted: boolean) {

    let selectionRectangle = inProgress.lastElementChild;
    let items = drawing.children;

    // selection bounding box
    let selectionBox = selectionRectangle ? selectionRectangle.getBoundingClientRect() : null;
    let boxTopLeft: Point = new Point(selectionBox ? selectionBox.left : -1, selectionBox ? selectionBox.top : -1);
    let boxBottomRight: Point = new Point(selectionBox ? selectionBox.right : -1, selectionBox ? selectionBox.bottom : -1);

    for (let i = 0; i < items.length; i++) {

      // item bounding box
      let itemBox = this.getPreciseBorder(items[i]);
      let itemTopLeft: Point = new Point(itemBox[0][0], itemBox[2][0]);
      let itemBottomRight: Point = new Point(itemBox[1][0], itemBox[3][0]);

      // check if the two bounding box are overlapping
      let inside: boolean = Point.rectOverlap(boxTopLeft, boxBottomRight, itemTopLeft, itemBottomRight);

      // item is inside the selection rectangle -> select/unselect accordingly
      if (inside) {
        if (inverted) {
          selectedItems[i] = invertedItems[i] === undefined ? true : invertedItems[i];
        } else {
          selectedItems[i] = true;
          invertedItems[i] = false;
        }
      }
      // item is outside the selection rectangle -> select/unselect accordingly
      else {
        if (inverted) {
          selectedItems[i] = invertedItems[i] === undefined ? false : !invertedItems[i];
        } else {
          selectedItems[i] = false;
          invertedItems[i] = true;
        }
      }
    }
  }
}