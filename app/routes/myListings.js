import express from 'express';
import { getChildLogger } from '../components/log-factory';
import { isAuthenticated, isLandlord } from '../controllers/utils';
import { required } from '../components/custom-utils';
import { getMyListings } from '../controllers/myListings';

export default ({
    db = required('db'),
    baseLogger = required('baseLogger')
}) => {
    const myListingsRouter = express.Router();

    myListingsRouter.get('/', [
        isAuthenticated,
        isLandlord,
        getMyListings({
            listingsCollection: db.collection('listings'),
            logger: getChildLogger({
                baseLogger,
                additionalFields: {
                    module: 'api-get-my-listings'
                }
            })
        })
    ]);

    return myListingsRouter;
}