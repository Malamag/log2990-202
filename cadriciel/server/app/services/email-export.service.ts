
import { injectable } from 'inversify';
import { ImageExport } from '../../../image-export';
@injectable()
export class EmailExportService {

    async export(data: ImageExport) {
        console.log('email reached server');
        console.log(data.email);
        console.log(data.src);
        console.log(data.downloadable);
    }
}