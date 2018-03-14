import express from 'express';
import { getChildLogger } from '../components/log-factory';
import { required } from '../components/custom-utils';
import { createUser, getListings, getListingById } from '../controllers/api';

import listingsRouter from './listings';
import usersRouter from './users';
import verifyRouter from './verify';
import citiesRouter from './cities';
import roommateSurveysRouter from './roommateSurveys';

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

    router.use('/verify', verifyRouter({
        db,
        baseLogger
    }));

    router.use('/cities', citiesRouter({
        db,
        baseLogger
    }));

    router.use('/roommateSurveys', roommateSurveysRouter({
        db,
        baseLogger
    }));

    // Use the main api router under /api
    app.use('/api', router);
}
