import { TestBed } from '@angular/core/testing';
import { SVGData } from '../../../../../svg-data';
import { AutoSaveService } from './auto-save.service';

describe('AutoSaveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });
  it('should be created', () => {
    const SERVICE: AutoSaveService = TestBed.get(AutoSaveService);
    expect(SERVICE).toBeTruthy();
  });
  it('should clear the local storage before saving the data', () => {
    const NB_CALLS = 5;
    const CLEAR_SPY = spyOn(localStorage, 'clear');
    const SET_SPY = spyOn(localStorage, 'setItem');
    const HTML_CONTAINER: string[] = [
      'hello',
      'world',
    ];
    const DATA: SVGData = {height: '750', width: '1438', bgColor: 'ffffff', innerHTML: HTML_CONTAINER};
    const SERVICE: AutoSaveService = TestBed.get(AutoSaveService);
    SERVICE.saveLocal(DATA);
    expect(CLEAR_SPY).toHaveBeenCalledBefore(SET_SPY);
    expect(SET_SPY).toHaveBeenCalledTimes(NB_CALLS);
  });
  it('should not ask for doodle before an edit', () => {
    const SERVICE: AutoSaveService = TestBed.get(AutoSaveService);
    // tslint:disable-next-line: no-string-literal
    SERVICE['interact'].drawingDone.next(false);
    // tslint:disable-next-line: no-string-literal
    const SPY = spyOn(SERVICE['doodle'], 'askForDoodle');
    SERVICE.editingSave();
    expect(SPY).not.toHaveBeenCalled();
  });
  it('should ask for doodle before getting the data and saving it after an edit action', () => {
    const SERVICE: AutoSaveService = TestBed.get(AutoSaveService);
    const HTML_CONTAINER: string[] = [
      'hello',
      'world',
    ];
    const DATA: SVGData = {height: '750', width: '1438', bgColor: 'ffffff', innerHTML: HTML_CONTAINER};
    // tslint:disable-next-line: no-string-literal
    const ASK_SPY = spyOn(SERVICE['doodle'], 'askForDoodle');
    // tslint:disable-next-line: no-string-literal
    spyOn(SERVICE['doodle'], 'getDrawingDataNoGrid').and.returnValue(DATA);
    const SAVE_SPY = spyOn(SERVICE, 'saveLocal');
    // tslint:disable-next-line: no-string-literal
    SERVICE['interact'].emitDrawingDone();
    SERVICE.editingSave();
    expect(ASK_SPY).toHaveBeenCalledBefore(SAVE_SPY);
    expect(SAVE_SPY).toHaveBeenCalled();
  });
  it('should not ask for doodle before creating a new drawing', () => {
    const SERVICE: AutoSaveService = TestBed.get(AutoSaveService);
    // tslint:disable-next-line: no-string-literal
    SERVICE['interact'].drawingContinued.next(false);
    // tslint:disable-next-line: no-string-literal
    const SPY = spyOn(SERVICE['doodle'], 'askForDoodle');
    SERVICE.editingSave();
    expect(SPY).not.toHaveBeenCalled();
  });
  it('should ask for doodle before getting the data and saving it after creating a new drawing', () => {
    const SERVICE: AutoSaveService = TestBed.get(AutoSaveService);
    const HTML_CONTAINER: string[] = [
      '',
      '',
    ];
    const DATA: SVGData = {height: '750', width: '1438', bgColor: 'ffffff', innerHTML: HTML_CONTAINER};
    // tslint:disable-next-line: no-string-literal
    const ASK_SPY = spyOn(SERVICE['doodle'], 'askForDoodle');
    // tslint:disable-next-line: no-string-literal
    spyOn(SERVICE['doodle'], 'getDrawingDataNoGrid').and.returnValue(DATA);
    const SAVE_SPY = spyOn(SERVICE, 'saveLocal');
    // tslint:disable-next-line: no-string-literal
    SERVICE['interact'].emitContinueDrawing();
    SERVICE.editingSave();
    expect(ASK_SPY).toHaveBeenCalledBefore(SAVE_SPY);
    expect(SAVE_SPY).toHaveBeenCalled();
  });
});
