import express from 'express';
import { getChildLogger } from '../components/log-factory';
import { required } from '../components/custom-utils';
import { getListings, getPopularListings } from '../controllers/api';

export default ({
    app = required('app'),
    db = required('db'),
    baseLogger = required('baseLogger')
}) => {
    const router = express.Router();

    router.get('/listings', getListings({
        listingsCollection: db.collection('listings'),
        logger: getChildLogger({
            baseLogger,
            additionalFields: {
                module: 'api-listings-search'
            }
        })
    }));

    // TODO: More API routes here

    app.use('/api', router);
}
