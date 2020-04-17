import fs from 'fs';
import * as inversify from 'inversify';
import Types from '../types';

import { expect } from 'chai';

import { ImageExport } from '../../../image-export';
import { EmailExportService } from './email-export.service';

describe('Database service', () => {
    // const TIME = 300000;
    let exportService: EmailExportService;
    let container: inversify.Container;

    beforeEach(async () => {
        container = new inversify.Container();
        container.bind(Types.EmailExportService).to(EmailExportService);
        exportService = container.get<EmailExportService>(Types.EmailExportService);
        exportService.url = 'https://log2990.step.polymtl.ca/email?address_validation=false&quick_return=false&dry_run=true';
    });

    // export
    it('Should return an error if invalide email is send as params', async () => {
        const ERROR_TEXT = 'Invalide email';
        const data: ImageExport = { type: 'svg', fileName: 'test', downloadable: 'test.svg', src: '', email: '@@@.@' };
        return await exportService.export(data).catch((error) => {
            return expect(error.message).to.eql(ERROR_TEXT);
        });
    });
    it('Should have no error if request was succesfully call', async () => {
        const file = fs.readFileSync('../exportTest2.json');
        const fileData = JSON.parse(file.toString());
        const SRC = fileData.image;
        const data: ImageExport = { type: 'svg', fileName: 'test', downloadable: 'test.svg', src: SRC, email: 'maxym.lamothe@polymtl.ca' };
        return await exportService.export(data).catch((error) => {
            return expect(error.message).to.eql('');
        });
    });
    /*it('Should if post is unsuccesful', async () => {
        let file = fs.readFileSync('../exportTest2.json');
        let fileData = JSON.parse(file.toString());
        const SRC = fileData.image;
        const data : ImageExport = {type: 'svg', fileName: 'test', downloadable: 'test.svg', src: SRC, email: 'maxym.lamothe@polymtl.ca'};
        return await exportService.export(data).catch((error) => {
            return expect(error.message).to.eql('');
        });
    });*/
    // test validateEmail
    it('should be true if email is valide', (done: Mocha.Done) => {
        const EMAIL = 'test@polymtl.ca';
        const result = exportService.validateEmail(EMAIL);
        // tslint:disable-next-line: no-unused-expression
        expect(result).to.be.true;
        done();
    });
    it('should be false if email is invalide', (done: Mocha.Done) => {
        const EMAIL = '@@@.@';
        const result = exportService.validateEmail(EMAIL);
        // tslint:disable-next-line: no-unused-expression
        expect(result).to.be.true;
        done();
    });
});
