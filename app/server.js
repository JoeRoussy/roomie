import { wrap as coroutine } from 'co';
import express from 'express';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import bodyParser from 'body-parser';

import { getLogger, getChildLogger } from './components/log-factory';
import dbConfig from './components/db/config';
import { print } from './components/custom-utils';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Routes from './ReactComponents/Routes';

const app = express();
const MongoStore = connectMongo(session);

global.Logger = getLogger({
    name: 'roomie'
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

    // Now that we know that the db is connected, continue setting up the app
    app.use(session({
        secret: 'some_super_secret_thing', // TODO: Better secret when we get env variables set up
        resave: false, // don't save the session if unmodified
        saveUninitialized: false, // don't create session until something stored
        store: new MongoStore({
           url: 'mongodb://127.0.0.1:27017/roomie', // Open a new connection for session stuff
           touchAfter: 24 * 3600 // Only update the session every 24 hours unless a modification to the session is made
        })
    }));
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());


    // TODO: Configure actual routes here:
    // SIDENOTE: Routes can be done with react I believe.
    // We can create our main architecture through this component
    app.get('/', (req, res) => {
        var html = ReactDOMServer.renderToString(React.createElement(Routes));
        res.send(html);
    });

    app.listen(3000, () => Logger.info('App listening on port 3000'));
})();
