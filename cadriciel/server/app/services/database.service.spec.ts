
import * as inversify from 'inversify';

import Types from '../types';

import { DatabaseService } from './database.service';

describe('Database service', () => {

    let dbService: DatabaseService;
    let container: inversify.Container;

    beforeEach(() => {
        container = new inversify.Container();
        container.bind(Types.DatabaseService).to(DatabaseService);
        dbService = container.get<DatabaseService>(Types.DatabaseService);
    });

});
