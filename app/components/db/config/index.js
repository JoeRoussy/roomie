import mongodb from 'mongodb';

// Returns a promise that resolves into a DB connection
export default () => {
    const MongoClient = mongodb.MongoClient;

    // TODO: Figure out how we are doing constants/enviornment variables and make this connection string one of them
    return MongoClient.connect('mongodb://127.0.0.1:27017/roomie');
}
