import express from 'express';
import { getChildLogger } from '../components/log-factory';
import { required } from '../components/custom-utils';

import listingsRouter from './listings';
import usersRouter from './users';
import channelsRouter from './channels';
import verifyRouter from './verify';
import passwordResetRouter from './passwordReset';
import scheduleRouter from './schedule';
import locationsRouter from './locations';

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

    router.use('/schedule', scheduleRouter({
        db,
        baseLogger
    }));

    router.use('/users', usersRouter({
        db,
        baseLogger
    }));

    router.use('/channels', channelsRouter({
        db,
        baseLogger
    }));

    router.use('/verify', verifyRouter({
        db,
        baseLogger
    }));

    router.use('/passwordReset', passwordResetRouter({
        db,
        baseLogger
    }));

    router.use('/locations', locationsRouter({
        db,
        baseLogger
    }));

    // Use the main api router under /api
    app.use('/api', router);
}
