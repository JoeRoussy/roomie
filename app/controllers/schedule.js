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

// Returns a new array of events including repreated events extended 1 year out
const applyRepeating = (events) => {
    let newEvents = events;

    events.forEach(event => {
        const eventStartMoment = moment(event.start);
        const eventEndMoment = moment(event.end);

        switch (event.repeating) {
            case 'Daily': {
                for (let i = 0; i < 365; i++) {
                    // NOTE: Moments are changed as add function executes
                    const newEventStartMoment = eventStartMoment.add(1, 'days');
                    const newEventEndMoment = eventEndMoment.add(1, 'days');

                    newEvents.push({
                        type: event.type,
                        participants: event.participants,
                        start: newEventStartMoment.toDate(),
                        end: newEventEndMoment.toDate(),
                        _id: event._id
                    });
                }

                break;
            }

            case 'Weekly': {
                for (let i = 0; i < 52; i++) {
                    // NOTE: Moments are changed as add function executes
                    const newEventStartMoment = eventStartMoment.add(1, 'weeks');
                    const newEventEndMoment = eventEndMoment.add(1, 'weeks');

                    newEvents.push({
                        type: event.type,
                        participants: event.participants,
                        start: newEventStartMoment.toDate(),
                        end: newEventEndMoment.toDate(),
                        _id: event._id
                    });
                }

                break;
            }
        }
    });

    return newEvents;
};

const mapForCalendarDisplay = (event) => {
    let title;
    let location;
    let id = 0;

    if(event.type === 'Unavailable'){
        title = event.type;
    } else {
        title = `Meeting with: ${event.participants.map((person)=>person.name).toString()}`;
        location = event.listing.locationDisplay;
    }

    return {
        id: id++,
        title: title,
        allDay: false,
        start: event.start,
        end: event.end,
        location,
        type: event.type === 'Unavailable' ? event.type : 'Meeting',
        _id: event._id
    };
}

export const getSchedules = ({
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
    eventResults = applyRepeating(eventResults);

    //Return result
    return res.json({
        timeblocks:timeblockResults,
        meetings: meetingResults,
        events: eventResults.map(mapForCalendarDisplay)
    });
});

export const findAggregatedSchedules = ({
    meetingsCollection = required('meetingsCollection'),
    timeblocksCollection = required('timeblocksCollection'),
    usersCollection = required('usersCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res){
    //Extract values
    const {
        _id: userId
    } = req.user;

    const {
        participants
    } = req.query;

    let participantsInSchedule;

    if (!Array.isArray(participants)) {
        participantsInSchedule = [ participants ]
    } else {
        participantsInSchedule = participants;
    }

    participantsInSchedule.push(userId);

    //Check that participantsInSchedule are real users
    let usersInSchedule;
    const getAllUsers = participantsInSchedule.map(p => getById({
        collection: usersCollection,
        id: convertToObjectId(p)
    }));

    try {
        usersInSchedule = yield Promise.all(getAllUsers);
    } catch (e) {
        logger.error(e, 'Sorry boss, you have an invalid user')
        return sendError({
            res,
            status: 400,
            message: 'user not found.'
        });
    }

    //Get all the time blocks for each user
    let timeblocksInSchedule = [];
    const getAllTimeblocks = usersInSchedule.map( p => getUserTimeblocks({
        id: convertToObjectId(p._id),
        timeblocksCollection
    }));

    try {
        timeblocksInSchedule = timeblocksInSchedule.concat(yield Promise.all(getAllTimeblocks));
    } catch (e) {
        logger.error(e, 'Sorry boss, you have invalid timeblocks')
        return sendError({
            res,
            status: 400,
            message: 'Timeblocks not found.'
        });
    }

    //Get all the meetings for each user
    let meetingsInSchedule =[];
    const getAllMeetings = usersInSchedule.map( p => getUserMeetings({
        id: convertToObjectId(p._id),
        meetingsCollection
    }));

    try {
        meetingsInSchedule = meetingsInSchedule.concat(yield Promise.all(getAllMeetings));
    } catch (e) {
        logger.error(e, 'Sorry boss, you have invalid meetings')
        return sendError({
            res,
            status: 400,
            message: 'Meetings not found.'
        });
    }
    //combine all results in a list of events
    let events = [];
    let hashmap = {}
    events = events.concat(timeblocksInSchedule).concat(meetingsInSchedule).flatten();

    for(let i = 0; i < events.length; ++i){
        hashmap[events[i]._id] = true;
    }

    events = events.filter(event => {
        if(hashmap[event._id]){
            hashmap[event._id] = false;
            return true;
        }
        return false;
    })

    events = applyRepeating(events);

    return res.json({
        aggregatedEvents: events.map(mapForCalendarDisplay)
    });
});

export const findSchedulesDispatcher = ({
    meetingsCollection = required('meetingsCollection'),
    timeblocksCollection = required('timeblocksCollection'),
    usersCollection = required('usersCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res) {
    const {
        participants
    } = req.query;

    if (participants) {
        return findAggregatedSchedules({
            meetingsCollection,
            timeblocksCollection,
            usersCollection,
            logger
        })(req, res);
    } else {
        return getSchedules({
            meetingsCollection,
            timeblocksCollection,
            logger
        })(req, res);
    }
});

export const postMeeting = ({
    meetingsCollection = required('meetingsCollection'),
    usersCollection = required('usersCollection'),
    listingsCollection = required('listingsCollection'),
    logger = required('logger', 'You must pass a logger for this function to use')
}) => coroutine(function* (req, res) {
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

    const {
        SCHEDULE_DATE_UNDEFINED = required('SCHEDULE_DATE_UNDEFINED'),
        SCHEDULE_START_UNDEFINED = required('SCHEDULE_START_UNDEFINED'),
        SCHEDULE_END_UNDEFINED = required('SCHEDULE_END_UNDEFINED'),
        SCHEDULE_PARTICIPANTS_UNDEFINED = required('SCHEDULE_PARTICIPANTS_UNDEFINED'),
        SCHEDULE_LISTING_UNDEFINED = required('SCHEDULE_LISTING_UNDEFINED'),
        SCHEDULE_START_END_MISMATCH = required('SCHEDULE_START_END_MISMATCH'),
        SCHEDULE_DATE_MISMATCH = required('SCHEDULE_DATE_MISMATCH')
    } = process.env;

    //Perform Validation
    if(!date){
        logger.warn("Error: Date not defined");

        return sendError({
            res,
            status: 400,
            errorKey: SCHEDULE_DATE_UNDEFINED,
            message: `Please select a date.`
        });
    }

    if(!start){
        logger.warn("Error: Start not defined");

        return sendError({
            res,
            status: 400,
            errorKey: SCHEDULE_START_UNDEFINED,
            message: `Please select a start time.`
        });
    }

    if(!end){
        logger.warn("Error: End not defined");

        return sendError({
            res,
            status: 400,
            errorKey: SCHEDULE_END_UNDEFINED,
            message: `Please select an end time.`
        });
    }

    if(!participants){
        logger.warn("Error: Participant list not defined");

        return sendError({
            res,
            status: 400,
            errorKey: SCHEDULE_PARTICIPANTS_UNDEFINED,
            message: `Please include a list of participants.`
        });
    }

    if(!userId){
        logger.error("Error: User not defined");

        return sendError({
            res,
            status: 400,
            errorKey: SCHEDULE_USER_UNDEFINED,
            message: `Please select an user.`
        });
    }

    if(!listing){
        logger.warn("Error: Listing not included.");

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
        logger.warn("Error: Start time > End Time");

        return sendError({
            res,
            status: 400,
            errorKey: SCHEDULE_START_END_MISMATCH,
            message: 'Please select a start time earlier than the end time'
        });
    }

    if(dateMoment.isBefore(now, 'day')){
        logger.warn('Error: Date < Now');

        return sendError({
            res,
            status: 400,
            errorKey: SCHEDULE_DATE_MISMATCH,
            message: `Please select a date after or including today.`
        });
    }

    // Make sure the start and end moments have the correct date
    startMoment.date(dateMoment.date());
    startMoment.month(dateMoment.month());
    startMoment.year(dateMoment.year());

    endMoment.date(dateMoment.date());
    endMoment.month(dateMoment.month());
    endMoment.year(dateMoment.year());

    if(!Array.isArray(participants)){
        logger.warn({ participants }, 'Error: Participants is not an array');

        return sendError({
            res,
            status: 400,
            errorKey: SCHEDULE_DATE_MISMATCH,
            message: `Please use an array for participants.`
        });
    }

    if(participants.length < 1){
        logger.warn({ participants }, 'Error: Participants array is empty');

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
        logger.error({ err: e, participants }, 'Error getting users for participants ids');

        return sendError({
            res,
            status: 400,
            message: 'user not found.'
        });
    }

    // Make sure there are no empty results in usersInMeeting
    if (usersInMeeting.some(x => !x)) {
        logger.warn({ usersInMeeting }, 'Found invalid users in participants');

        return sendError({
            res,
            status: 400,
            message: 'user not found.'
        });
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
        start: new Date(startMoment.toISOString()),
        end: new Date(endMoment.toISOString()),
        date: new Date(dateMoment.toISOString()),
        owners: [convertToObjectId(userId), convertToObjectId(listingValidation.ownerId)],
        listing: convertToObjectId(listing),
        location: listingValidation.locationDisplay
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


export const postTimeblock = ({
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

    const {
        SCHEDULE_DATE_UNDEFINED = required('SCHEDULE_DATE_UNDEFINED'),
        SCHEDULE_START_UNDEFINED = required('SCHEDULE_START_UNDEFINED'),
        SCHEDULE_END_UNDEFINED = required('SCHEDULE_END_UNDEFINED'),
        SCHEDULE_REPEATING_UNDEFINED = required('SCHEDULE_REPEATING_UNDEFINED'),
        SCHEDULE_AVAILABILITY_UNDEFINED = required('SCHEDULE_AVAILABILITY_UNDEFINED'),
        SCHEDULE_START_END_MISMATCH = required('SCHEDULE_START_END_MISMATCH'),
        SCHEDULE_DATE_MISMATCH = required('SCHEDULE_DATE_MISMATCH')
    } = process.env;

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

    // Make sure the start and end moments have the correct date
    startMoment.date(dateMoment.date());
    startMoment.month(dateMoment.month());
    startMoment.year(dateMoment.year());

    endMoment.date(dateMoment.date());
    endMoment.month(dateMoment.month());
    endMoment.year(dateMoment.year());

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
        date: new Date(dateMoment.startOf('day').toISOString()),
        start: new Date(startMoment.toISOString()),
        end: new Date(endMoment.toISOString()),
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
        timeblocks: [result]
    });
});
export const acceptMeeting=({
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
    let participantsInMeeting = [...meeting.participants];
    for(let i=0; i<meeting.participants.length; ++i){
        if(ObjectUserId.equals(convertToObjectId(meeting.participants[i].id))){
            userInMeeting = true;
            participantsInMeeting[i].acceptedInvite = true;
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
    const updatedMeeting = {
        ...meeting,
        participants: participantsInMeeting
    }
    try{
        result = yield findAndUpdate({
            collection:meetingsCollection,
            query: {_id: id},
            update: updatedMeeting
        });
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
        meeting: result
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
create delete route [done]
create button for view listing to schedule [done]
create aggregated schedule [done]
set up meeting form (includes search componenet)
create meeting [done]
create notification page
handle delete for decline [done]
handle put for accept [done]

*/
