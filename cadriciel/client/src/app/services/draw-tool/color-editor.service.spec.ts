import { TestBed } from '@angular/core/testing';

import { ColorEditorService } from './color-editor.service';

describe('ColorEditorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ColorEditorService = TestBed.get(ColorEditorService);
    expect(service).toBeTruthy();
  });
});
