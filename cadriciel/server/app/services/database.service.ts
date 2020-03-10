import { injectable } from 'inversify';
import { ImageData } from '../imageData';
import { Collection, MongoClient, MongoClientOptions, UpdateQuery, FilterQuery } from 'mongodb';
import 'reflect-metadata';
import { Image } from '../Image';
import fs from 'fs';
import { MetaData } from '../metadata';

const DATABASE_URL = 'mongodb+srv://Equipe202:Equipe202@cluster0-kusq4.mongodb.net/test?retryWrites=true&w=majority';
const DATABASE_NAME = 'Equipe202_Database';
const DATABASE_COLLECTION = 'Images';


@injectable()
export class DatabaseService {
    collection: Collection<MetaData>;
    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    constructor() {
        MongoClient.connect(DATABASE_URL, this.options)
            .then((client: MongoClient) => {
                this.collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
                console.error('connexion ok ');
            })
            .catch(() => {
                console.error('Erreur de connexion. Terminaison du processus');
                //process.exit(1);
            });
    }

    async getAllImages(): Promise<ImageData[]> {
        let jsonData = fs.readFileSync('../data.json');
        let drawingsList = JSON.parse(jsonData.toString());
        return this.collection.find({}).toArray()
            .then((metaData: MetaData[]) => {
                let imageData: ImageData[] = [];
                metaData.forEach((data: MetaData) => {
                    let image: Image = drawingsList.drawings.filter((drawing: Image) => { return drawing.id === data.id });
                    imageData.push({ id: data.id, name: data.name, tags: data.tags, svgElement: image[0].svgElement });
                })
                return imageData;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async getImagesByTags(tags: string): Promise<ImageData[]> {
        let tagsArray: string[] = this.stringToArray(tags);
        let jsonData = fs.readFileSync('../data.json');
        let drawingsList = JSON.parse(jsonData.toString());
        return this.collection.find({}).toArray()
            .then((metaData: MetaData[]) => {

                let buffer: ImageData[] = [];
                metaData.forEach((data: MetaData) => {
                    console.log('yolo');
                    let image: Image = drawingsList.drawings.filter((drawing: Image) => { return drawing.id === data.id });
                    buffer.push({ id: data.id, name: data.name, tags: data.tags, svgElement: image[0].svgElement });
                    console.log('yo');
                })
                let imageData: ImageData[] = [];
                buffer.forEach((data: ImageData) => {
                    let asTag: boolean = false;
                    data.tags.forEach((tag) => {
                        if (tagsArray.includes(tag)) {
                            asTag = true;
                        }
                    })
                    if (asTag) {
                        imageData.push(data);
                    }
                });
                //console.log(imageData);
                return imageData;
            })
            .catch((error: Error) => {
                throw error;
            });
    }
    stringToArray(str: string): string[] {
        let buffer: string[] = [];
        let pos: number = 0;
        let s: string = "";
        while (pos < str.length) {
            if (str.charAt(pos) === ',') {
                buffer.push(s);
                s = "";
            }
            else {
                s += str.charAt(pos);
            }
            pos++;
        }
        buffer.push(s);
        return buffer;
    }
    async deleteImageById(imageId: string): Promise<void> {
        fs.readFile('../data.json', function (err, data) {
            // Convert string (old data) to JSON
            let drawingsList = JSON.parse(data.toString());

            drawingsList.drawings = drawingsList.drawings.filter((data: Image) => { return data.id !== imageId });
            // Convert JSON to string
            let listToJson = JSON.stringify(drawingsList);
            // Replace all data in the data.json with new ones
            fs.writeFile("../data.json", listToJson, function (err) {
                if (err) throw err;
                console.log('The "data to append" was appended to file!');
            });
        });
        return this.collection.findOneAndDelete({ id: imageId })
            .then(() => { })
            .catch((error: Error) => {
                throw new Error("Impposible de supprimer l'image");
            });
    }

    async modifyImage(imageData: ImageData): Promise<void> {
        fs.readFile('../data.json', function (err, data) {
            // Convert string (old data) to JSON
            let drawingsList = JSON.parse(data.toString());
            let jsonObj = { id: imageData.id, svgElement: imageData.svgElement };
            drawingsList.drawings = drawingsList.drawings.filter((data: Image) => { return data.id !== imageData.id });
            // Add new data to my drawings list
            drawingsList.drawings.push(jsonObj);
            // Convert JSON to string
            let listToJson = JSON.stringify(drawingsList);
            // Replace all data in the data.json with new ones
            fs.writeFile("../data.json", listToJson, function (err) {
                if (err) throw err;
                console.log('The "data to append" was appended to file!');
            });
        });
        let filterQuery: FilterQuery<ImageData> = { id: imageData.id };
        let udateQuery: UpdateQuery<ImageData> = {
            $set: {
                id: imageData.id,
                name: imageData.name,
                tags: imageData.tags
            }
        }
        this.collection.updateOne(filterQuery, udateQuery)
            .then(() => { })
            .catch(() => {
                throw new Error("Impossible de mette à jour l'image");
            });
    }

    async populateDB() {
        let images: ImageData[] = [
            { id: '1', name: 'one', tags: ["string"], svgElement: "" },
            { id: '2', name: 'two', tags: ["string"], svgElement: '' },
            { id: '3', name: 'three', tags: ["string"], svgElement: '' },
            { id: '4', name: 'four', tags: ["string"], svgElement: '' }]
        images.forEach((image) => {
            //this.saveImage(image);
        })
    }
    async saveImage(imageData: ImageData) {
        fs.readFile('../data.json', function (err, data) {
            // Convert string (old data) to JSON
            let drawingsList = JSON.parse(data.toString());
            let jsonObj = { id: imageData.id, svgElement: imageData.svgElement };
            // Add new data to my drawings list
            drawingsList.drawings.push(jsonObj);

            // Convert JSON to string
            let listToJson = JSON.stringify(drawingsList);
            // Replace all data in the data.json with new ones
            fs.writeFile("../data.json", listToJson, function (err) {
                if (err) throw err;
                console.log('The "data to append" was appended to file!');
            });
        });
        let metadata: MetaData = { id: imageData.id, name: imageData.name, tags: imageData.tags };
        this.collection.insertOne(metadata).catch((error: Error) => {
            throw error;
        });
    }

}