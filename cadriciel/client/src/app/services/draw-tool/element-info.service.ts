import { Point } from './point';

export class ElementInfo {

  static translate(el: Element): Point {
    const TRANSFORM_STRING = (el as HTMLElement).style.transform;
    const TRANSLATE_STRING = TRANSFORM_STRING ? TRANSFORM_STRING.split("px)")[0] : '  ';

    const TRANSLATE_VALUES = TRANSLATE_STRING ? TRANSLATE_STRING.split(',') : '  ';

    const TRANSLATE_X = +(TRANSLATE_VALUES[0].replace(/[^\d.-]/g, ''));
    const TRANSLATE_Y = +(TRANSLATE_VALUES[1].replace(/[^\d.-]/g, ''));

    return new Point(TRANSLATE_X, TRANSLATE_Y);
  }

  static rotate(el: Element): number {
    const TRANSFORM_STRING = (el as HTMLElement).style.transform;
    const ROTATE_STRING = TRANSFORM_STRING ? TRANSFORM_STRING.split("px)")[1] : '  ';

    const ROTATE_VALUE = +(ROTATE_STRING.replace(/[^\d.-]/g, ''));

    return ROTATE_VALUE;
  }

  static center(el : Element, box : any): Point{

    let htmlel = el as HTMLElement;

    let bla = htmlel.getBoundingClientRect();

    const CENTER = new Point((bla.left - box.left) + bla.width/2, (bla.top - box.top) + bla.height/2);

    return CENTER;
  }
}
