
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
    //let testCollection: Collection<MetaData>;
    //let client: MongoClient;
    //let assert = require('assert');

    before(async () => {
        container = new inversify.Container();
        container.bind(Types.DatabaseService).to(DatabaseService);
        dbService = container.get<DatabaseService>(Types.DatabaseService);
        await server.getConnectionString()
            .then((url) => {
                MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
                    .then((client) => {
                        server.getDbName()
                            .then((dbName) => {
                                let db = client.db(dbName);
                                db.createCollection('test', { size: 512000, w: 'majority' })
                                    .then((collection: Collection<MetaData>) => {
                                        dbService.collection = collection;
                                        console.log('Collection succesfully created')
                                    })
                                    .catch(() => { console.log('Fail to create collection') });
                            })
                            .catch(() => { console.log('Fail to get db name') });
                    })
                    .catch(() => { console.log('Fail to connect to client') });
            })
            .catch(() => { console.log('Fail to get db url') });
        dbService.jsonFile = '../jsonTest.json';
        const svg: SVGData = { height: '0', width: '0', innerHTML: ['caucue'], bgColor: 'red' };
        const imageData: ImageData = { id: '1', svgElement: svg, name: 'ok', tags: ['ok'] };
        await dbService.saveImage(imageData);
    });
    afterEach(() => {
    })
    //test connect() yes/no
    //test getAllImages() expect/spy getImages()
    //test getImagesByTags() expect stringToArray - expect/spy getImages() - tags test - expect/spy searchTag()
    //test getImages() expect matching id
    it('should expect a lenght of one for a seach of one existing image', async () => {
        const metaData: MetaData[] = [{ id: '1', name: 'ok', tags: ['ok'] }];
        const result = await dbService.getImages(metaData);
        return expect(result).to.have.length(1);
    })
    it('should expect a lenght of zero for a seach of one not existing image', async () => {
        const metaData: MetaData[] = [{ id: '1001', name: 'ok', tags: ['ok'] }];
        return expect(dbService.getImages(metaData)).to.have.length(0);
    })
    /*it('should expect a lenght of a 5 for a seach of 5 existing image', (done: Mocha.Done) => {
        const metaData: MetaData[] = [{ id: '1001', name: '', tags: [''] }];
        expect(dbService.getImages(metaData)).to.have.length(0);
        done();
    })*/
    //test searchTag()
    it('should expect to be true if tag is include in tags array', (done: Mocha.Done) => {
        const tag = 'al';
        const tags = ['allo', 'red', 'lol'];
        expect(dbService.searchTag(tag, tags)).to.be.true;
        done();
    })
    it('should expect to be false if tag is not include in tags array', (done: Mocha.Done) => {
        const tag = 'w';
        const tags = ['allo', 'red', 'lol'];
        expect(dbService.searchTag(tag, tags)).to.be.false;
        done();
    })
    //test stringToArray()
    it('should change string to array format', (done: Mocha.Done) => {
        const str = 'al,blue,reg,black';
        const strArray = ['al', 'blue', 'reg', 'black'];
        let result = dbService.stringToArray(str);
        for (let i = 0; i < result.length; i++) {
            expect(result[i]).to.be.equal(strArray[i]);
        }
        done();
    })
    //test deleteImageById()
    /*it('should delete the image with the choosen id', async () => {
        //const svg: SVGData = { height: '0', width: '0', innerHTML: ['caucue'], bgColor: 'red' };
        //const imageData: ImageData = { id: '10', svgElement: svg, name: 'ok', tags: ['ok'] };
        //await dbService.saveImage(imageData);
        await dbService.deleteImageById('1');
        //const metaData: MetaData[] = [{ id: '1', name: 'ok', tags: ['ok'] }];
        return expect(dbService.collection.find({})).to.have.length(1);
    })*/
    //test saveImage()
    //test validateImageData()
    /*it('should not accept image if collection is full', async () => {
        const MAX_DATA_AMOUNT = 1000;
        const svg: SVGData = { height: '0', width: '0', innerHTML: ['caucue'], bgColor: 'red' };
        for (let i = 0; i < MAX_DATA_AMOUNT; i++) {
            let imageData: ImageData = { id: i.toString(), svgElement: svg, name: 'ok', tags: ['ok'] };
            await dbService.saveImage(imageData);
            for (let j = 0; j < 50; j++) {
                console.log('waiting');
            }
        }
        const imageData: ImageData = { id: '1001', svgElement: svg, name: '', tags: [''] };
        return await dbService.validateImageData(imageData).should.eventually.equal(null);
    })*/
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
