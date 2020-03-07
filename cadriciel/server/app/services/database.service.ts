import { injectable } from 'inversify';
import { ImageData } from '../imageData';
import { Collection, MongoClient, MongoClientOptions, UpdateQuery, FilterQuery } from 'mongodb';
import 'reflect-metadata';
import { Image } from '../Image';
import fs from 'fs';
//import data from '../data.json';
import { MetaData } from '../metadata';
//import * as dataTest from '../data.json';

const DATABASE_URL = 'mongodb+srv://admin:admin@cluster0-py47c.mongodb.net/test?retryWrites=true&w=majority';
const DATABASE_NAME = 'Equipe202_Database';
const DATABASE_COLLECTION = 'Images';


@injectable()
export class DatabaseService {
    collection: Collection<MetaData>;
    private options: MongoClientOptions = {
        useNewUrlParser : true,
        useUnifiedTopology : true
    };

    constructor() {
        MongoClient.connect( DATABASE_URL, this.options )
            .then( ( client: MongoClient ) => {
                this.collection = client.db( DATABASE_NAME ).collection( DATABASE_COLLECTION );
                console.error( 'connexion ok ');
                //let jsonData = fs.readFileSync('../images.json');
                //let images = JSON.parse(jsonData.toString());
                
                let obj = {table : [{}]};
                obj.table.push({id:1,square:2});
                
                
            })
            .catch( () => { 
                console.error( 'Erreur de connexion. Terminaison du processus' );
                //process.exit(1);
            } );
    }

    async getAllImages(): Promise<ImageData[]> {
        return this.collection.find({}).toArray()
        .then((images: ImageData[]) => {
            return images;
        })
        .catch((error: Error) => {
            throw error;
        });
    }

    async getImageById(imageId: string): Promise<ImageData>{
        let data : ImageData = {id: '', name: '', tags: [], svgElement : new Node()};
        this.collection.findOne({id:imageId})
        .then((metadata: MetaData) => {
            data.id = metadata.id;
            data.name = metadata.name;
            data.tags = metadata.tags;
        })
        .catch((error: Error) => {
            throw error;
        });
        let jsonData = fs.readFileSync('../data.json');
        let images = JSON.parse(jsonData.toString());
        console.log(images);
        return data;
    }

    //async getImagesByTags(tags : string[]): Promise<ImageData>{
        //return tags.forEach( this.collection.find({}))
    //}

    async addImage(imageData: MetaData): Promise<void>{
        let metadata : MetaData = {id : imageData.id, name : imageData.name, tags : imageData.tags};
        this.collection.insertOne(metadata).catch((error: Error) => {
            throw error;
        });
        let data = fs.readFileSync('../data.json');
        let images = JSON.parse(data.toString());
        //console.log(images);
        images.data.push({id : imageData.id});
        images.data = [{}];
        //fs.writeFile('../data.json',JSON.stringify(images),function(err){});
        //console.log(images);
    }

    async deleteImageById(imageId: string): Promise<void>{
        return this.collection.findOneAndDelete({ id: imageId })
        .then(() => { })
        .catch((error: Error) => {
            throw new Error( "Impposible de supprimer l'image");
        });
    }

    async modifyImage(imageData: ImageData): Promise<void>{
        let filterQuery : FilterQuery<ImageData> = {id: imageData.id};
        let udateQuery : UpdateQuery<ImageData> = {
            $set : { id: imageData.id,
                     name : imageData.name,
                     tags : imageData.tags}
        }
        this.collection.updateOne(filterQuery,udateQuery)
            .then(() => { })
            .catch(() => {
                throw new Error("Impossible de mette à jour l'image");
            });
    }

    async populateDB(){
        let images: MetaData[] = [
            {id: '1', name: 'one', tags: ["string"], },
            {id: '2', name: 'two', tags: ["string"], },
            {id: '3', name: 'three', tags: ["string"],},
            {id: '4', name: 'four', tags: ["string"],}]
        images.forEach((image) => {
            this.addImage(image);
        })
    }
    async saveImage(image : Image) {
        let jsonObj = {id : image.id, svgElement : image.svgElement };
        fs.writeFileSync('../data.json',JSON.stringify(jsonObj));
        let data = fs.readFileSync('../data.json');
        let images = JSON.parse(data.toString());
        console.log(images);
        //console.log(image.svgElement);
    }
}