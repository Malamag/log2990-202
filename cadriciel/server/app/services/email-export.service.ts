import fs from 'fs';
import { injectable } from 'inversify';
// import https from 'https';
import request from 'request';
import { ImageExport } from '../../../image-export';
@injectable()
export class EmailExportService {
    async export(data: ImageExport): Promise<void> {
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
                    value: fs.createReadStream(Buffer.from(data.src.split(',')[1], 'base64')),
                    options: {
                        filename: data.fileName,
                        contentType: data.type,
                    },
                },
            },
        };
        console.log('before request');
        request(URL, OPTIONS, res => {
            console.log('message : ' + res);
        });
        // req.end();
        console.log('after request');
    }
}
