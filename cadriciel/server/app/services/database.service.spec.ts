
import * as inversify from 'inversify';

import Types from '../types';

import { expect } from 'chai';
import { Collection, MongoClient } from 'mongodb';
import { MongoMemoryServer as MMS } from 'mongodb-memory-server';
import { ImageData } from '../../../image-data';
import { SVGData } from '../../../svg-data';
import { MetaData } from '../metadata';
import { DatabaseService } from './database.service';

describe('Database service', () => {
    const TIME = 30000;
    let dbService: DatabaseService;
    let container: inversify.Container;
    const server = new MMS();

    beforeEach(async () => {
        container = new inversify.Container();
        container.bind(Types.DatabaseService).to(DatabaseService);
        dbService = container.get<DatabaseService>(Types.DatabaseService);
    });
    // tslint:disable-next-line: only-arrow-functions - for test purposes
    async function initDB(): Promise<void> {
        // tslint:disable-next-line: deprecation --> needed to test
        await server.getConnectionString()
            .then(async (url: string) => {
                return await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
                    .then(async (client) => {
                        return await server.getDbName()
                            .then(async (dbName: string) => {
                                const db = client.db(dbName);
                                return await db.createCollection('test', { size: 512000, w: 'majority' })
                                    .then(async (collection: Collection<MetaData>) => {
                                        dbService.collection = collection;
                                        console.log('Collection succesfully created');
                                        return Promise.resolve();
                                    })
                                    .catch(() => { console.log('Fail to create collection'); });
                            })
                            .catch(() => { console.log('Fail to get db name'); });
                    })
                    .catch(() => { console.log('Fail to connect to client'); });
            })
            .catch(() => { console.log('Fail to get db url'); });
        dbService.jsonFile = '../jsonTest.json';
        // dbService.clearData().catch(() => { });
        const svg: SVGData = { height: '0', width: '0', innerHTML: ['caucue'], bgColor: 'red' };
        // create 10 images with id 0 to 9 for testing purpose
        const NUM_IMG = 10;
        for (let i = 0; i < NUM_IMG; i++) {
            const imageData: ImageData = { id: i.toString(), svgElement: svg, name: 'ok', tags: ['ok'] };
            await dbService.saveImage(imageData);
        }
    }
    afterEach(async () => {
        dbService.clearData().catch(() => { /* On catch do nothing */ });
    });
    // test getAllImages()
    it('should expect a lenght of ten when getting all images', async () => {
        const LEN = 10;
        await initDB();
        const result = await dbService.getAllImages();
        return expect(result).to.have.length(LEN);
    }).timeout(TIME);
    // test getImagesByTags()
    it('should expect a lenght of 10 for a result of 10 matching image', async () => {
        const LEN = 10;
        await initDB();
        const result = await dbService.getImagesByTags('ok');
        return expect(result).to.have.length(LEN);
    });
    it('should expect a lenght of zero for a result of no matching image', async () => {
        await initDB();
        const result = await dbService.getImagesByTags('blue');
        return expect(result).to.have.length(0);
    });

    // test getImages() expect matching id
    it('should expect a lenght of one for a search of one existing image', async () => {
        await initDB();
        const metaData: MetaData[] = [{ id: '1', name: 'ok', tags: ['ok'] }];
        const result = await dbService.getImages(metaData);
        return expect(result).to.have.length(1);
    });
    it('should expect a lenght of zero for a search of one not existing image', async () => {
        await initDB();
        const metaData: MetaData[] = [{ id: '1001', name: 'ok', tags: ['ok'] }];
        const result = await dbService.getImages(metaData);
        return expect(result).to.have.length(0);
    });
    it('should expect a lenght of a 5 for a search of 5 existing image', async () => {
        const LEN = 5;
        await initDB();
        const metaData: MetaData[] = [{ id: '1', name: 'ok', tags: [''] },
        { id: '2', name: 'ok', tags: [''] },
        { id: '3', name: 'ok', tags: [''] },
        { id: '4', name: 'ok', tags: [''] },
        { id: '5', name: 'ok', tags: [''] }];
        const result = await dbService.getImages(metaData);
        return expect(result).to.have.length(LEN);
    });
    // test searchTag()
    it('should expect to be true if tag is include in tags array', (done: Mocha.Done) => {
        const tag = 'al';
        const tags = ['allo', 'red', 'lol'];
        // tslint:disable-next-line: no-unused-expression
        expect(dbService.searchTag(tag, tags)).to.be.true;
        done();
    });
    it('should expect to be false if tag is not include in tags array', (done: Mocha.Done) => {
        const tag = 'w';
        const tags = ['allo', 'red', 'lol'];
        // tslint:disable-next-line: no-unused-expression
        expect(dbService.searchTag(tag, tags)).to.be.false;
        done();
    });
    // test stringToArray()
    it('should change string to array format', (done: Mocha.Done) => {
        const str = 'al,blue,reg,black';
        const strArray = ['al', 'blue', 'reg', 'black'];
        const result = dbService.stringToArray(str);
        for (let i = 0; i < result.length; i++) {
            expect(result[i]).to.be.equal(strArray[i]);
        }
        done();
    });
    // test deleteImageById()
    it('should delete the image with the choosen id', async () => {
        await initDB();
        const expectedLenght = (await dbService.getAllImages()).length - 1;
        await dbService.deleteImageById('1');
        const result = await dbService.getAllImages();
        return expect(result).to.have.length(expectedLenght);
    });
    it('should throw an error if fail to delete image', async () => {
        await initDB();
        const ERROR = new Error("Imposible de supprimer l'image");
        return await dbService.deleteImageById('1101').catch((err) => {
            // return Promise.reject(err);
            expect(err).to.equal(ERROR);
        });
    });
    // test saveImage()
    it('should expect a lenght of one more after adding an image to test collection', async () => {
        await initDB();
        const expectedLenght = (await dbService.getAllImages()).length + 1;
        const svg: SVGData = { height: '0', width: '0', innerHTML: ['caucue'], bgColor: 'red' };
        const imageData: ImageData = { id: '10', svgElement: svg, name: 'ok', tags: ['ok'] };
        await dbService.saveImage(imageData);
        const result = await dbService.getAllImages();
        return expect(result).to.have.length(expectedLenght);
    });
    it('should throw an error if image to save is invalide', async () => {
        await initDB();
        const ERROR = new Error('Empty name');
        const svg: SVGData = { height: '0', width: '0', innerHTML: [''], bgColor: '' };
        const imageData: ImageData = { id: '0', svgElement: svg, name: '', tags: [''] };
        return dbService.saveImage(imageData).catch((err) => {
            return expect(err).to.equal(ERROR);
        });
    });
    // test save()
    it('should throw an error if save() fail to insert image', async () => {
        await initDB();
        const svg: SVGData = { height: '0', width: '0', innerHTML: ['caucue'], bgColor: 'red' };
        const imageData: ImageData = { id: '10', svgElement: svg, name: 'ok', tags: ['ok'] };
        return dbService.save(imageData).catch(async (err: Error) => {
            return Promise.reject(err);
        });
    });
    // test validateImageData()
    it('should not accept image if collection is full', async () => {
        await initDB();
        const INCR = 10;
        // const ERROR = new Error('Collection is full');
        const MAX_DATA_AMOUNT = 1000;
        const svg: SVGData = { height: '0', width: '0', innerHTML: ['caucue'], bgColor: 'red' };
        for (let i = 10; i < MAX_DATA_AMOUNT + INCR; i++) {
            const imageData: ImageData = { id: i.toString(), svgElement: svg, name: 'ok', tags: ['ok'] };
            await dbService.saveImage(imageData).catch(async (err: Error) => {
                return Promise.reject(err);
            });
        }
    }).timeout(TIME);
    it('should not accept an invalide name', async () => {
        await initDB();
        const ERROR = new Error('Empty name');
        const svg: SVGData = { height: '0', width: '0', innerHTML: [''], bgColor: '' };
        const imageData: ImageData = { id: '0', svgElement: svg, name: '', tags: [''] };
        return dbService.saveImage(imageData).catch((err) => {
            return expect(err).to.equal(ERROR);
        });
    });
    it('should not accept an invalide tag', async () => {
        await initDB();
        const ERROR = new Error('Invalide tags');
        const svg: SVGData = { height: '0', width: '0', innerHTML: [''], bgColor: '' };
        const imageData: ImageData = { id: '0', svgElement: svg, name: 'ok', tags: ['@#$%'] };
        return dbService.saveImage(imageData).catch((err) => {
            return expect(err).to.equal(ERROR);
        });
    });
    it('should accept a valide image', async () => {
        await initDB();
        const svg: SVGData = { height: '0', width: '0', innerHTML: [''], bgColor: '' };
        const imagesData: ImageData = { id: '0', svgElement: svg, name: 'ok', tags: ['ok'] };
        const result = await (dbService.validateImageData(imagesData));
        return expect(result).to.be.not.null;
    });
    // test validateId()
    it('should accept an unique Id', (done: Mocha.Done) => {
        const svg: SVGData = { height: '0', width: '0', innerHTML: [''], bgColor: '' };
        const imagesData: ImageData[] = [{ id: '0', svgElement: svg, name: '', tags: [''] }];
        // tslint:disable-next-line: no-unused-expression
        expect(dbService.validateId('1', imagesData)).to.be.true;
        done();
    });
    it('should not accept an not unique Id', (done: Mocha.Done) => {
        const svg: SVGData = { height: '0', width: '0', innerHTML: [''], bgColor: '' };
        const imagesData: ImageData[] = [{ id: '0', svgElement: svg, name: '', tags: [''] }];
        // tslint:disable-next-line: no-unused-expression
        expect(dbService.validateId('0', imagesData)).to.be.false;
        done();
    });
    // test validateName()
    it('should accept an not empty name', (done: Mocha.Done) => {
        // tslint:disable-next-line: no-unused-expression
        expect(dbService.validateName('adhvr')).to.be.true;
        done();
    });
    it('should not accept an empty name', (done: Mocha.Done) => {
        // tslint:disable-next-line: no-unused-expression
        expect(dbService.validateName('')).to.be.false;
        done();
    });
    // test validateTag()
    it('should accept valide characters', (done: Mocha.Done) => {
        // tslint:disable-next-line: no-unused-expression
        expect(dbService.validateTags(['kkoloo', 'afhhsy'])).to.be.true;
        done();
    });
    it('should not accept invalide characters', (done: Mocha.Done) => {
        // tslint:disable-next-line: no-unused-expression
        expect(dbService.validateTags(['@34,/', 'afhhsy'])).to.be.false;
        done();
    });
    // test clearData()
    it('should clear data', async () => {
        await initDB();
        await dbService.clearData();
        const result = await (dbService.getAllImages());
        return expect(result).to.have.length(0);
    });
});
