import { wrap as coroutine } from 'co';
import { required, print, convertToObjectId } from '../components/custom-utils';
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
    logger = required('logger', 'You must pass in a logging instance for this module to use')
}) => coroutine(function* (req, res) {
    const {
        city,
        ...questionResponses
    } = req.body;

    let {
        user: {
            _id: userId
        } = {}
    } = req;

    // Make sure the userId is an object ID
    userId = convertToObjectId(userId);

    if (!userId) {
        logger.warn(req.user, 'Missing userId in req.user. Values of req.user included in this log');

        return sendError({
            res,
            status: 500,
            message: 'Could not find logged in user to arribute survey to'
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
                id: existingSurveyResponse._id
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
                userId: convertToObjectId(userId),
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

    // Compute recommendedRoommates for this user
    let recommendedRoommates = [];

    try {
        recommendedRoommates = yield findRecommendedRoommates({
            roommateSurveysCollection,
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

    return res.json({
        recommendedRoommates
    });
});
