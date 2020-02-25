import { injectable } from 'inversify';
import { ImageData } from '../imageData';
import { Collection, MongoClient, MongoClientOptions, UpdateQuery, FilterQuery } from 'mongodb';
import 'reflect-metadata';

const DATABASE_URL = 'mongodb+srv://Equipe202:<password>@cluster0-kusq4.mongodb.net/test?retryWrites=true&w=majority'
const DATABASE_NAME = 'Equipe202_Database';
const DATABASE_COLLECTION= 'Images';


@injectable()
export class DatabaseService {
    collection: Collection<ImageData>;

    private options: MongoClientOptions = {
        useNewUrlParser : true,
        useUnifiedTopology : true
    };

    constructor() {
        MongoClient.connect( DATABASE_URL, this.options )
            .then( ( client: MongoClient ) => {
                this.collection = client.db( DATABASE_NAME ).collection( DATABASE_COLLECTION );
            } )
            .catch( () => { 
                console.error( 'Erreur de connexion. Terminaison du processus' );
                //process.exit(1);
            } )
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

    async getImageByName(imageName: string): Promise<ImageData>{
        return this.collection.findOne({name:imageName})
        .then((image: ImageData) => {
            return image;
        })
        .catch((error: Error) => {
            throw error;
        });
    }

    //async getImagesByTags(tags : string[]): Promise<ImageData>{
        //return tags.forEach( this.collection.find({}))
    //}

    async addImage(image: ImageData): Promise<void>{
        this.collection.insertOne(image).catch((error: Error) => {
            throw error;
        });
    }

    async deleteImageByName(imageName: string): Promise<void>{
        return this.collection.findOneAndDelete({ name: imageName })
        .then(() => { })
        .catch((error: Error) => {
            throw new Error( "Impposible de supprimer l'image");
        });
    }

    async modifyImage(imageData: ImageData): Promise<void>{
        let filterQuery : FilterQuery<ImageData> = {name: imageData.name};
        let udateQuery : UpdateQuery<ImageData> = {
            $set : { image : imageData.image,
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
        let images: ImageData[] = [
            {image: new ImageBitmap, name: 'one', tags: ["string"]},
            {image: new ImageBitmap, name: 'two', tags: ["string"]},
            {image: new ImageBitmap, name: 'three', tags: ["string"]},
            {image: new ImageBitmap, name: 'four', tags: ["string"]}]

        images.forEach((image) => {
            this.addImage(image);
        })
    }
}