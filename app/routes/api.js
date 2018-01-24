import express from 'express';
import { getChildLogger } from '../components/log-factory';
import { required } from '../components/custom-utils';
import { getListings, createUser, getCurrentUser } from '../controllers/api';

export default ({
    app = required('app'),
    db = required('db'),
    baseLogger = required('baseLogger')
}) => {
    const router = express.Router();

    // NOTE: Routers are for each resource are separate in case they need to be refactored out of this file

    // A separate listings router
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

    // Connect the user router to the main router under /users
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

    // Connect the user router to the main router under /users
    router.use('/users', userRouter);

    // TODO: More API routes here

    // Use the main api router under /api
    app.use('/api', router);
}
