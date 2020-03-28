import fs from 'fs';
import { injectable } from 'inversify';
import { Collection, DeleteWriteOpResultObject, MongoClient, MongoClientOptions } from 'mongodb';
import 'reflect-metadata';
import { ImageData } from '../../../image-data';
import { Image } from '../Image';
import { MetaData } from '../metadata';

const DATABASE_URL = 'mongodb+srv://Equipe202:Equipe202@cluster0-kusq4.mongodb.net/test?retryWrites=true&w=majority';
const DATABASE_NAME = 'Equipe202_Database';
const DATABASE_COLLECTION = 'Images';

@injectable()
export class DatabaseService {
    collection: Collection<MetaData>;
    jsonFile: string;
    private options: MongoClientOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    constructor() {
        MongoClient.connect(DATABASE_URL, this.options)
            .then((client: MongoClient) => {
                this.collection = client.db(DATABASE_NAME).collection(DATABASE_COLLECTION);
                //console.error('connexion ok ');
            })
            .catch(() => {
                console.error('Erreur de connexion. Terminaison du processus');
                // process.exit(1);
            });
        this.jsonFile = '../data.json';
    }

    async getAllImages(): Promise<ImageData[]> {
        return this.collection
            .find({})
            .toArray()
            .then(async (metaData: MetaData[]) => {
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
                const imageData: ImageData[] = [];
                this.getImages(metaData)
                    .then((buffer) => {
                        buffer.forEach((data: ImageData) => {
                            let asTag = false;
                            tagsArray.forEach((tag) => {
                                if (this.searchTag(tag, data.tags)) {
                                    asTag = true;
                                }
                            });
                            if (asTag) {
                                imageData.push(data);
                            }
                        });
                    });
                return imageData;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    async getImages(metaData: MetaData[]): Promise<ImageData[]> {
        const imageData: ImageData[] = [];
        const jsonData = fs.readFileSync(this.jsonFile);
        const drawingsList = JSON.parse(jsonData.toString());
        metaData.forEach((data: MetaData) => {
            const image: Image = drawingsList.drawings.filter((drawing: Image) => {
                return drawing.id === data.id;
            });
            try {
                imageData.push({ id: data.id, name: data.name, tags: data.tags, svgElement: image[0].svgElement });
            } catch (error) {
                // throw new Error('Invalide id');
            }
        });
        return imageData;
    }

    searchTag(tag: string, tags: string[]): boolean {
        let isFound = false;

        for (const myTag of tags) {
            let startPos = 0;
            for (let j: number = tag.length; j <= myTag.length; j++) {
                isFound = tag === myTag.substring(startPos, j);
                startPos++;
                if (isFound) {
                    return isFound;
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
        fs.readFile(this.jsonFile, (err, data) => {
            // Convert string (old data) to JSON
            const drawingsList = JSON.parse(data.toString());

            drawingsList.drawings = drawingsList.drawings.filter((imgData: Image) => {
                return imgData.id !== imageId;
            });
            // Convert JSON to string
            const listToJson = JSON.stringify(drawingsList);
            // Replace all data in the data.json with new ones
            fs.writeFile(this.jsonFile, listToJson, (error) => {
                if (error) {
                    throw error;
                }
                console.log('The "data to append" was appended to file!');
            });
        });
        this.collection.findOneAndDelete({ id: imageId })
            .then(() => {
                /* nothing to do after findOneAndDelete, .then necessary (empty block) */
            })
            .catch(() => {
                throw new TypeError("Imposible de supprimer l'image");
            });
    }

    async saveImage(imageData: ImageData): Promise<void> {
        await this.validateImageData(imageData)
            .then((data) => {
                if (data !== null) {
                    this.save(data).catch((err) => {
                        throw err;
                    });
                }
            })
            .catch((err) => {
                throw err;
            })
    }
    async save(image: ImageData): Promise<void> {
        // Convert string (old data) to JSON
        const jsonData = fs.readFileSync(this.jsonFile);
        const drawingsList = JSON.parse(jsonData.toString());
        const jsonObj = { id: image.id, svgElement: image.svgElement };
        // Add new data to my drawings list
        drawingsList.drawings.push(jsonObj);
        // Convert JSON to string
        const listToJson = JSON.stringify(drawingsList);
        fs.writeFileSync(this.jsonFile, listToJson);
        const metadata: MetaData = { id: image.id, name: image.name, tags: image.tags };
        this.collection.insertOne(metadata).catch(() => {
            throw new Error('Fail to insert data');
        });
    }

    async validateImageData(imageData: ImageData): Promise<ImageData | null> {
        const MAX_DATA_AMOUNT = 1000;
        return await this.getAllImages()
            .then(async (data) => {
                if (data.length >= MAX_DATA_AMOUNT) {
                    throw new Error('Collection is full');
                    //return null;
                }
                while (!this.validateId(imageData.id, data)) {
                    // Generate a new id
                    imageData.id = new Date().getUTCMilliseconds() + '';
                }
                if (!this.validateName(imageData.name)) {
                    throw new Error('Empty name');
                    //return null;
                }
                if (!this.validateTags(imageData.tags)) {
                    throw new Error('Invalide tags');
                    //return null;
                }
                return imageData;

            })
            .catch((err) => {
                throw err//new Error('Validation failure');
            });
    }

    validateId(id: string, data: ImageData[]): boolean {
        if (
            data.filter((image: ImageData) => {
                return image.id === id;
            }).length
        ) {
            // console.log('ID not unique');
            return false;
        } else {
            // console.log('ID is unique');
            return true;
        }
    }

    validateName(name: string): boolean {
        return name.length > 0;
    }

    validateTags(tags: string[]): boolean {
        let validTags = true;
        const format = new RegExp(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/);
        tags.forEach((tag) => {
            if (format.test(tag)) {
                validTags = false;
            }
        });
        return validTags;
    }
    async clearData(): Promise<DeleteWriteOpResultObject> {
        const jsonData = fs.readFileSync(this.jsonFile);
        const drawingsList = JSON.parse(jsonData.toString());
        drawingsList.drawings = [];
        // Convert JSON to string
        const listToJson = JSON.stringify(drawingsList);
        fs.writeFileSync(this.jsonFile, listToJson);
        return await this.collection.deleteMany({});
    }
}
