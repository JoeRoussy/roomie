import { wrap as coroutine } from 'co';
import moment from 'moment';
import { required, print, isEmpty, extendIfPopulated, convertToObjectId } from '../components/custom-utils';
import { transformUserForOutput } from '../components/transformers';
import { sendError } from './utils';
import { getUserTimeblocks } from '../components/data';
import {
    insert as insertInDb,
    getById,
    findAndUpdate,
    deleteById
} from '../components/db/service';


export const getSchedules=({
    meetingsCollection = required('meetingsCollection'),
    timeblocksCollection = required('timeblocksCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res){
    //Extract values
    const {
        _id
    } = req.user;

    //Perform Query
    let timeblockResults;

    try{
        timeblockResults = yield getUserTimeblocks({
            id: convertToObjectId(_id),
            timeblocksCollection
        });
    } catch(e){
        logger.error(e, 'Error finding timeblocks');

        return sendError({
            res,
            status: 500,
            message: 'Error finding timeblocks'
        });
    }

    //Return result
    return res.json({
        timeblocks:timeblockResults
    });
});

export const postMeeting=({
    meetingsCollection = required('meetingsCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res){
    //Extract values
    const {

    } = req.body;

    //Perform Validation

    //Perform Query
    let result;

    try{

    } catch(e){
        logger.error(e, 'Error creating meetings');

        return sendError({
            res,
            status: 500,
            message: 'Error creating meetings'
        });
    }
    //Return result
    return res.json({

    });
});


export const postTimeblock=({
    timeblocksCollection = required('timeblocksCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res){
    //Extract values
    let {
        date,
        start,
        end,
        availability,
        repeating,
        user
    } = req.body;

    //Perform Validation
    if(!date){
        logger.error("Error: Date not defined")
        return sendError({
            res,
            status: 400,
            errorKey: SCHEDULE_DATE_UNDEFINED,
            message: `Please select a date.`
        });
    }

    if(!start){
        logger.error("Error: Start not defined")
        return sendError({
            res,
            status: 400,
            errorKey: SCHEDULE_START_UNDEFINED,
            message: `Please select a start time.`
        });
    }

    if(!end){
        logger.error("Error: End not defined")
        return sendError({
            res,
            status: 400,
            errorKey: SCHEDULE_END_UNDEFINED,
            message: `Please select an end time.`
        });
    }

    if(!repeating){
        logger.error("Error: Repeating not defined")
        return sendError({
            res,
            status: 400,
            errorKey: SCHEDULE_REPEATING_UNDEFINED,
            message: `Please select a repeating option.`
        });
    }

    if(!availability){
        logger.error("Error: Availability not defined")
        return sendError({
            res,
            status: 400,
            errorKey: SCHEDULE_AVAILABILITY_UNDEFINED,
            message: `Please select an availability option.`
        });
    }

    console.log('Date', date);
    console.log('Start', start);
    console.log('End', end);
    // Make start, end, and date moments
    const now = moment();
    const startMoment = moment(start);
    const endMoment = moment(end);
    const dateMoment = moment(date);

    if (endMoment.isBefore(startMoment)) {
        logger.error("Error: Start time > End Time");

        return sendError({
            res,
            status: 400,
            errorKey: SCHEDULE_START_END_MISMATCH,
            message: 'Please select a start time earlier than the end time'
        });
    }

    if(dateMoment.isBefore(now, 'day')){
        logger.error("Error: Date < Now")
        return sendError({
            res,
            status: 400,
            errorKey: SCHEDULE_DATE_MISMATCH,
            message: `Please select a date after or including today.`
        });
    }

    //Perform Query
    let result;
    const timeblocks = {
        userId: convertToObjectId(user._id),
        type: availability,
        date,
        start,
        end,
        repeating
    }
    try{
        result = yield insertInDb({
            collection: timeblocksCollection,
            document: timeblocks,
            returnInsertedDocument: true
        });
    } catch(e){
        logger.error(e, 'Error creating timeblocks');

        return sendError({
            res,
            status: 500,
            message: 'Error creating timeblocks'
        });
    }
    //Return result
    return res.json({
        timeblock: [result]
    });
});


export const deleteMeeting=({
    meetingsCollection = required('meetingsCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res){
    //Extract values
    const {

    } = req.body;

    //Perform Validation

    //Perform Query
    let result;

    try{

    } catch(e){
        logger.error(e, 'Error deleting meeting');

        return sendError({
            res,
            status: 500,
            message: 'Error deleting meeting'
        });
    }
    //Return result
    return res.json({

    });
});

export const deleteTimeblock=({
    timeblocksCollection = required('timeblocksCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res){
    //Extract values
    const {
        id,
    } = req.params;

    const {
        _id
    } = req.user;
    console.log(req.user)
    //Perform Validation
    let timeblock;
    try {
        timeblock = yield getById({
            collection: timeblocksCollection,
            id: convertToObjectId(id)
        });
    } catch (e){
        return sendError({
            res,
            status: 500,
            message: 'Error retrieving timeblock'
        });
    }

    if(!timeblock){
        return sendError({
            res,
            status: 400,
            message: 'Error finding timeblock'
        })
    }
    console.log("###", convertToObjectId(timeblock.userId), convertToObjectId(_id))
    if(!timeblock.userId.equals(convertToObjectId(_id))){
        return sendError({
            res,
            status: 400,
            message: 'Error timeblock doesn\'t belong to user'
        })
    }

    //Perform Query
    let result;

    try{
        result = yield deleteById({
            collection: timeblocksCollection,
            id: convertToObjectId(timeblock._id)
        })
    } catch(e){
        logger.error(e, 'Error deleting timeblocks');

        return sendError({
            res,
            status: 500,
            message: 'Error deleting timeblocks'
        });
    }
    //Return result
    return res.json({
        result
    });
});
