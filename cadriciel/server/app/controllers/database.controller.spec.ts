import * as inversify from 'inversify';

import Types from '../types';
import { Collection,/* FilterQuery,*/ MongoClient/*, MongoClientOptions, UpdateQuery*/ } from 'mongodb';
import { DatabaseController } from './database.controller';
import { MongoMemoryServer as MMS } from 'mongodb-memory-server';
import { MetaData } from '../metadata';
import { DatabaseService } from '../services/database.service';
import { ImageData } from '../../../image-data';
import { SVGData } from '../../../svg-data';
import chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';
import { Application } from '../app';
import * as Httpstatus from 'http-status-codes';

chai.use(chaiHttp);

describe('Database service', () => {

    let dbService: DatabaseService;
    let dbController: DatabaseController;
    let containerSer: inversify.Container;
    let server = new MMS();
    let app: Application;
    beforeEach(async () => {
        containerSer = new inversify.Container();
        containerSer.bind(Types.DatabaseService).to(DatabaseService);
        dbService = containerSer.get<DatabaseService>(Types.DatabaseService);
        dbController = new DatabaseController(dbService);
        app = new Application(dbController);
        await server.getConnectionString()
            .then(async (url) => {
                return await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
                    .then(async (client) => {
                        return await server.getDbName()
                            .then(async (dbName) => {
                                let db = client.db(dbName);
                                return await db.createCollection('test', { size: 512000, w: 'majority' })
                                    .then(async (collection: Collection<MetaData>) => {
                                        dbService.collection = collection;
                                        console.log('Collection succesfully created')
                                        return Promise.resolve();
                                    })
                                    .catch(() => { console.log('Fail to create collection') });
                            })
                            .catch(() => { console.log('Fail to get db name') });
                    })
                    .catch(() => { console.log('Fail to connect to client') });
            })
            .catch(() => { console.log('Fail to get db url') });
        dbService.jsonFile = '../jsonTest.json';
        try { dbService.clearData(); }
        catch{ }
        const svg: SVGData = { height: '0', width: '0', innerHTML: ['caucue'], bgColor: 'red' };
        // create 10 images with id 0 to 9 for testing purpose
        for (let i = 0; i < 10; i++) {
            let imageData: ImageData = { id: i.toString(), svgElement: svg, name: 'ok', tags: ['ok'] };
            await dbService.saveImage(imageData);
        }
    });
    //getAll
    it('should Get all images in database', async () => {
        return await chai.request(app.app).get('/Images')
            .then(res => {
                chai.expect(res).to.have.status(Httpstatus.OK);
            });

    })
    it('should return NOT_FOUND if request fail', async () => {
        return await chai.request(app.app).get('/Images')
            .then(res => {
                chai.expect(res).to.have.status(Httpstatus.NOT_FOUND);
            });

    })
    //getByTags
    it('should return true if request is ok', async () => {
        return await chai.request(app.app).get('/Images/:tags')
            .then(res => {
                chai.expect(res).to.have.status(Httpstatus.OK);
            });

    })
    it('should return NOT_FOUND if request as fail', async () => {
        return await chai.request(app.app).get('/Images/:tags')
            .then(res => {
                chai.expect(res).to.have.status(Httpstatus.NOT_FOUND);
            });

    })
    //Delete
    it('should Get all images in database', async () => {
        return await chai.request(app.app).delete('/Images/:id')
            .then(res => {
                chai.expect(res).to.have.status(Httpstatus.OK);
            });

    })
    it('should return NOT_FOUND if request fail', async () => {
        return await chai.request(app.app).delete('/Images/:id')
            .then(res => {
                chai.expect(res).to.have.status(Httpstatus.NOT_FOUND);
            });
    })
    //Post
    it('should Get all images in database', async () => {
        return await chai.request(app.app).post('/saveImage')
            .then(res => {
                chai.expect(res).to.have.status(Httpstatus.OK);
            });

    })
    it('should return NOT_FOUND if request fail', async () => {
        return await chai.request(app.app).post('/saveImage')
            .then(res => {
                chai.expect(res).to.have.status(Httpstatus.NOT_FOUND);
            });
    })
});
