import { HtmlSvgFactory } from './html-svg-factory.service';

fdescribe('HtmlSvgFactory', () => {

  it('should contain the rect tag', () => {
    const ID = '1';
    const CLASS_NAME = 'rectangle';
    const START_X = 0;
    const START_Y = 0;
    const WIDTH = 5;
    const HEIGHT = 5;
    const FILL = 'red';
    const STROKE = 'blue';
    const STROKE_WIDTH = 2;
    const DASH_ARRAY = 1;
    const EXPECTED_CONTAIN = '<rect';
    expect(HtmlSvgFactory.svgRectangle(ID, CLASS_NAME, START_X, START_Y, WIDTH,
      HEIGHT, FILL, STROKE, STROKE_WIDTH, DASH_ARRAY)).toContain(EXPECTED_CONTAIN);
  });
  it('should contain the id', () => {
    const ID = '1';
    const CLASS_NAME = 'rectangle';
    const START_X = 0;
    const START_Y = 0;
    const WIDTH = 5;
    const HEIGHT = 5;
    const FILL = 'red';
    const STROKE = 'blue';
    const STROKE_WIDTH = 2;
    const DASH_ARRAY = 1;
    const EXPECTED_CONTAIN = `id="${ID}"`;
    expect(HtmlSvgFactory.svgRectangle(ID, CLASS_NAME, START_X, START_Y, WIDTH,
      HEIGHT, FILL, STROKE, STROKE_WIDTH, DASH_ARRAY)).toContain(EXPECTED_CONTAIN);
  });
  it('should contain the class name', () => {
    const ID = '1';
    const CLASS_NAME = 'rectangle';
    const START_X = 0;
    const START_Y = 0;
    const WIDTH = 5;
    const HEIGHT = 5;
    const FILL = 'red';
    const STROKE = 'blue';
    const STROKE_WIDTH = 2;
    const DASH_ARRAY = 1;
    const EXPECTED_CONTAIN = `class="${CLASS_NAME}"`;
    expect(HtmlSvgFactory.svgRectangle(ID, CLASS_NAME, START_X, START_Y, WIDTH,
      HEIGHT, FILL, STROKE, STROKE_WIDTH, DASH_ARRAY)).toContain(EXPECTED_CONTAIN);
  });
  it('should start at the starting position', () => {
    const ID = '1';
    const CLASS_NAME = 'rectangle';
    const START_X = 0;
    const START_Y = 0;
    const WIDTH = 5;
    const HEIGHT = 5;
    const FILL = 'red';
    const STROKE = 'blue';
    const STROKE_WIDTH = 2;
    const DASH_ARRAY = 1;
    const EXPECTED_CONTAIN = `x="${START_X}" y="${START_Y}"`;
    expect(HtmlSvgFactory.svgRectangle(ID, CLASS_NAME, START_X, START_Y, WIDTH,
      HEIGHT, FILL, STROKE, STROKE_WIDTH, DASH_ARRAY)).toContain(EXPECTED_CONTAIN);
  });
  it('should have the width and the height', () => {
    const ID = '1';
    const CLASS_NAME = 'rectangle';
    const START_X = 0;
    const START_Y = 0;
    const WIDTH = 5;
    const HEIGHT = 5;
    const FILL = 'red';
    const STROKE = 'blue';
    const STROKE_WIDTH = 2;
    const DASH_ARRAY = 1;
    const EXPECTED_CONTAIN = `width="${WIDTH}" height="${HEIGHT}`;
    expect(HtmlSvgFactory.svgRectangle(ID, CLASS_NAME, START_X, START_Y, WIDTH,
      HEIGHT, FILL, STROKE, STROKE_WIDTH, DASH_ARRAY)).toContain(EXPECTED_CONTAIN);
  });
  it('should fill the rectangle', () => {
    const ID = '1';
    const CLASS_NAME = 'rectangle';
    const START_X = 0;
    const START_Y = 0;
    const WIDTH = 5;
    const HEIGHT = 5;
    const FILL = 'red';
    const STROKE = 'blue';
    const STROKE_WIDTH = 2;
    const DASH_ARRAY = 1;
    const EXPECTED_CONTAIN = `fill="rgba(${FILL})"`;
    expect(HtmlSvgFactory.svgRectangle(ID, CLASS_NAME, START_X, START_Y, WIDTH,
      HEIGHT, FILL, STROKE, STROKE_WIDTH, DASH_ARRAY)).toContain(EXPECTED_CONTAIN);
  });
  it('should fill the stroke and have the stroke width', () => {
    const ID = '1';
    const CLASS_NAME = 'rectangle';
    const START_X = 0;
    const START_Y = 0;
    const WIDTH = 5;
    const HEIGHT = 5;
    const FILL = 'red';
    const STROKE = 'blue';
    const STROKE_WIDTH = 2;
    const DASH_ARRAY = 1;
    const EXPECTED_CONTAIN = `stroke="rgba(${STROKE})" stroke-width="${STROKE_WIDTH}"`;
    expect(HtmlSvgFactory.svgRectangle(ID, CLASS_NAME, START_X, START_Y, WIDTH,
      HEIGHT, FILL, STROKE, STROKE_WIDTH, DASH_ARRAY)).toContain(EXPECTED_CONTAIN);
  });
  it('should contain the dash array', () => {
    const ID = '1';
    const CLASS_NAME = 'rectangle';
    const START_X = 0;
    const START_Y = 0;
    const WIDTH = 5;
    const HEIGHT = 5;
    const FILL = 'red';
    const STROKE = 'blue';
    const STROKE_WIDTH = 2;
    const DASH_ARRAY = 1;
    const EXPECTED_CONTAIN = `stroke-dasharray="${DASH_ARRAY},${DASH_ARRAY}"/>`;
    expect(HtmlSvgFactory.svgRectangle(ID, CLASS_NAME, START_X, START_Y, WIDTH,
      HEIGHT, FILL, STROKE, STROKE_WIDTH, DASH_ARRAY)).toContain(EXPECTED_CONTAIN);
  });
  it('should call svg circle with the expected parameters', () => {
    const NB_LAYERS = 2;
    const CENTER_X = 2;
    const CENTER_Y = 2;
    const RADIUS = [0, 1, 2];
    const FILL = ['red', 'blue'];
    const STROKE = ['black'];
    const STROKE_WIDTH = [1, 2];
    const RAND_NUM = 10;
    const SPY = spyOn(HtmlSvgFactory, 'svgCircle');
    HtmlSvgFactory.svgDetailedCircle(NB_LAYERS, CENTER_X, CENTER_Y, RADIUS, FILL, STROKE, STROKE_WIDTH);
    expect(SPY).toHaveBeenCalledWith(CENTER_X, CENTER_Y, RAND_NUM, '255,20,147', '255,20,100', 2);
  });
  it('should call svg circle twice', () => {
    const NB_LAYERS = 2;
    const CENTER_X = 2;
    const CENTER_Y = 2;
    const RADIUS = [0, 1];
    const FILL = ['red', 'blue'];
    const STROKE = ['black', 'white'];
    const STROKE_WIDTH = [1, 2];
    const SPY = spyOn(HtmlSvgFactory, 'svgCircle');
    HtmlSvgFactory.svgDetailedCircle(NB_LAYERS, CENTER_X, CENTER_Y, RADIUS, FILL, STROKE, STROKE_WIDTH);
    expect(SPY).toHaveBeenCalledTimes(2);
  });
  it('should contain the circle tag', () => {
    const CENTER_X = 2;
    const CENTER_Y = 2;
    const RADIUS = 5;
    const FILL = 'red';
    const STROKE = 'black';
    const STROKE_WIDTH = 5;
    const EXPECTED_CONTAIN = '<circle';
    expect(HtmlSvgFactory.svgCircle(CENTER_X, CENTER_Y, RADIUS, FILL, STROKE, STROKE_WIDTH)).toContain(EXPECTED_CONTAIN);
  });
  it('should contain the center of the circle', () => {
    const CENTER_X = 2;
    const CENTER_Y = 2;
    const RADIUS = 5;
    const FILL = 'red';
    const STROKE = 'black';
    const STROKE_WIDTH = 5;
    const EXPECTED_CONTAIN = `cx="${CENTER_X}" cy="${CENTER_Y}"`;
    expect(HtmlSvgFactory.svgCircle(CENTER_X, CENTER_Y, RADIUS, FILL, STROKE, STROKE_WIDTH)).toContain(EXPECTED_CONTAIN);
  });
  it('should contain the radius', () => {
    const CENTER_X = 2;
    const CENTER_Y = 2;
    const RADIUS = 5;
    const FILL = 'red';
    const STROKE = 'black';
    const STROKE_WIDTH = 5;
    const EXPECTED_CONTAIN = `r="${RADIUS}"`;
    expect(HtmlSvgFactory.svgCircle(CENTER_X, CENTER_Y, RADIUS, FILL, STROKE, STROKE_WIDTH)).toContain(EXPECTED_CONTAIN);
  });
  it('should contain fill the circle', () => {
    const CENTER_X = 2;
    const CENTER_Y = 2;
    const RADIUS = 5;
    const FILL = 'red';
    const STROKE = 'black';
    const STROKE_WIDTH = 5;
    const EXPECTED_CONTAIN = `r="${RADIUS}"`;
    expect(HtmlSvgFactory.svgCircle(CENTER_X, CENTER_Y, RADIUS, FILL, STROKE, STROKE_WIDTH)).toContain(EXPECTED_CONTAIN);
  });
  it('should contain the stroke', () => {
    const CENTER_X = 2;
    const CENTER_Y = 2;
    const RADIUS = 5;
    const FILL = 'red';
    const STROKE = 'black';
    const STROKE_WIDTH = 5;
    const EXPECTED_CONTAIN = `stroke="rgba(${STROKE})" stroke-width="${STROKE_WIDTH}"/>`;
    expect(HtmlSvgFactory.svgCircle(CENTER_X, CENTER_Y, RADIUS, FILL, STROKE, STROKE_WIDTH)).toContain(EXPECTED_CONTAIN);
  });
  it('should return an empty string', () => {
    expect(HtmlSvgFactory.svgPath()).toEqual('');
  });

  it('should not contain an id if null', () => {
    const ID = null;
    const CLASS_NAME = 'rectangle';
    const START_X = 0;
    const START_Y = 0;
    const WIDTH = 5;
    const HEIGHT = 5;
    const FILL = 'red';
    const STROKE = 'blue';
    const STROKE_WIDTH = 2;
    const DASH_ARRAY = 1;
    expect(HtmlSvgFactory.svgRectangle(ID, CLASS_NAME, START_X, START_Y, WIDTH,
      HEIGHT, FILL, STROKE, STROKE_WIDTH, DASH_ARRAY)).not.toContain('id=');
  });

  it('should not contain a classname if null', () => {
    const ID = null;
    const CLASS_NAME = null;
    const START_X = 0;
    const START_Y = 0;
    const WIDTH = 5;
    const HEIGHT = 5;
    const FILL = 'red';
    const STROKE = 'blue';
    const STROKE_WIDTH = 2;
    const DASH_ARRAY = 1;
    expect(HtmlSvgFactory.svgRectangle(ID, CLASS_NAME, START_X, START_Y, WIDTH,
      HEIGHT, FILL, STROKE, STROKE_WIDTH, DASH_ARRAY)).not.toContain('class=');
  });

  it('should not contain a dash array if null', () => {
    const ID = null;
    const CLASS_NAME = 'rectangle';
    const START_X = 0;
    const START_Y = 0;
    const WIDTH = 5;
    const HEIGHT = 5;
    const FILL = 'red';
    const STROKE = 'blue';
    const STROKE_WIDTH = 2;
    const DASH_ARRAY = null;
    expect(HtmlSvgFactory.svgRectangle(ID, CLASS_NAME, START_X, START_Y, WIDTH,
      HEIGHT, FILL, STROKE, STROKE_WIDTH, DASH_ARRAY)).not.toContain('stroke-dasharray');
  });
});
