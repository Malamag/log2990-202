
import * as inversify from 'inversify';

import Types from '../types';

import { Collection,/* FilterQuery,*/ MongoClient/*, MongoClientOptions, UpdateQuery*/ } from 'mongodb';
import { DatabaseService } from './database.service';
import { expect } from 'chai';
import { ImageData } from '../../../image-data';
import { SVGData } from '../../../svg-data';
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
    });
    beforeEach(async () => {
        const svg: SVGData = { height: '0', width: '0', innerHTML: ['caucue'], bgColor: 'red' };
        // create 10 images with id 0 to 9 for testing purpose
        for (let i = 0; i < 10; i++) {
            let imageData: ImageData = { id: i.toString(), svgElement: svg, name: 'ok', tags: ['ok'] };
            await dbService.saveImage(imageData);
        }
    })
    afterEach(async () => {
        dbService.clearData();
    })
    //test connect() yes/no
    //test getAllImages()
    it('should expect a lenght of ten when getting all images', async () => {
        const result = await dbService.getAllImages();
        return expect(result).to.have.length(10);
    })
    //test getImagesByTags()
    it('should expect a lenght of one for a seach of one existing image', async () => {
        const result = await dbService.getImagesByTags('ok');
        return expect(result).to.have.length(10);
    })
    //test getImages() expect matching id
    it('should expect a lenght of one for a seach of one existing image', async () => {
        const metaData: MetaData[] = [{ id: '1', name: 'ok', tags: ['ok'] }];
        const result = await dbService.getImages(metaData);
        return expect(result).to.have.length(1);
    })
    it('should expect a lenght of zero for a seach of one not existing image', async () => {
        const metaData: MetaData[] = [{ id: '1001', name: 'ok', tags: ['ok'] }];
        const result = await dbService.getImages(metaData);
        return expect(result).to.have.length(0);
    })
    it('should expect a lenght of a 5 for a seach of 5 existing image', async () => {
        const metaData: MetaData[] = [{ id: '1', name: 'ok', tags: [''] },
        { id: '2', name: 'ok', tags: [''] },
        { id: '3', name: 'ok', tags: [''] },
        { id: '4', name: 'ok', tags: [''] },
        { id: '5', name: 'ok', tags: [''] }];
        const result = await dbService.getImages(metaData);
        return expect(result).to.have.length(5);
    })
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
    it('should delete the image with the choosen id', async () => {
        const expectedLenght = (await dbService.getAllImages()).length - 1;
        await dbService.deleteImageById('1');
        const result = await dbService.getAllImages();
        return expect(result).to.have.length(expectedLenght);
    })
    //test saveImage()
    it('should expect a lenght of one more after adding an image to test collection', async () => {
        const expectedLenght = (await dbService.getAllImages()).length + 1;
        const svg: SVGData = { height: '0', width: '0', innerHTML: ['caucue'], bgColor: 'red' };
        const imageData: ImageData = { id: '10', svgElement: svg, name: 'ok', tags: ['ok'] };
        await dbService.saveImage(imageData);
        const result = await dbService.getAllImages();
        return expect(result).to.have.length(expectedLenght);
    })
    //test validateImageData()
    /*it('should not accept image if collection is full', async () => {
        const MAX_DATA_AMOUNT = 1000;
        const svg: SVGData = { height: '0', width: '0', innerHTML: ['caucue'], bgColor: 'red' };
        for (let i = (await dbService.getAllImages()).length - 1; i < MAX_DATA_AMOUNT; i++) {
            let imageData: ImageData = { id: i.toString(), svgElement: svg, name: 'ok', tags: ['ok'] };
            await dbService.saveImage(imageData);
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
