import mongodb from 'mongodb';
import { RethrownError } from '../../custom-utils';

// Returns a promise that resolves into a DB connection
export default (async() => {
    const MongoClient = mongodb.MongoClient;
    const {
        DB_URI,
        DB_NAME
    } = process.env;

    if (!DB_URI || !DB_NAME) {
        throw new Error('Missing DB_URI or DN_NAME enviornment variables');
    }

    let client = null;

    try {
        client = await MongoClient.connect(DB_URI);
    } catch (e) {
        throw new RethrownError(e, 'Could not connect to database client');
    }

    let db;

    try {
        db = client.db(DB_NAME);
    } catch (e) {
        throw new RethrownError(e, 'Could not get a db instance from the current client');
    }

    return db;
});
