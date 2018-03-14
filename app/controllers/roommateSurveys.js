import { wrap as coroutine } from 'co';
import { required, print } from '../components/custom-utils';
import { insert as insertInDb, deleteById } from '../components/db/service';
import { findRoommateSurveyResponse, findRecommendedRoommates } from '../components/data';
import { sendError } from './utils';

import { roommateSurvey as roommateSurveyConstants } from '../../common/constants';

const {
    questions,
    errors: {
        GENERIC: GENERIC_ERROR_KEY
    } = {}
} = roommateSurveyConstants;

export const createRoommateSurvey = ({
    roommateSurveysCollection = required('roommateSurveysCollection'),
    recommendedRoommatesCollection = required('recommendedRoommatesCollection'),
    logger = required('logger', 'You must pass in a logging instance for this module to use')
}) => coroutine(function* (req, res) {
    const {
        city,
        userId,
        ...questionResponses
    } = req.body;

    if (!userId) {
        return sendError({
            res,
            status: 400,
            message: 'Must include userId in request'
        });
    }

    if (!city) {
        return sendError({
            res,
            status: 400,
            message: 'Must include city in request'
        });
    }

    if (Object.keys(questionResponses).length !== questions.length) {
        return sendError({
            res,
            status: 400,
            message: 'Incorrect number of question responses'
        });
    }

    // See if there is a survey response for this user already
    let existingSurveyResponse;

    try {
        existingSurveyResponse = yield findRoommateSurveyResponse({
            roommateSurveysCollection,
            userId
        });
    } catch (e) {
        logger.error(e, `Error finding existing roommate response for user with id: ${userId}`);

        return sendError({
            res,
            status: 500,
            message: 'Something went wrong processing your request',
            errorKey: GENERIC_ERROR_KEY
        });
    }

    if (existingSurveyResponse) {
        // We need to delete this response
        try {
            yield deleteById({
                collection: roommateSurveysCollection,
                id: userId
            });
        } catch (e) {
            logger.error(e, `Error deleting existing survey response for user with id: ${userId}`);

            return sendError({
                res,
                status: 500,
                message: 'Something went wrong processing your request',
                errorKey: GENERIC_ERROR_KEY
            });
        }
    }

    let userSurveyResponse;

    // Save the response to the db
    try {
        userSurveyResponse = yield insertInDb({
            collection: roommateSurveysCollection,
            document: {
                userId,
                city,
                ...questionResponses
            },
            returnInsertedDocument: true
        });
    } catch (e) {
        logger.error(e, `Error saving roommate survey responses for user with id: ${userId}`);

        return sendError({
            res,
            status: 500,
            message: 'Something went wrong processing your request',
            errorKey: GENERIC_ERROR_KEY
        });
    }

    // Compute knn for this user
    let recommendedRoommates = [];

    try {
        recommendedRoommates = yield findRecommendedRoommates({
            roommateSurveysCollection,
            recommendedRoommatesCollection,
            userSurveyResponse
        });
    } catch (e) {
        logger.error(e, `Error generating recommended roommates for user with id: ${userId}`);

        return sendError({
            res,
            status: 500,
            message: 'Something went wrong processing your request',
            errorKey: GENERIC_ERROR_KEY
        });
    }

    if (!recommendedRoommates.length) {
        logger.error(e, `No recommended roommates found for user with id: ${userId}`);

        return sendError({
            res,
            status: 500,
            message: 'Something went wrong processing your request',
            errorKey: GENERIC_ERROR_KEY
        })
    }

    console.log('Recommend roommates');

    print(recommendedRoommates)

    return res.json({
        recommendedRoommates
    });
});
