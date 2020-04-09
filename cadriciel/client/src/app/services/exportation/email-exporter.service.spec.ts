import { TestBed } from '@angular/core/testing';

import { EmailExporterService } from './email-exporter.service';

describe('EmailExporterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EmailExporterService = TestBed.get(EmailExporterService);
    expect(service).toBeTruthy();
  });
});
