import { wrap as coroutine } from 'co';
import express from 'express';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import bodyParser from 'body-parser';
import { config as enviornmentVariableConfig } from 'dotenv';

import { getLogger, getChildLogger } from './components/log-factory';
import dbConfig from './components/db/config';
import { print } from './components/custom-utils';

const app = express();
const MongoStore = connectMongo(session);

enviornmentVariableConfig();

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

// TODO(Joe): Enviornment variables, app and api routes

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
        SESSION_SECRET,
        DB_URI
    } = process.env;

    if (!SESSION_SECRET || !DB_URI) {
        Logger.error({env: process.env}, 'Missing required enviornment variables for server startup: SESSION_SECRET, DB_URI');

        return;
    }

    // Now that we know that the db is connected, continue setting up the app
    app.use(session({
        secret: SESSION_SECRET,
        resave: false, // don't save the session if unmodified
        saveUninitialized: false, // don't create session until something stored
        store: new MongoStore({
           url: DB_URI, // Open a new connection for session stuff
           touchAfter: 24 * 3600 // Only update the session every 24 hours unless a modification to the session is made
        })
    }));
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    app.listen(3000, () => Logger.info('App listening on port 3000'));
})();
