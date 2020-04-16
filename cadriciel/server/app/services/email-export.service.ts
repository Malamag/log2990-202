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
        if( this.validateEmail(data.email) ) {
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
            request
            .post(URL, OPTIONS, (res) => {
                console.log('message : ' + res);
                //process.exit(0);
                
            })
            // req.end();
            console.log('after request');
        }
        else {
            throw new Error('Invalide email');
        }
    }
    validateEmail(email : string) : boolean{
        const format = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
        return format.test(email);
    }
}
