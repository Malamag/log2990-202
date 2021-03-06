import { ElementInfo } from './element-info.service';
import { Point } from './point';

describe('ElementInfo', () => {
  // tslint:disable-next-line: no-any
  let elem: any;
  beforeEach(() => {
    elem = {
      style: {
        transform: '1, 2',
      }
    };
  });

  it('should return the expected point', () => {
    const TRANSLATE_X = '1'.replace(/[^\d.-]/g, '');
    const TRANSLATE_Y = '2'.replace(/[^\d.-]/g, '');
    const EXPECTED_POINT = new Point(+TRANSLATE_X, +TRANSLATE_Y);
    expect(ElementInfo.translate(elem)).toEqual(EXPECTED_POINT);

  });

  it('should return a point at (0,0) if transform is undefined', () => {
    elem.style.transform = '';
    const POINT = ElementInfo.translate(elem);
    expect(POINT.x).toEqual(0);
    expect(POINT.y).toEqual(0);
  });

});
