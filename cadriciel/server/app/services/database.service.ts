import fs from 'fs';
import { injectable } from 'inversify';
import { Collection, FilterQuery, MongoClient, MongoClientOptions, UpdateQuery } from 'mongodb';
import 'reflect-metadata';
import { Image } from '../Image';
import { ImageData } from '../imageData';
import { MetaData } from '../metadata';

const DATABASE_URL = 'mongodb+srv://Equipe202:Equipe202@cluster0-kusq4.mongodb.net/test?retryWrites=true&w=majority';
const DATABASE_NAME = 'Equipe202_Database';
const DATABASE_COLLECTION = 'Images';

@injectable()
export class DatabaseService {
    collection: Collection<MetaData>;
    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    constructor() {
        MongoClient.connect(DATABASE_URL, this.options)
            .then((client: MongoClient) => {
                this.collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
                console.error('connexion ok ');
            })
            .catch(() => {
                console.error('Erreur de connexion. Terminaison du processus');
                // process.exit(1);
            });
    }

    async getAllImages(): Promise<ImageData[]> {
        return this.collection
            .find({})
            .toArray()
            .then((metaData: MetaData[]) => {
                return this.getImages(metaData);
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async getImagesByTags(tags: string): Promise<ImageData[]> {
        const tagsArray = this.stringToArray(tags);
        return this.collection
            .find({})
            .toArray()
            .then((metaData: MetaData[]) => {
                const buffer: ImageData[] = this.getImages(metaData);
                if (tags === 'none') {
                    return buffer;
                }
                const imageData: ImageData[] = [];
                buffer.forEach((data: ImageData) => {
                    let asTag = false;
                    tagsArray.forEach(tag => {
                        if (this.searchTag(tag, data.tags)) {
                            asTag = true;
                        }
                    });
                    if (asTag) {
                        imageData.push(data);
                    }
                });
                return imageData;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    getImages(metaData: MetaData[]): ImageData[] {
        const imageData: ImageData[] = [];
        const jsonData = fs.readFileSync('../data.json');
        const drawingsList = JSON.parse(jsonData.toString());
        metaData.forEach((data: MetaData) => {
            const image: Image = drawingsList.drawings.filter((drawing: Image) => {
                return drawing.id === data.id;
            });
            try {
                imageData.push({ id: data.id, name: data.name, tags: data.tags, svgElement: image[0].svgElement });
            } catch (error) {
                console.log('Invalide id');
            }
        });
        return imageData;
    }
    searchTag(tag: string, tags: string[]): boolean {
        let isFound = false;
        for (let i = 0; i < tags.length; i++) {
            let startPos = 0;
            for (let j: number = tag.length; j <= tags[i].length; j++) {
                isFound = tag === tags[i].substring(startPos, j);
                startPos++;
                if (isFound) {
                    break;
                }
            }
        }
        return isFound;
    }
    stringToArray(str: string): string[] {
        const buffer: string[] = [];
        let pos = 0;
        let s = '';
        while (pos < str.length) {
            if (str.charAt(pos) === ',') {
                buffer.push(s);
                s = '';
            } else {
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
            const drawingsList = JSON.parse(data.toString());

            drawingsList.drawings = drawingsList.drawings.filter((data: Image) => {
                return data.id !== imageId;
            });
            // Convert JSON to string
            const listToJson = JSON.stringify(drawingsList);
            // Replace all data in the data.json with new ones
            fs.writeFile('../data.json', listToJson, function (err) {
                if (err) {
                    throw err;
                }
                console.log('The "data to append" was appended to file!');
            });
        });
        return this.collection
            .findOneAndDelete({ id: imageId })
            .then(() => { })
            .catch((error: Error) => {
                throw new Error("Impposible de supprimer l'image");
            });
    }

    async modifyImage(imageData: ImageData): Promise<void> {
        fs.readFile('../data.json', function (err, data) {
            // Convert string (old data) to JSON
            const drawingsList = JSON.parse(data.toString());
            const jsonObj = { id: imageData.id, svgElement: imageData.svgElement };
            drawingsList.drawings = drawingsList.drawings.filter((data: Image) => {
                return data.id !== imageData.id;
            });
            // Add new data to my drawings list
            drawingsList.drawings.push(jsonObj);
            // Convert JSON to string
            const listToJson = JSON.stringify(drawingsList);
            // Replace all data in the data.json with new ones
            fs.writeFile('../data.json', listToJson, function (err) {
                if (err) {
                    throw err;
                }
                console.log('The "data to append" was appended to file!');
            });
        });
        const filterQuery: FilterQuery<ImageData> = { id: imageData.id };
        const udateQuery: UpdateQuery<ImageData> = {
            $set: {
                id: imageData.id,
                name: imageData.name,
                tags: imageData.tags,
            },
        };
        this.collection
            .updateOne(filterQuery, udateQuery)
            .then(() => { })
            .catch(() => {
                throw new Error("Impossible de mette à jour l'image");
            });
    }

    async populateDB() {
        /*let images: ImageData[] = [
            { id: '1', name: 'one', tags: ["string"], svgElement: "" },
            { id: '2', name: 'two', tags: ["string"], svgElement: '' },
            { id: '3', name: 'three', tags: ["string"], svgElement: '' },
            { id: '4', name: 'four', tags: ["string"], svgElement: '' }]
        images.forEach((image) => {
            //this.saveImage(image);
        })*/
    }
    async saveImage(imageData: ImageData) {
        this.validateImageData(imageData)
            .then(data => {
                let image: ImageData;
                if (data !== null) {
                    image = data;
                } else {
                    throw new Error('Invalide image data');
                }
                fs.readFile('../data.json', function (err, data) {
                    // Convert string (old data) to JSON
                    const drawingsList = JSON.parse(data.toString());
                    const jsonObj = { id: image.id, svgElement: image.svgElement };
                    // Add new data to my drawings list
                    drawingsList.drawings.push(jsonObj);
                    // Convert JSON to string
                    const listToJson = JSON.stringify(drawingsList);
                    // Replace all data in the data.json with new ones
                    fs.writeFile('../data.json', listToJson, function (err) {
                        if (err) {
                            throw err;
                        }
                        console.log('The "data to append" was appended to file!');
                    });
                });
                const metadata: MetaData = { id: image.id, name: image.name, tags: image.tags };
                this.collection.insertOne(metadata).catch((error: Error) => {
                    throw error;
                });
            })
            .catch(() => {
                console.log('Invalide image data');
            });
    }

    validateImageData(imageData: ImageData): Promise<ImageData | null> {
        return this.getAllImages().then(data => {
            console.log(data.length);
            if (data.length >= 1000) {
                return null;
            }
            while (!this.validateId(imageData.id, data)) {
                // Generate a new id
                imageData.id = new Date().getUTCMilliseconds() + '';
            }
            console.log(imageData.name.length);
            if (!this.validateName(imageData.name)) {
                console.log('Empty name');
                return null;
            }
            if (!this.validateTags(imageData.tags)) {
                console.log('Invalide tags');
                return null;
            }
            return imageData;
        });
    }
    validateId(id: string, data: ImageData[]): boolean {
        if (
            data.filter((image: ImageData) => {
                return image.id === id;
            }).length
        ) {
            console.log('ID not unique');
            return false;
        } else {
            console.log('ID is unique');
            return true;
        }
    }
    validateName(name: string): boolean {
        return name.length > 0 && name !== null;
    }
    validateTags(tags: string[]): boolean {
        let validTags = true;
        const format = new RegExp(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/);
        tags.forEach(tag => {
            if (format.test(tag)) {
                validTags = false;
            }
        });
        return validTags;
    }
}
