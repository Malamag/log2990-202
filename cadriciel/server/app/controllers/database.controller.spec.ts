import * as inversify from 'inversify';

import Types from '../types';
import {
    Collection,/* FilterQuery,*/ MongoClient,/*, MongoClientOptions, UpdateQuery*/
    Db
} from 'mongodb';
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
    let db: Db;
    beforeEach(async () => {
        containerSer = new inversify.Container();
        containerSer.bind(Types.DatabaseService).to(DatabaseService);
        dbService = containerSer.get<DatabaseService>(Types.DatabaseService);
        dbController = new DatabaseController(dbService);
        app = new Application(dbController);

    });
    async function initDB() {
        await server.getConnectionString()
            .then(async (url) => {
                return await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
                    .then(async (client) => {
                        return await server.getDbName()
                            .then(async (dbName) => {
                                db = client.db(dbName);
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
    }
    //getAll
    it('should return NO_CONTENT status if Get allImages was call successfully', async () => {
        await initDB();
        return await chai.request(app.app).get('/database/Images')
            .then(res => {
                chai.expect(res).to.have.status(Httpstatus.OK);
            });

    })
    it('should return NOT_FOUND status if Get allImages was call unsuccessfully', async () => {
        return await chai.request(app.app).get('/database/Images')
            .then(res => {
                chai.expect(res).to.have.status(Httpstatus.NOT_FOUND);
            })

    })
    it('should throw an error if Get allImages as fail', async () => {
        await initDB();
        await db.dropDatabase();
        return await chai.request(app.app).get('/database/Images')
            .catch((err) => {
                return Promise.reject(err);
            });

    })
    //getByTags
    it('should return NO_CONTENT status if Get imagesByTags was call successfully', async () => {
        await initDB();
        return await chai.request(app.app).get('/database/Images/:tags')
            .then(res => {
                chai.expect(res).to.have.status(Httpstatus.OK);
            });

    })
    it('should return NOT_FOUND status if Get imagesByTags was call unsuccessfully', async () => {
        return await chai.request(app.app).get('/database/Images/:tags')
            .send({ tags: '@#$T' })
            .then(res => {
                chai.expect(res).to.have.status(Httpstatus.NOT_FOUND);
            })
    })
    it('should throw an error if Get imagesByTags as fail', async () => {
        await initDB();
        await db.dropDatabase();
        return await chai.request(app.app).get('/database/Images/:tags')
            .send('@#$T')
            .catch((err) => {
                return Promise.reject(err);
            });
    })
    //Delete
    it('should return NO_CONTENT status if Delete was call successfully', async () => {
        await initDB();
        return await chai.request(app.app).delete('/database/Images/:id')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'my-auth-token')
            .then(res => {
                chai.expect(res).to.have.status(Httpstatus.NO_CONTENT);
            })
            .catch();
    })
    it('should return NOT_FOUND status if Delete was call unsuccessfully', async () => {
        return await chai.request(app.app).delete('/database/Images/:id')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'my-auth-token')
            .then(res => {
                chai.expect(res).to.have.status(Httpstatus.NOT_FOUND);
            })
            .catch();
    })
    it('should throw an error if Delete as fail', async () => {
        await initDB();
        await db.dropDatabase();
        return await chai.request(app.app).delete('/database/Images/:id')
            .catch((err) => {
                return Promise.reject(err);
            });
    })
    //Post
    it('should return OK status if Post was call successfully', async () => {
        await initDB();
        const svg: SVGData = { height: '0', width: '0', innerHTML: ['caucue'], bgColor: 'red' };
        const imageData: ImageData = { id: '30', svgElement: svg, name: 'ok', tags: ['ok'] };
        return await chai.request(app.app).post('/database/saveImage')
            .send(imageData)
            .then(res => {
                chai.expect(res).to.have.status(Httpstatus.OK);
            });

    })
    it('should return NO_FOUND status if Post was call unsuccessfully', async () => {
        return await chai.request(app.app).post('/database/saveImage')
            .then(res => {
                chai.expect(res).to.have.status(Httpstatus.NOT_FOUND);
            });
    })
});
