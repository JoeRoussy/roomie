import express from 'express';

import { getChildLogger } from '../components/log-factory';
import { required } from '../components/custom-utils';
import { getSchedules, postTimeblock, postMeeting, deleteTimeblock, deleteMeeting } from '../controllers/schedule';
import { isAuthenticated, isEmailVerified } from '../controllers/utils'
export default ({
    db = required('db'),
    baseLogger = required('baseLogger')
}) => {
    const scheduleRouter = express.Router();

    scheduleRouter.get('/', [
        isAuthenticated, 
        isEmailVerified,
        getSchedules({
            meetingsCollection: db.collection('meetings'),
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
