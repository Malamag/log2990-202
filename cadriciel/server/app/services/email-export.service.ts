//import fs from 'fs';
import { injectable } from 'inversify';
import { ImageExport } from '../../../image-export';
//import https from 'https';
import request from 'request';

@injectable()
export class EmailExportService {

    async export(data: ImageExport) {
        const URL = 'https://log2990.step.polymtl.ca/email?address_validation=false&quick_return=false&dry_run=false';
        console.log('email reached server');
        const OPTIONS: request.CoreOptions = {
            'method': 'POST',
            'port': 443,
            'headers': {
                'X-Team-Key': '20eae8ab-5040-4b1c-8d00-76e1208ecd13'
            },
            formData: {
                'to': 'maxym.lamothe@polymtl.ca',//data.email,
                'payload': {
                    'value': data.src,//fs.createReadStream('C:/Users/Thean/Pictures/LogoPoly'),
                    'options': {
                        'filename': data.downloadable,
                        'contentType': null
                    }
                }
            }
        };
        console.log('before request');
        request(URL, OPTIONS, (res) => {
            console.log('message : ' + res);
        });
        //req.end();
        console.log('after request');
    }
}