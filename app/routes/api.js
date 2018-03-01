import express from 'express';
import { getChildLogger } from '../components/log-factory';
import { required } from '../components/custom-utils';
import { createUser, getListings, getListingById } from '../controllers/api';

import listingsRouter from './listings';
import usersRouter from './users';

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

    router.use('/users', usersRouter({
        db,
        baseLogger
    }));

    // TODO: More API routes here

    // Use the main api router under /api
    app.use('/api', router);
}
