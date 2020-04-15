import { ElementInfo } from './element-info.service';
import { HtmlSvgFactory } from './html-svg-factory.service';
import { Point } from './point';
import { SelectionService } from './selection.service';
export class CanvasInteraction {
  static moveElements(xoff: number, yoff: number, selectionTool: SelectionService): void {

    //this.rotateElements(3 * Math.sign(xoff), selectionTool,);
    //return;
    // if there is at least 1 item selected
    if (!selectionTool.selectedItems.includes(true)) {
      return;
    }
    // iterate through all ITEMS
    for (let i = 0; i < Math.min(selectionTool.selectedItems.length, selectionTool.drawing.childElementCount); i++) {

      // ignore those who aren't selected
      if (!selectionTool.selectedItems[i]) { continue; }

      // get the CURRENT item's translate and add the offsets
      const NEW_X = ElementInfo.translate(selectionTool.drawing.children[i]).x + xoff;
      const NEW_Y = ElementInfo.translate(selectionTool.drawing.children[i]).y + yoff;

      // keep the CURRENT item's rotate
      let CURRENT_A = ElementInfo.rotate(selectionTool.drawing.children[i]);

      // set the new values
      selectionTool.render.setStyle(selectionTool.drawing.children[i], 'transform', `translate(${NEW_X}px,${NEW_Y}px) rotate(${CURRENT_A}rad)`);
    }
  }

  static rotateElements(angle: number, selectionTool:SelectionService, average : boolean){
    // if there is at least 1 item selected
    if (!selectionTool.selectedItems.includes(true)) {
      return;
    }
    
    average = average && selectionTool.selectedItems.filter(Boolean).length != 1;

    const CANVAS_BOX = selectionTool.canvas ? selectionTool.canvas.getBoundingClientRect() : null;

    // iterate through all ITEMS
    for (let i = 0; i < Math.min(selectionTool.selectedItems.length, selectionTool.drawing.childElementCount); i++) {

      console.log("here");

      // ignore those who aren't selected
      if (!selectionTool.selectedItems[i]) { continue; }

      // keep the CURRENT item's translate
      let CURRENT_X = ElementInfo.translate(selectionTool.drawing.children[i]).x;
      let CURRENT_Y = ElementInfo.translate(selectionTool.drawing.children[i]).y;

      // get the CURRENT item's rotate and add the angle
      let NEW_A = ElementInfo.rotate(selectionTool.drawing.children[i]) + angle;
      
      /*
      if(NEW_A + angle > 2*Math.PI){
        angle = 2*Math.PI;
        NEW_A = 0;
      }else{
        NEW_A += angle;
      }
      */

      selectionTool.render.setStyle(selectionTool.drawing.children[i], 'transform', `translate(${CURRENT_X}px,${CURRENT_Y}px) rotate(${0}rad)`);

      let center = ElementInfo.center(selectionTool.drawing.children[i] as Element, CANVAS_BOX);

      let offsetX = 0;
      let offsetY = 0;
      
      if(average){
        let newCenterX = selectionTool.boxCenter.x + (center.x - selectionTool.boxCenter.x) * Math.cos(angle) - (center.y - selectionTool.boxCenter.y) * Math.sin(angle);
        let newCenterY = selectionTool.boxCenter.y + (center.x - selectionTool.boxCenter.x) * Math.sin(angle) + (center.y - selectionTool.boxCenter.y) * Math.cos(angle);
        
        offsetX = newCenterX - center.x;
        offsetY = newCenterY - center.y;
        CURRENT_X += offsetX;
        CURRENT_Y += offsetY;
      }

      selectionTool.render.setStyle(selectionTool.drawing.children[i], 'transform', `translate(${0}px,${0}px) rotate(${0}rad)`);

      center = ElementInfo.center(selectionTool.drawing.children[i] as Element, CANVAS_BOX);

      // set the new values
      selectionTool.render.setStyle(selectionTool.drawing.children[i], 'transform-origin', `${center.x}px ${center.y}px`);
      selectionTool.render.setStyle(selectionTool.drawing.children[i], 'transform', `translate(${CURRENT_X}px,${CURRENT_Y}px) rotate(${NEW_A}rad)`);
    }
  }

  static createBoundingBox(selectionTool: SelectionService): void {
    if (!selectionTool.selected) {
      selectionTool.selectedItems = [];
    }

    const CANVAS_BOX = selectionTool.canvas ? selectionTool.canvas.getBoundingClientRect() : null;
    const INIT_VALUE = -1;
    // default values, is the value valid?
    let minX: [number, boolean] = [Infinity, false];
    let maxX: [number, boolean] = [INIT_VALUE, false];
    let minY: [number, boolean] = [Infinity, false];
    let maxY: [number, boolean] = [INIT_VALUE, false];
    const POS = 3;
    // iterate through all ITEMS
    for (let j = 0; j < Math.min(selectionTool.selectedItems.length, selectionTool.drawing.childElementCount); j++) {

      // ignore those who aren't selected
      if (!selectionTool.selectedItems[j]) { continue; }

      const CURRENT_BORDER = this.getPreciseBorder(selectionTool.drawing.children[j], [minX, maxX, minY, maxY]);

      minX = CURRENT_BORDER[0];
      maxX = CURRENT_BORDER[1];
      minY = CURRENT_BORDER[2];
      maxY = CURRENT_BORDER[POS];
    }

    // convert
    if (CANVAS_BOX != null) {
      minX[0] -= CANVAS_BOX.left;
      maxX[0] -= CANVAS_BOX.left;
      minY[0] -= CANVAS_BOX.top;
      maxY[0] -= CANVAS_BOX.top;
    }

    selectionTool.wrapperDimensions[0] = new Point(minX[0], minY[0]);
    selectionTool.wrapperDimensions[1] = new Point(maxX[0], maxY[0]);

    let wrapper = '';
    if (minX[1] && maxX[1] && minY[1] && maxY[1]) {

      const w = maxX[0] - minX[0];
      const h = maxY[0] - minY[0];

      wrapper += HtmlSvgFactory.svgRectangle('selection', null, minX[0], minY[0], w, h, '0,120,215,0.3', '0,120,215,0.9', 1, null);
      const SMALL_VALUE = 5;
      const BIG_VALUE = 7;
      wrapper +=
        HtmlSvgFactory.svgDetailedCircle(2, minX[0] + w / 2, minY[0], [BIG_VALUE, SMALL_VALUE],
          ['0,120,215', '0,120,215'], ['255,255,255', '255,255,255'], [0, 2]);
      wrapper +=
        HtmlSvgFactory.svgDetailedCircle(2, minX[0] + w / 2, maxY[0], [BIG_VALUE, SMALL_VALUE],
          ['0,120,215', '0,120,215'], ['255,255,255', '255,255,255'], [0, 2]);
      wrapper += HtmlSvgFactory.svgDetailedCircle(2, minX[0], minY[0] + h / 2, [BIG_VALUE, SMALL_VALUE],
        ['0,120,215', '0,120,215'], ['255,255,255', '255,255,255'], [0, 2]);
      wrapper += HtmlSvgFactory.svgDetailedCircle(2, maxX[0], minY[0] + h / 2, [BIG_VALUE, SMALL_VALUE],
        ['0,120,215', '0,120,215'], ['255,255,255', '255,255,255'], [0, 2]);
    }

    selectionTool.selectedRef.innerHTML = wrapper
  }

  static updateBoxCenter(selectionTool:SelectionService){
    if(selectionTool.selectedRef.firstElementChild){
      console.log("-----centerUpdate");
      const CANVAS_BOX = selectionTool.canvas.getBoundingClientRect();
      selectionTool.boxCenter = ElementInfo.center(selectionTool.selectedRef.firstElementChild as Element, CANVAS_BOX);
      console.log(selectionTool.boxCenter);
    }
  }

  static getPreciseBorder(item: Element, record?: [number, boolean][]): [number, boolean][] {
    const INIT_VALUE = -1;
    const POS = 3;

    let minX: [number, boolean] = record ? record[0] : [Infinity, false];
    let maxX: [number, boolean] = record ? record[1] : [INIT_VALUE, false];
    let minY: [number, boolean] = record ? record[2] : [Infinity, false];
    let maxY: [number, boolean] = record ? record[POS] : [INIT_VALUE, false];

    // iterate through every svg element
    for (let i = 0; i < item.childElementCount; i++) {

      const CURRENT = item.children[i] as HTMLElement;

      // ignore the brush filters
      if (CURRENT.tagName.toString() === 'filter') { continue; }

      // offset due to the stroke width
      const childStrokeWidth = CURRENT.getAttribute('stroke-width');
      const CURRENT_OFFSET = childStrokeWidth ? +childStrokeWidth / 2 : 0;

      // item bounding BOX
      const BOX = CURRENT.getBoundingClientRect();
      const TOP_LEFT: Point = new Point(BOX.left - CURRENT_OFFSET, BOX.top - CURRENT_OFFSET);
      const BOTTOM_RIGHT: Point = new Point(BOX.right + CURRENT_OFFSET, BOX.bottom + CURRENT_OFFSET);

      // get smallest rectangle that includes every item
      minX = TOP_LEFT.x < minX[0] ? [TOP_LEFT.x, true] : [minX[0], minX[1]];
      maxX = BOTTOM_RIGHT.x > maxX[0] ? [BOTTOM_RIGHT.x, true] : [maxX[0], maxX[1]];
      minY = TOP_LEFT.y < minY[0] ? [TOP_LEFT.y, true] : [minY[0], minY[1]];
      maxY = BOTTOM_RIGHT.y > maxY[0] ? [BOTTOM_RIGHT.y, true] : [maxY[0], maxY[1]];
    }

    return [minX, maxX, minY, maxY];
  }

  static retrieveItemsInRect(
    inProgress: HTMLElement,
    drawing: HTMLElement,
    selectedItems: boolean[],
    invertedITEMS: boolean[],
    inverted: boolean): void {

    const SELECTION_RECTANGLE = inProgress.lastElementChild;
    const ITEMS = drawing.children;
    const INIT_VALUE = -1;
    const POS = 3;
    // selection bounding BOX
    const SELECTION_BOX = SELECTION_RECTANGLE ? SELECTION_RECTANGLE.getBoundingClientRect() : null;
    const BOX_TOP_LEFT: Point = new Point(SELECTION_BOX ? SELECTION_BOX.left : INIT_VALUE, SELECTION_BOX ? SELECTION_BOX.top : INIT_VALUE);
    const BOX_BOTTOM_RIGHT: Point = new Point(SELECTION_BOX ? SELECTION_BOX.right : INIT_VALUE,
      SELECTION_BOX ? SELECTION_BOX.bottom : INIT_VALUE);

    for (let i = 0; i < ITEMS.length; i++) {

      // item bounding BOX
      const ITEM_BOX = this.getPreciseBorder(ITEMS[i]);
      const ITEM_TOP_LEFT: Point = new Point(ITEM_BOX[0][0], ITEM_BOX[2][0]);
      const ITEM_BOTTOM_RIGHT: Point = new Point(ITEM_BOX[1][0], ITEM_BOX[POS][0]);

      // check if the two bounding BOX are overlapping
      const INSIDE: boolean = Point.rectOverlap(BOX_TOP_LEFT, BOX_BOTTOM_RIGHT, ITEM_TOP_LEFT, ITEM_BOTTOM_RIGHT);

      // item is INSIDE the selection rectangle -> select/unselect accordingly
      if (INSIDE) {
        if (inverted) {
          selectedItems[i] = invertedITEMS[i] == undefined ? true : invertedITEMS[i];
        } else {
          selectedItems[i] = true;
          invertedITEMS[i] = false;
        }
      } else { // item is outside the selection rectangle -> select/unselect accordingly
        if (inverted) {
          selectedItems[i] = invertedITEMS[i] == undefined ? false : !invertedITEMS[i];
        } else {
          selectedItems[i] = false;
          invertedITEMS[i] = true;
        }
      }
    }
  }
}
