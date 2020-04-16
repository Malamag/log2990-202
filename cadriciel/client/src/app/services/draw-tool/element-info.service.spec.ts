import { ElementInfo } from './element-info.service';
import { Point } from './point';

describe('ElementInfo', () => {
  // tslint:disable-next-line: no-any
  let elem: any;
  // tslint:disable-next-line: no-any
  let secondElem: any;
  // tslint:disable-next-line: no-any
  let fakeDomRECT: any;
  beforeEach(() => {
    fakeDomRECT = {
      left: 200,
      top: 150,
      right: 0,
      bottom: 50,
      width: 200,
      height: 100,
    };
    secondElem = {
      style: {
        transform: '1px) 1px)',
      }
    };
    elem = {
      getBoundingClientRect: () => 0,
      style: {
        transform: '1, 2px)',
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
    elem.style.transform = ',';
    const POINT = ElementInfo.translate(elem);
    expect(POINT.x).toEqual(0);
    expect(POINT.y).toEqual(0);
  });
  it('rotate should return the expected result', () => {
    const ROTATE_VALUE = +('1'.replace(/[^\d.-]/g, ''));
    const RET = ElementInfo.rotate(secondElem);
    expect(RET).toEqual(ROTATE_VALUE);
  });
  it('roate should 0 as result', () => {
    secondElem.style.transform = '';
    const RET = ElementInfo.rotate(secondElem);
    expect(RET).toEqual(0);
  });

  it('center should return the expected point without box', () => {
    spyOn(elem, 'getBoundingClientRect').and.returnValue(fakeDomRECT);
    const RET = ElementInfo.center(elem, null);
    const EXPECTED_RET = new Point(fakeDomRECT.left + fakeDomRECT.width / 2, fakeDomRECT.top + fakeDomRECT.height / 2);
    expect(RET).toEqual(EXPECTED_RET);
  });
  it('cnter should return the expected point with a defined box in the parameter', () => {
    // tslint:disable-next-line: no-any
    const BOX: any = {
      left: 50,
      top: 20,
    };
    spyOn(elem, 'getBoundingClientRect').and.returnValue(fakeDomRECT);
    const RET = ElementInfo.center(elem, BOX);
    const EXPECTED_RET = new Point((fakeDomRECT.left - BOX.left) + fakeDomRECT.width / 2,
     (fakeDomRECT.top - BOX.top) + fakeDomRECT.height / 2);
    expect(RET).toEqual(EXPECTED_RET);
  });
});
