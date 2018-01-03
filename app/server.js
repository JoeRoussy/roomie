import express from 'express';

import { getLogger, getChildLogger } from './components/log-factory';
import dbConfig from './components/db/config';

const app = express();

global.Logger = getLogger({
    name: 'roomie'
});

const dbLogger = getChildLogger({
    baseLogger: Logger,
    additionalFields: {
        module: 'db-config'
    }
});

// TODO(Joe): DB setup(including driver), logging setup, app and api routes

// Set app in an IIFE so we can bail using return if things so not initialize properly
(() => {
    let db = null;

    try {
        db = dbConfig();
    } catch (e) {
        dbLogger.error(e, 'Error connecting to database');

        return;
    }

    if (!db) {
        dbLogger.error(null, 'Got null or undefinded for the db connection from the db config');

        return;
    }

    // TODO: Configure actual routes here:
    app.get('/', (req, res) => {
        res.send('Hello world!');
    });

    app.listen(3000, () => Logger.info('App listening on port 3000'));
})();
