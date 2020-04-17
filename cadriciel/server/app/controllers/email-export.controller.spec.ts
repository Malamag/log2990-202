import chai from 'chai';
import chaiHttp from 'chai-http';
import fs from 'fs';
import * as Httpstatus from 'http-status-codes';
import * as inversify from 'inversify';
import 'mocha';

import { ImageExport } from '../../../image-export';
import { Application } from '../app';
import { DatabaseService } from '../services/database.service';
import { EmailExportService } from '../services/email-export.service';
import Types from '../types';
import { DatabaseController } from './database.controller';
import { EmailExportController } from './email-export.controller';

chai.use(chaiHttp);

describe('Database service', () => {
    const TIME = 300000;
    let exportService: EmailExportService;
    let exportController: EmailExportController;
    let containerEx: inversify.Container;
    let dbService: DatabaseService;
    let dbController: DatabaseController;
    let containerSer: inversify.Container;
    let app: Application;

    beforeEach(async () => {
        containerSer = new inversify.Container();
        containerSer.bind(Types.DatabaseService).to(DatabaseService);
        dbService = containerSer.get<DatabaseService>(Types.DatabaseService);
        dbController = new DatabaseController(dbService);
        containerEx = new inversify.Container();
        containerEx.bind(Types.EmailExportService).to(EmailExportService);
        exportService = containerEx.get<EmailExportService>(Types.EmailExportService);
        exportController = new EmailExportController(exportService);
        app = new Application(dbController, exportController);
        exportService.url = 'https://log2990.step.polymtl.ca/email?address_validation=false&quick_return=false&dry_run=true';
    });
    // Post
    it('should return OK status if Post was call successfully', async () => {
        const file = fs.readFileSync('../exportTest2.json');
        const fileData = JSON.parse(file.toString());
        const SRC = fileData.image;
        const data: ImageExport = {type: 'svg', fileName: 'test', downloadable: 'test.svg', src: SRC, email: 'maxym.lamothe@polymtl.ca'};
        return await chai.request(app.app).post('/mail/export')
            .send(data)
            .then((res) => {
                chai.expect(res).to.have.status(Httpstatus.OK);
            });

    }).timeout(TIME);
    it('should return NO_FOUND status if Post was call unsuccessfully', async () => {
        const file = fs.readFileSync('../exportTest.json');
        const fileData = JSON.parse(file.toString());
        const SRC = fileData.image;
        const data: ImageExport = {type: 'svg', fileName: 'test', downloadable: 'test.svg', src: SRC, email: 'maxym.lamothe@polymtl.ca'};
        return await chai.request(app.app).post('/mail/export')
            .send(data)
            .then((res) => {
                chai.expect(res).to.have.status(Httpstatus.REQUEST_TOO_LONG);
            });
    });
    it('should return an error  if email is invalide', async () => {
        const data: ImageExport = {type: 'svg', fileName: 'test', downloadable: 'test.svg', src: '', email: '@@@.@'};
        return await chai.request(app.app).post('/mail/export')
            .send(data)
            .then((res) => {
                chai.expect(res.text).to.eql('Invalide email');
            });
    }).timeout(TIME);

});
