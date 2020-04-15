import dotenv from 'dotenv';
import { injectable } from 'inversify';

import request from 'request';

import { ImageExport } from '../../../image-export';

@injectable()
export class EmailExportService {
    constructor() {
        dotenv.config();
    }
    async export(data: ImageExport): Promise<void> {
        let a = this.validateEmail(data.email);
        console.log(a);
        const URL = 'https://log2990.step.polymtl.ca/email?address_validation=false&quick_return=false&dry_run=false';
        console.log('email reached server');
        const OPTIONS: request.CoreOptions = {
            method: 'POST',
            port: 443,
            headers: {
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
        //console.log(Buffer.from(data.src.split(',')[1], 'base64'));
        request(URL, OPTIONS, (res) => {
            console.log('message : ' + res);
        });
        // req.end();
        console.log('after request');
    }
    validateEmail(email : string) : boolean{
        const format = new RegExp(/\S+@\S+\.\S+/);
        return format.test(email);
    }
}
