import dotenv from 'dotenv';
import { injectable } from 'inversify';

import request from 'request';

import { ImageExport } from '../../../image-export';

@injectable()
export class EmailExportService {
    url: string;
    constructor() {
        dotenv.config();
        this.url = 'https://log2990.step.polymtl.ca/email?address_validation=false&quick_return=false&dry_run=false';
    }
    async export(data: ImageExport): Promise<void> {
        if (this.validateEmail(data.email)) {

            console.log('email reached server');
            const OPTIONS: request.CoreOptions = {
                method: 'POST',
                port: 443,
                headers: {
                    /* The team key needs to be located in the .env file.
                       Please put this file in the root of the server directory: ./server/.env */
                    'X-Team-Key': process.env.X_TEAM_KEY,
                },
                formData: {
                    contentType: 'multipart/form-data',
                    to: data.email,
                    payload: {
                        value: Buffer.from(data.src.split(',')[1], 'base64'),
                        options: {
                            filename: data.downloadable,
                            contentType: null,
                        },
                    },
                },
            };
            request(this.url, OPTIONS, (res) => {
                console.log('message : ' + res);
            });
            console.log('after request');
        } else {
            throw new Error('Invalide email');
        }
    }
    validateEmail(email: string): boolean {
        const FORMAT = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
        return FORMAT.test(email);
    }
}
