import { TestBed } from '@angular/core/testing';

import { HtmlSvgFactory } from './html-svg-factory.service';

describe('HtmlSvgFactoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const SERVICE: HtmlSvgFactory = TestBed.get(HtmlSvgFactory);
    expect(SERVICE).toBeTruthy();
  });
});
