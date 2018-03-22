import express from 'express';
import { getChildLogger } from '../components/log-factory';
import { isAuthenticated, isLandlord } from '../controllers/utils';
import { required } from '../components/custom-utils';
import { getMyListings, deleteMyListing, createLease, updateLease } from '../controllers/myListings';

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
            leasesCollection: db.collection('leases'),
            logger: getChildLogger({
                baseLogger,
                additionalFields: {
                    module: 'api-get-my-listings'
                }
            })
        })
    ]);

    myListingsRouter.post('/leases', [
        isAuthenticated,
        isLandlord,
        createLease({
            listingsCollection: db.collection('listings'),
            leasesCollection: db.collection('leases'),
            usersCollection: db.collection('users'),
            logger: getChildLogger({
                baseLogger,
                additionalFields: {
                    module: 'api-create-lease'
                }
            })
        })
    ]);

    myListingsRouter.get('/lease/:identifier', updateLease({
        listingsCollection: db.collection('listings'),
        leasesCollection: db.collection('leases'),
        usersCollection: db.collection('users'),
        logger: getChildLogger({
            baseLogger,
            additionalFields: {
                module: 'api-create-lease'
            }
        })
    }));

    myListingsRouter.delete('/:id', [
        isAuthenticated,
        isLandlord,
        deleteMyListing({
            listingsCollection: db.collection('listings'),
            logger: getChildLogger({
                baseLogger,
                additionalFields: {
                    module: 'api-delete-my-listings'
                }
            })
        })
    ]);

    return myListingsRouter;
}
