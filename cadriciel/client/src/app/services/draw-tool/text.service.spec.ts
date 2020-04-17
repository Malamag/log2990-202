
import { Renderer2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Point } from './point';
import { TextService } from './text.service';

describe('TextService', () => {
  let service: TextService;
  let ptA: Point;
  let ptArr: Point[];
  let ptB: Point;
  // tslint:disable-next-line: prefer-const
  let render: Renderer2;
  // tslint:disable-next-line: no-any
  let elem: any;
  // tslint:disable-next-line: no-any
  let fakeChild: any;
  beforeEach(() => {
    fakeChild = {
      tagName: 'text',
      children: [fakeChild]
    };
    elem = {
      children: [fakeChild, fakeChild],
    };
    ptA = new Point(1, 1); // using a point to test position functions
    ptArr = [ptA, ptA];
    ptB = new Point(1, 2);

    TestBed.configureTestingModule({
        providers: [
            TextService,
            // {provide: Point},
            { provide: HTMLElement, useValue: elem },
            { provide: Number, useValue: 0 },
            { provide: String, useValue: '' },
            { provide: Boolean, useValue: true },
            { provide: Renderer2, useValue: render }
            // { provide: InteractionService, useClass: FakeInteractionService },
            // { provide: KeyboardHandlerService, useValue: kbServiceStub },
        ],
    });
    service = TestBed.get(TextService);
  });

  it('should be created', () => {
    const SERVICE: TextService = TestBed.get(TextService);
    expect(SERVICE).toBeTruthy();
  });

  it('should create a text element', () => {
    const PATH = service.createPath(ptArr);
    expect(PATH).toContain('<text');
  });
  it('should return true', () => {
    // tslint:disable-next-line: no-string-literal
    service['foundAnItem'] = true;
    // tslint:disable-next-line: no-string-literal
    service['itemUnderMouse'] = 1;
    service.drawing = elem;
    expect(service.isMouseClickingText()).toBeTruthy();
  });
  it('should change the text alignment', () => {
    const ALIGNMENT = 'R';
    // tslint:disable-next-line: no-string-literal
    service['attr'].alignment = ALIGNMENT;
    const PATH = service.createPath(ptArr);

    // tslint:disable-next-line: no-string-literal
    expect(PATH).toContain('text-anchor="end"');
  });

  it('should return the text alignment as middle', () => {
    const ALIGNMENT = 'C';
    // tslint:disable-next-line: no-string-literal
    service['attr'].alignment = ALIGNMENT;
    const FUNCTION = service.getTextAlignement();

    // tslint:disable-next-line: no-string-literal
    expect(FUNCTION).toBe('middle');
  });
  it('should return the text alignment as end', () => {
    // tslint:disable-next-line: no-string-literal
    service['attr'].alignment = 'R';
    expect(service.getTextAlignement()).toEqual('end');
  });
  it('should return the text alignment as start', () => {
    // tslint:disable-next-line: no-string-literal
    service['attr'].alignment = 'L';
    expect(service.getTextAlignement()).toEqual('start');
  });
  it('should change the text to bold', () => {
    const BOLD = true;
    // tslint:disable-next-line: no-string-literal
    service['attr'].isBold = BOLD;
    const PATH = service.createPath(ptArr);

    // tslint:disable-next-line: no-string-literal
    expect(PATH).toContain('font-weight="bold"');
  });

  it('should return the bold font weight', () => {
    const BOLD = true;
    // tslint:disable-next-line: no-string-literal
    service['attr'].isBold = BOLD;
    const FUNCTION = service.getFontWeight();

    // tslint:disable-next-line: no-string-literal
    expect(FUNCTION).toBe('bold');
  });
  it('should return the normal font weight', () => {
    // tslint:disable-next-line: no-string-literal
    service['attr'].isBold = false;
    expect(service.getFontWeight()).toEqual('normal');
  });

  it('should change the font size', () => {
    const FONT_SIZE = 50;
    // tslint:disable-next-line: no-string-literal
    service['attr'].fontSize = FONT_SIZE;
    const PATH = service.createPath(ptArr);

    // tslint:disable-next-line: no-string-literal
    expect(PATH).toContain('font-size="50"');
  });

  it('should change the text to italic', () => {
    const ITALIC = true;
    // tslint:disable-next-line: no-string-literal
    service['attr'].isItalic = ITALIC;
    const PATH = service.createPath(ptArr);

    // tslint:disable-next-line: no-string-literal
    expect(PATH).toContain('font-style="italic"');
  });

  it('should return an italic style', () => {
    const ITALIC = true;
    // tslint:disable-next-line: no-string-literal
    service['attr'].isItalic = ITALIC;
    const FUNCTION = service.getFontStyle();

    // tslint:disable-next-line: no-string-literal
    expect(FUNCTION).toBe('italic');
  });
  it('should get a normal font style', () => {
    // tslint:disable-next-line: no-string-literal
    service['attr'].isItalic = false;
    expect(service.getFontStyle()).toBe('normal');
  });

  it('should change the font family', () => {
    const FONT_FAMILY = 'Courier';
    // tslint:disable-next-line: no-string-literal
    service['attr'].fontFamily = FONT_FAMILY;
    const PATH = service.createPath(ptArr);

    // tslint:disable-next-line: no-string-literal
    expect(PATH).toContain('font-family="Courier"');
  });

  it('should update the current path on mouse down', () => {
    const SPY = spyOn(service, 'updateDrawing');
    service.down(ptA);
    expect(service.currentPath.length).toBe(2); // same point added twice to manage static mouse
    expect(service.currentPath).toContain(ptA);

    expect(SPY).toHaveBeenCalled();
  });

  it('should set the attributes in the subscription', () => {
    service.interaction.emitTextAttributes({ fontSize: 10, fontFamily: 'Arial', alignment: 'R', isBold: false, isItalic: false });
    const SPY_INTERACTION = spyOn(service.interaction.$textAttributes, 'subscribe');
    service.updateAttributes();
    expect(SPY_INTERACTION).toHaveBeenCalled();
    // tslint:disable-next-line: no-string-literal
    expect(service['attr']).toBeDefined();
  });

  it('should update the isDown attribute on mouse up', () => {
    service.down(ptA); // pressing the mouse
    service.up(ptA, true);
    expect(service.isDown).toBeFalsy();
  });

  // This helps not having multiple text spawned on mouse drag
  // Likely to occur when exiting and entering again the canvas.
  it('should update the isDown attribute on mouse move', () => {
    service.down(ptA); // pressing the mouse
    service.move(ptB);
    expect(service.isDown).toBeFalsy();
  });

  it('should not create a text element on another text element', () => {
    const SPY = spyOn(service, 'createPath');
    service.down(ptA); // mouse click
    service.up(ptA, true);

    // Indicate that we are clicking on text
    spyOn(service, 'isMouseClickingText').and.returnValue(true);
    service.down(ptA); // mouse click

    // We expect only the first serice.down to have created a text element
    expect(SPY).toHaveBeenCalledTimes(1);
  });

});
