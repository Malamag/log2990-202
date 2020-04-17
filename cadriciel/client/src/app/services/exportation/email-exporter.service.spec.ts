import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MatSnackBarConfig, MatSnackBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { EmailExporterService } from './email-exporter.service';

fdescribe('EmailExporterService', () => {
  let service: EmailExporterService;
  // tslint:disable-next-line: no-any
  let elementStub: any;
  // tslint:disable-next-line: no-any
  let nativeElemStub: any;
  // tslint:disable-next-line: no-any
  let ctxStub: any;
  // tslint:disable-next-line: no-any
  let httpSpy: jasmine.SpyObj<HttpClient>;
  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['post']);
    ctxStub = {
      drawImage: (img: CanvasImageSource, dx: number, dy: number) => 1,
    };
    nativeElemStub = {
      toDataURL: (data: string, size: number) => '0',
      getContext: (ctx: string) => ctxStub, // true in an if-clause
    };
    elementStub = {
      nativeElement: nativeElemStub,
    };
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpSpy }],
      imports: [
        HttpClientModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
      ]
    });
    service = TestBed.get(EmailExporterService);
    httpSpy.post.and.returnValue(of([]));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should create an url from an svg element', () => {
    spyOn(service.xmlSerializer, 'serializeToString').and.returnValue('lol');
    const URL = service.svgToURL(elementStub);
    expect(URL).toBeDefined();
  });

  it('should post the request and catch the error with a display', () => {
    const NAME = 'hello';
    const FORMAT = '.jep';
    const DATA_SRC = 'www.';
    const ERROR = new Error('hello');
    const MAIL = 'xxxxx@yyy.zz';
    httpSpy.post.and.returnValue(of([ERROR]));
    const SPY = spyOn(service, 'displayFeedback');
    service.send(NAME, FORMAT, DATA_SRC, MAIL);
    of([ERROR]).subscribe(() => {
      expect(SPY).toHaveBeenCalled();
    });
  });
  it('should display a success message after post', () => {
    const NAME = 'hello';
    const FORMAT = '.jep';
    const DATA_SRC = 'www.';
    const MAIL = 'xxxxx@yyy.zz';
    const MESSAGE = 'envoie avec succès';
    httpSpy.post.and.returnValue(of([]));
    const SPY = spyOn(service, 'displayFeedback');
    service.send(NAME, FORMAT, DATA_SRC, MAIL);
    of([]).subscribe(() => {
      expect(SPY).toHaveBeenCalledWith(MESSAGE);
    });
  });
  it('should load the image in the canvas', async () => {
    const NAME = 'hello';
    const FORMAT = '.jep';
    const MAIL = 'xxxxx@yyy.zz';
    const SPY = spyOn(service, 'loadImageInCanvas').and.callThrough();
    service.svgToURL = () => '../../assets/images/bruit1.png';
    service.exportByMail(elementStub, NAME, nativeElemStub, FORMAT, MAIL);
    expect(SPY).toHaveBeenCalled();
  });
  it('should export canvas in svg from image url', () => {
    const TYPE = 'svg';
    const NAME = 'monDessin';
    const MAIL = 'xxxxx@yyy.zz';
    service.imageURL = 'someURL';
    const SPY = spyOn(service, 'send');
    service.exportCanvas(NAME, TYPE, elementStub, MAIL);
    expect(SPY).toHaveBeenCalledWith(NAME, TYPE, service.imageURL, MAIL);
  });

  it('should export canvas with data encode if jpeg or png', () => {
    const TYPE = 'png';
    const NAME = 'monDessin';
    const MAIL = 'xxxxx@yyy.zz';
    const SPY = spyOn(service, 'send');

    service.exportCanvas(NAME, TYPE, nativeElemStub, MAIL);
    expect(SPY).toHaveBeenCalledWith(NAME, TYPE, '0', MAIL);
  });
  it('should open the snack bar with the message', () => {
    const MESSAGE = 'hello';
    // tslint:disable-next-line: no-string-literal
    const OPEN_SPY = spyOn(service['snackBar'], 'open');
    const DURATION = 2500;
    const CONFIG = new MatSnackBarConfig();
    CONFIG.duration = DURATION;
    service.displayFeedback(MESSAGE);
    expect(OPEN_SPY).toHaveBeenCalledWith(MESSAGE, undefined, CONFIG);
  });

  it('should draw the image in the context', () => {

    const SPY_LOAD = spyOn(service, 'loadImageInCanvas').and.callThrough();
    service.svgToURL = () => '../../assets/images/bruit1.png';

    service.exportByMail(elementStub, 'someName', nativeElemStub, 'someType', 'someAdress');
    expect(SPY_LOAD).toHaveBeenCalled();

  });
});
