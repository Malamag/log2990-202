//import fs from 'fs';
import { injectable } from 'inversify';
import { ImageExport } from '../../../image-export';
import http from 'http';

@injectable()
export class EmailExportService {

    async export(data: ImageExport) {
        console.log('email reached server');
        const OPTIONS = {
            'method': 'POST',
            'port': '3000',
            'url': 'https://log2990.step.polytmtl.ca/email?address_validation=false&quick_return=false&dry_run=false',
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
        let req = http.request(OPTIONS, (res) => {
            console.log('message : ' + res.read());
        });
        req.end();
        console.log('after request');
    }
}