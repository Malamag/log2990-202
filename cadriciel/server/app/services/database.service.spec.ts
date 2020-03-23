
import * as inversify from 'inversify';

import Types from '../types';

import { Collection,/* FilterQuery,*/ MongoClient/*, MongoClientOptions, UpdateQuery*/ } from 'mongodb';
import { DatabaseService } from './database.service';
import { expect } from 'chai';
import { ImageData } from '../../../image-data';
import { SVGData } from '../../../svg-data';
//import { MetaData } from '../metadata'
import { MongoMemoryServer as MMS } from 'mongodb-memory-server';
import { MetaData } from '../metadata';

describe('Database service', () => {

    let dbService: DatabaseService;
    let container: inversify.Container;
    let server = new MMS();
    //let client: MongoClient;
    //let assert = require('assert');

    beforeEach(() => {
        server.getConnectionString()
            .then((url) => {
                MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
                    .then((client) => {
                        server.getDbName()
                            .then((dbName) => {
                                let db = client.db(dbName);
                                db.createCollection('test')
                                    .then((collection: Collection<MetaData>) => {
                                        dbService.collection = collection;
                                    })
                            })
                    })
            })
            .catch(() => { });
        container = new inversify.Container();
        container.bind(Types.DatabaseService).to(DatabaseService);
        dbService = container.get<DatabaseService>(Types.DatabaseService);
    });
    afterEach(() => {
        dbService.collection.remove({})
            .then(() => { })
            .catch(() => { });
    })
    //test connect() yes/no
    //test getAllImages() expect/spy getImages()
    //test getImagesByTags() expect stringToArray - expect/spy getImages() - tags test - expect/spy searchTag()
    //test getImages() expect matching id
    //test searchTag()
    //test stringToArray()
    //test deleteImageById()
    //test saveImage()
    //test validateImageData()
    it('should not accept image if collection is full', async function () {
        const MAX_DATA_AMOUNT = 1000;
        for (let i = 0; i < MAX_DATA_AMOUNT; i++) {
            dbService.collection.insertOne({ id: i.toString(), name: "", tags: [""] })
                .then(() => { })
                .catch(() => { });
        }
        const svg: SVGData = { height: '0', width: '0', innerHTML: [''], bgColor: '' };
        const imageData: ImageData = { id: '0', svgElement: svg, name: '', tags: [''] };
        return await dbService.validateImageData(imageData).should.be.null;
    })
    //test validateId()
    it('should accept an unique Id', (done: Mocha.Done) => {
        const svg: SVGData = { height: '0', width: '0', innerHTML: [''], bgColor: '' };
        const imagesData: ImageData[] = [{ id: '0', svgElement: svg, name: '', tags: [''] }]
        expect(dbService.validateId('1', imagesData)).to.be.true;
        done();
    });
    it('should not accept an not unique Id', (done: Mocha.Done) => {
        const svg: SVGData = { height: '0', width: '0', innerHTML: [''], bgColor: '' };
        const imagesData: ImageData[] = [{ id: '0', svgElement: svg, name: '', tags: [''] }]
        expect(dbService.validateId('0', imagesData)).to.be.false;
        done();
    });
    //test validateName()
    it('should accept an not empty name', (done: Mocha.Done) => {
        expect(dbService.validateName('adhvr')).to.be.true;
        done();
    });
    it('should not accept an empty name', (done: Mocha.Done) => {
        expect(dbService.validateName('')).to.be.false;
        done();
    });
    //test validateTag()
    it('should accept valide characters', (done: Mocha.Done) => {
        expect(dbService.validateTags(['kkoloo', 'afhhsy'])).to.be.true;
        done();
    });
    it('should not accept invalide characters', (done: Mocha.Done) => {
        expect(dbService.validateTags(['@34,/', 'afhhsy'])).to.be.false;
        done();
    });
});
