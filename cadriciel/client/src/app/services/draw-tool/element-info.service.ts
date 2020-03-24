import { Point } from './point';

export class ElementInfo {

  static translate(el: Element) {
    let translateString = (el as HTMLElement).style.transform;
    let translateValues = translateString ? translateString.split(",") : "";
    let translateX = +(translateValues[0].replace(/[^\d.-]/g, ''));
    let translateY = +(translateValues[1].replace(/[^\d.-]/g, ''));

    return new Point(translateX, translateY);
  }
}
