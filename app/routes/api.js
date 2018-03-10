import express from 'express';
import { getChildLogger } from '../components/log-factory';
import { required } from '../components/custom-utils';
import { isAuthenticated, isLandlord } from '../controllers/utils';
import { createUser, createListing,getListings, getListingById } from '../controllers/api';

import listingsRouter from './listings';
import usersRouter from './users';
import verifyRouter from './verify';

export default ({
    app = required('app'),
    db = required('db'),
    baseLogger = required('baseLogger')
}) => {
    const router = express.Router();

    router.use('/listings', listingsRouter({
        db,
        baseLogger
    }));

    router.post('/listings', [
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

    router.use('/listings', listingsRouter);

    // A separate router for users
    const userRouter = express.Router();

    userRouter.post('/', createUser({
        usersCollection: db.collection('users'),
        logger: getChildLogger({
            baseLogger,
            additionalFields: {
                module: 'api-users-create'
            }
        })
    }));

    router.use('/users', usersRouter({
        db,
        baseLogger
    }));

    router.use('/verify', verifyRouter({
        db,
        baseLogger
    }));

    // Use the main api router under /api
    app.use('/api', router);
}
