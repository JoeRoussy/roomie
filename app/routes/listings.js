import express from 'express';
import { getChildLogger } from '../components/log-factory';
import { isAuthenticated, isLandlord } from '../controllers/utils';
import { required } from '../components/custom-utils';
import { createListing, getListings, getListingById } from '../controllers/api';

export default ({
    db = required('db'),
    baseLogger = required('baseLogger')
}) => {
    const listingsRouter = express.Router();

    listingsRouter.get('/', getListings({
        listingsCollection: db.collection('listings'),
        logger: getChildLogger({
            baseLogger,
            additionalFields: {
                module: 'api-listings-search'
            }
        })
    }));

    listingsRouter.get('/:id', getListingById({
        listingsCollection: db.collection('listings'),
        logger: getChildLogger({
            baseLogger,
            additionalFields: {
                module: 'api-listings-get-single-listing'
            }
        })
    }));

    listingsRouter.post('/listings', [
        isAuthenticated,
        isLandlord,
        createListing({
            listingsCollection: db.collection('listings'),
            logger: getChildLogger({
                baseLogger,
                additionalFields: {
                    module: 'api-listings-create-listing'
                }
            })
        })
    ]);

    return listingsRouter;
}
