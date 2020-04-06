import { NextFunction, Request, Response, Router } from 'express';
import * as Httpstatus from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { EmailExportService } from '../services/email-export.service';

import Types from '../types';

@injectable()
export class EmailExportController {

    router: Router;

    constructor(
        @inject(Types.EmailExportService) private emailExportService: EmailExportService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        this.router.post('/export', async (req: Request, res: Response, next: NextFunction) => {
            this.emailExportService.export(req.body)
                .then(() => {
                    res.sendStatus(Httpstatus.OK);
                })
                .catch((error: Error) => {
                    res.status(Httpstatus.NOT_FOUND).send(error.message);
                });
        });


    }
}