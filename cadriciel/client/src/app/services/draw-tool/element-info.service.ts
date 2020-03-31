import { Point } from './point';

export class ElementInfo {

  static translate(el: Element): Point {
    const TRANSLATE_STRING = (el as HTMLElement).style.transform;
    const TRANSLATE_VALUES = TRANSLATE_STRING ? TRANSLATE_STRING.split(',') : '  ';

    const TRANSLATE_X = +(TRANSLATE_VALUES[0].replace(/[^\d.-]/g, ''));
    const TRANSLATE_Y = +(TRANSLATE_VALUES[1].replace(/[^\d.-]/g, ''));

    return new Point(TRANSLATE_X, TRANSLATE_Y);
  }
}
