import { inject, injectable } from 'inversify';
import { NextFunction, Request, Response, Router} from 'express';
import { DatabaseService } from '../services/database.service';
import * as Httpstatus from 'http-status-codes';


import Types from '../types';
import { ImageData } from '../imageData';

@injectable()
export class DatabaseController {

    router: Router;

    constructor(
        @inject(Types.DatabaseService) private databaseService: DatabaseService) {
            this.configureRouter();
        }
    
    private configureRouter(): void {
        this.router = Router();

        this.router.get("/Images", async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.getAllImages()
            .then((imagesData:ImageData[]) => {
                res.json(imagesData);
            })
            .catch((error: Error) => {
                res.status(Httpstatus.NOT_FOUND).send(error.message);
            });
        })

        this.router.get("/Images/:id", async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.getImageById(req.body.id)
            .then((imageData: ImageData) => {
                res.json(imageData);
            })
            .catch((error: Error) => {
                res.status(Httpstatus.NOT_FOUND).send(error.message);
            });
        })

        this.router.post("/Images/", async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.addImage(req.body)
            .then(() => {
                res.sendStatus(Httpstatus.CREATED).send();
            })
            .catch((error: Error) => {
                res.status(Httpstatus.NOT_FOUND).send(error.message);
            });
        })

        this.router.delete("/Images/:id", async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.deleteImageById(req.params.id)
            .then(() => {
                res.sendStatus(Httpstatus.NO_CONTENT).send();
            })
            .catch((error: Error) => {
                res.status(Httpstatus.NOT_FOUND).send(error.message);
            });
        })

        this.router.patch("/Images", async (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.modifyImage(req.body)
            .then(() => {
                res.sendStatus(Httpstatus.OK);
            })
            .catch((error: Error) => {
                res.status(Httpstatus.NOT_FOUND).send(error.message);
            });
        })

        this.router.get("/populateDB", (req: Request, res: Response, next: NextFunction) => {
            this.databaseService.populateDB();
            res.sendStatus(Httpstatus.OK);
        })

        this.router.post("/saveImage", (req: Request, res : Response, next: NextFunction) => {
            this.databaseService.saveImage(req.body)
            .then(() => {
                res.sendStatus(Httpstatus.OK);
            })
            .catch((error: Error) => {
                
                res.status(Httpstatus.NOT_FOUND).send(error.message);
            });
        })
    }
}