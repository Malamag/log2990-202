import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
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
  //let httpStub: any;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  beforeEach(() => {
    /*httpStub = {
      post:
      {
        //value: () => 0,
        subscribe: () => 0,
      }
    }*/
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
    providers: [{provide: HttpClient, useValue: httpSpy}],
    imports: [
      HttpClientModule,
    ]
    });
    service = TestBed.get(EmailExporterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should create an url from an svg element', () => {
    spyOn(service.xmlSerializer, 'serializeToString').and.returnValue('lol');
    const URL = service.svgToURL(elementStub);
    expect(URL).toBeDefined();
  });
  /*
  it('should post the request', () => {
    const NAME = 'hello';
    const FORMAT = '.jep';
    const DATA_SRC = 'www.';
    const MAIL = 'xxxxx@yyy.zz';
    service.send(NAME, FORMAT, DATA_SRC, MAIL);
    expect(httpSpy.post.calls.count).toEqual(1);
  });*/
  it('should load the image in the canvas', async() => {
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
});
