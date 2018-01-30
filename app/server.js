import { wrap as coroutine } from 'co';
import express from 'express';
import bodyParser from 'body-parser';
import { config as enviornmentVariableConfig } from 'dotenv';
import cors from 'cors';
import jwtParser from 'express-jwt'

import { getLogger, getChildLogger } from './components/log-factory';
import requiredFolderConfig from './components/required-folder-config';
import dbConfig from './components/db/config';
import { print } from './components/custom-utils';
import apiRouteConfig from './routes/api';
import authRouteConfig from './routes/authentication';

const app = express();

console.log(process.env.REQUIRED_FOLDERS);

enviornmentVariableConfig();
requiredFolderConfig([
    `${process.cwd()}${process.env.UPLOADS_RELATIVE_FILE_PATH}`
]);

const {
    LOG_ROTATING_FILE,
    LOG_ERROR_FILE
} = process.env;

global.Logger = getLogger({
    name: 'roomie',
    rotatingFile: LOG_ROTATING_FILE,
    errorFile: LOG_ERROR_FILE
});

const dbLogger = getChildLogger({
    baseLogger: Logger,
    additionalFields: {
        module: 'db-config'
    }
});

// Set app in an IIFE so we can bail using return if things so not initialize properly
(async () => {
    let db = null;

    try {
        db = await dbConfig();
    } catch (e) {
        dbLogger.error(e, 'Error connecting to database');

        return;
    }

    if (!db) {
        dbLogger.error(null, 'Got null or undefinded for the db connection from the db config');

        return;
    }

    // Load in required enviornment variables
    const {
        DB_URI
    } = process.env;

    if (!DB_URI) {
        Logger.error({env: process.env}, 'Missing required enviornment variables for server startup: SESSION_SECRET, DB_URI');

        return;
    }

    // Now that we know that the db is connected, continue setting up the app
    app.use(cors());
    app.use(express.static('public'));
    app.use('/assets', express.static('assets'));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());


    // Inspects the request header for a JWT and decodes it into req.user (valid JWT not required to get past this middleware)
    app.use(jwtParser({
        secret: process.env.JWT_SECRET,
        credentialsRequired: false
    }));

    apiRouteConfig({
        app,
        db,
        baseLogger: Logger
    });
    authRouteConfig({
        app,
        db,
        baseLogger: Logger
    });

    // TODO: Other kind of route configs here (like auth for example)

    app.listen(3000, () => Logger.info('App listening on port 3000'));
})();
