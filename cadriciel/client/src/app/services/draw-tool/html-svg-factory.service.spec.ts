import { TestBed } from '@angular/core/testing';

import { HtmlSvgFactory } from './html-svg-factory.service';

describe('HtmlSvgFactoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HtmlSvgFactory = TestBed.get(HtmlSvgFactory);
    expect(service).toBeTruthy();
  });
});
