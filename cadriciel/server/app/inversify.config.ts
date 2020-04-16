import { Container } from 'inversify';
import { Application } from './app';
import { DatabaseController } from './controllers/database.controller';
import { EmailExportController } from './controllers/email-export.controller';
import { Server } from './server';
import { DatabaseService } from './services/database.service';
import { EmailExportService } from './services/email-export.service';
import Types from './types';

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);

container.bind(Types.DatabaseController).to(DatabaseController);
container.bind(Types.DatabaseService).to(DatabaseService);

container.bind(Types.EmailExportController).to(EmailExportController);
container.bind(Types.EmailExportService).to(EmailExportService);

export { container };
