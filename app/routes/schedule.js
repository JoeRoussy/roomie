import express from 'express';

import { getChildLogger } from '../components/log-factory';
import { required } from '../components/custom-utils';
import { findSchedulesDispatcher, postTimeblock, postMeeting, deleteTimeblock, deleteMeeting, acceptMeeting } from '../controllers/schedule';
import { isAuthenticated, isEmailVerified } from '../controllers/utils'
export default ({
    db = required('db'),
    baseLogger = required('baseLogger')
}) => {
    const scheduleRouter = express.Router();

    scheduleRouter.get('/', [
        isAuthenticated,
        isEmailVerified,
        findSchedulesDispatcher({
            meetingsCollection: db.collection('meetings'),
            usersCollection: db.collection('users'),
            timeblocksCollection: db.collection('timeblocks'),
            logger: getChildLogger({
                baseLogger,
                additionalFields: {
                    module: 'api-schedule-get'
                }
            })
        })
    ]);

    scheduleRouter.post('/meeting', [
        isAuthenticated,
        isEmailVerified,
        postMeeting({
            meetingsCollection: db.collection('meetings'),
            usersCollection: db.collection('users'),
            listingsCollection: db.collection('listings'),
            logger: getChildLogger({
                baseLogger,
                additionalFields: {
                    module: 'api-schedule-meeting'
                }
            })
        })
    ]);

    

    scheduleRouter.post('/timeblock', [
        isAuthenticated,
        isEmailVerified,
        postTimeblock({
            timeblocksCollection: db.collection('timeblocks'),
            logger: getChildLogger({
                baseLogger,
                additionalFields: {
                    module: 'api-schedule-timeblock'
                }
            })
        })
    ]);

    scheduleRouter.put('/meeting/:id', [
        isAuthenticated,
        isEmailVerified,
        acceptMeeting({
            meetingsCollection: db.collection('meetings'),
            logger: getChildLogger({
                baseLogger,
                additionalFields: {
                    module: 'api-schedule-meeting'
                }
            })
        })
    ]);

    scheduleRouter.delete('/meeting/:id', [
        isAuthenticated,
        isEmailVerified,
        deleteMeeting({
            meetingsCollection: db.collection('meetings'),
            logger: getChildLogger({
                baseLogger,
                additionalFields: {
                    module: 'api-schedule-meeting'
                }
            })
        })
    ]);

    scheduleRouter.delete('/timeblock/:id', [
        isAuthenticated,
        isEmailVerified,
        deleteTimeblock({
            timeblocksCollection: db.collection('timeblocks'),
            logger: getChildLogger({
                baseLogger,
                additionalFields: {
                    module: 'api-schedule-timeblock'
                }
            })
        })
    ]);

    return scheduleRouter;
}
