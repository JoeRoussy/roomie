import { wrap as coroutine } from 'co';
import moment from 'moment';
import { required, print, isEmpty, extendIfPopulated, convertToObjectId } from '../components/custom-utils';
import { transformUserForOutput } from '../components/transformers';
import { sendError } from './utils';
import { getUserTimeblocks, getUserMeetings } from '../components/data';
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
    let timeblockResults = [];

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

    let meetingResults = [];

    try{
        meetingResults = yield getUserMeetings({
            id: convertToObjectId(_id),
            meetingsCollection
        }); 
    } catch(e){
        logger.error(e, 'Error finding meetings');

        return sendError({
            res,
            status: 500,
            message: 'Error finding meetings'
        });
    }

    let eventResults = [].concat(timeblockResults).concat(meetingResults);
    let id = 0;
    eventResults = eventResults.map((item)=>{
        let title;
        if(item.type === 'Unavailable'){
            title = item.type
        }
        else{
            title = `Meeting with: ${item.participants.map((person)=>person.name).toString()}`
        }
        return {
            id: id++,
            title: title,
            allDay: false,
            start: new Date(2018, 2, 16, 0, 0, 0),
            end: new Date(2018, 2, 16, 1, 0, 0)
        }
    });

    //Return result
    return res.json({
        timeblocks:timeblockResults,
        meetings: meetingResults,
        events: eventResults
    });
});

export const postMeeting=({
    meetingsCollection = required('meetingsCollection'),
    usersCollection = required('usersCollection'),
    listingsCollection = required('listingsCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res){
    //Extract values
    const {
        date,
        start,
        end,
        participants,
        listing
    } = req.body;

    const {
        _id: userId,
        name
    } = req.user;

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

    if(!participants){
        logger.error("Error: Participant list not defined")
        return sendError({
            res,
            status: 400,
            errorKey: SCHEDULE_PARTICIPANTS_UNDEFINED,
            message: `Please include a list of participants.`
        });
    }

    if(!userId){
        logger.error("Error: User not defined")
        return sendError({
            res,
            status: 400,
            errorKey: SCHEDULE_USER_UNDEFINED,
            message: `Please select an user.`
        });
    }

    if(!listing){
        logger.error("Error: Listing not included.")
        return sendError({
            res,
            status: 400,
            errorKey: SCHEDULE_LISTING_UNDEFINED,
            message: `Please select a real listing.`
        });
    }

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

    if(!Array.isArray(participants)){
        logger.error("Error: Participants is not an array")
        return sendError({
            res,
            status: 400,
            errorKey: SCHEDULE_DATE_MISMATCH,
            message: `Please use an array for participants.`
        });
    }

    if(participants.length < 1){
        logger.error("Error: Participants array is empty")
        return sendError({
            res,
            status: 400,
            errorKey: SCHEDULE_DATE_MISMATCH,
            message: `Participants array is empty.`
        });
    }

    let listingValidation;
    try {
        listingValidation = yield getById({
            collection: listingsCollection,
            id: convertToObjectId(listing)
        })
    } catch (e) {
        return sendError({
            res,
            status: 500,
            message: 'Error retrieving listing in database.'
        });
    }
    if(!listingValidation){
        return sendError({
            res,
            status: 400,
            message: `No listing was found for id ${listing}.`
        });
    }

    //Make sure participants exist and there is one Landlord
    let containsLandlord = false;
    let participantsAsUsers;
    let usersInMeeting;

    const getAllUsers = participants.map(p => getById({
        collection: usersCollection,
        id: convertToObjectId(p)
    }));



    try {
        usersInMeeting = yield Promise.all(getAllUsers);
    } catch (e) {
        logger.error(e, 'Sorry boss, you have an invalid user')
    }

    

    participantsAsUsers = usersInMeeting.map((p) => {
        if(convertToObjectId(p._id).equals(listingValidation.ownerId)) {
            containsLandlord = true;
        }

        return { id: convertToObjectId(p._id), acceptedInvite: false, name:p.name }
    });

    if(!containsLandlord){
        return sendError({
            res,
            status: 400,
            message: 'No landlord was found in participants.'
        });
    }

    //Perform Query
    let result;
    const newMeeting = {
        participants: participantsAsUsers.concat({id:convertToObjectId(userId), acceptedInvite: true, name:name}),
        start,
        end,
        date,
        owners: [convertToObjectId(userId), convertToObjectId(listingValidation.ownerId)],
        listing: convertToObjectId(listing)
    }
    try{
        result = yield insertInDb({
            collection: meetingsCollection,
            document: newMeeting,
            returnInsertedDocument: true
        });
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
        meeting: result
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
        id
    } = req.params;

    const {
        _id: userId
    } = req.user;

    //Perform Validation
    let meeting;
    try {
        meeting = yield getById({
            collection: meetingsCollection,
            id: convertToObjectId(id)
        });
    } catch (e){
        return sendError({
            res,
            status: 500,
            message: 'Error retrieving meeting'
        });
    }

    if(!meeting){
        return sendError({
            res,
            status: 400,
            message: 'Error finding meeting'
        })
    }

    //Check if user is part of meeting
    const ObjectUserId = convertToObjectId(userId);
    let userInMeeting = false;
    let userIsOwner = false;
    for(let i=0; i<meeting.participants.length; ++i){
        if(ObjectUserId.equals(convertToObjectId(meeting.participants[i].id))){
            userInMeeting = true;
            break;
        }
    }
    for(let i=0; i<meeting.owners.length; ++i){
        if(ObjectUserId.equals(convertToObjectId(meeting.owners[i]))){
            userIsOwner = true;
            break;
        }
    }

    if(!userInMeeting){
        return sendError({
            res,
            status: 400,
            message: 'User is not part of meeting'
        });
    }

    //Perform Query
    let result;
    try{
        if(userIsOwner){ //delete listing
            result = yield deleteById({
                collection: meetingsCollection,
                id: convertToObjectId(id)
            })
        }
        else{ //remove user from meeting
            const meetingUpdate = {
                ...meeting,
                participants: meeting.participants.filter((item)=>(!item.id.equals(ObjectUserId)))
            }
            result = yield meetingsCollection.update(
                {_id: convertToObjectId(id)},
                meetingUpdate
            )
        }
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
        _id: userId
    } = req.user;
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

    if(!timeblock.userId.equals(convertToObjectId(userId))){
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

/*
TODO:
create button for view listing to schedule
create aggregated schedule
set up meeting form (includes search componenet)
create meeting
create notification page
handle delete for decline
handle put for accept

*/
