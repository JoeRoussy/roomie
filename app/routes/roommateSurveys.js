import express from 'express';

import { getChildLogger } from '../components/log-factory';
import { required } from '../components/custom-utils';
import { createRoommateSurvey } from '../controllers/roommateSurveys';

export default ({
    db = required('db'),
    baseLogger = required('baseLogger')
}) => {
    const roommateSurveysRouter = express.Router();

    roommateSurveysRouter.post('/', createRoommateSurvey({
        roommateSurveysCollection: db.collection('roommateSurveys'),
        recommendedRoommatesCollection: db.collection('recommendedRoommates'),
        logger: getChildLogger({
            baseLogger,
            additionalFields: {
                module: 'api-cities-search'
            }
        })
    }));

    return roommateSurveysRouter;
}
