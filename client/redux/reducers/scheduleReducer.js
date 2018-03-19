const config = {
    timeblocks: [],
    meetings: [],
    events: [],
    loading: false
}

const scheduleReducer = (state = config, actions) => {
    const {
        payload: {
            data: {
                errorKey,
                timeblocks,
                meetings,
                events
            } = {}
        } = {}
    } = actions;

    // TODO: Remove at some point...
    console.log('timeblocks', timeblocks);
    console.log('meetings', meetings);
    console.log('events', events);

    switch(actions.type){
        /* GET Timeblocks and Schedules */
        case 'GET_SCHEDULES_FULFILLED': {
            state = {
                ...state,
                timeblocks: timeblocks,
                meetings: meetings,
                events: events,
                loading: false
            };
            break;
        }
        case 'GET_SCHEDULES_PENDING': {
            state = {
                ...state,
                loading: true
            };
            break;
        }
        case 'GET_SCHEDULES_REJECTED': {
            let errorMessage;

            state = {
                ...state,
                loading: false,
                errorMessage
            };
            break;
        }

        /* CREATE TIMEBLOCK */
        case 'POST_TIMEBLOCK_FULFILLED': {
            let newTimeblocks = state.timeblocks;
            newTimeblocks.concat(timeblocks);

            state = {
                ...state,
                timeblocks: state.timeblocks.concat(timeblocks),
                loading: false
            };
            break;
        }
        case 'POST_TIMEBLOCK_PENDING': {
            state = {
                ...state,
                loading: true
            };
            break;
        }
        case 'POST_TIMEBLOCK_REJECTED': {
            const {
                response:{
                    data:{
                        errorKey
                    }
                } = {}
            } = actions.payload;

            let errorMessage;

            if(errorKey){
                const errorMessages = {
                    [process.env.SCHEDULE_DATE_UNDEFINED]:'Date is not defined',
                    [process.env.SCHEDULE_START_UNDEFINED]:'Start is not defined',
                    [process.env.SCHEDULE_END_UNDEFINED]:'End is not defined',
                    [process.env.SCHEDULE_AVAILABILITY_UNDEFINED]:'Availability is not defined',
                    [process.env.SCHEDULE_REPEATING_UNDEFINED]:'Repeating is not defined',
                    [process.env.SCHEDULE_START_END_MISMATCH]:'Start time earlier than end time',
                    [process.env.SCHEDULE_DATE_MISMATCH]:'Date selected is earlier than present date'
                };

                errorMessage = errorMessages[errorKey];
            }
            else{
                errorMessage = 'Your availability request could not be processed';
            }

            state = {
                ...state,
                loading: false,
                errorMessage
            };
            break;
        }

        /* DELETE TIMEBLOCK */
        case 'DELETE_TIMEBLOCK_FULFILLED': {
            break;
        }
        case 'DELETE_TIMEBLOCK_PENDING': {
            break;
        }
        case 'DELETE_TIMEBLOCK_REJECTED': {
            break;
        }

        // /* CREATE MEETING */
        // case 'POST_METTINGS_FULFILLED': {
        //     state = {
        //         ...state,
        //         meetings: state.meetings.concat(meetings),
        //         loading: false
        //     };
        //     break;
        // }
        // case 'POST_METTINGS_PENDING': {
        //     state = {
        //         ...state,
        //         loading: true
        //     };
        //     break;
        // }
        // case 'POST_METTINGS_REJECTED': {
        //     const {
        //         response:{
        //             data:{
        //                 errorKey
        //             }
        //         } = {}
        //     } = actions.payload;
        //
        //     let errorMessage;
        //
        //     if(errorKey){
        //         const errorMessages = {
        //             [process.env.SCHEDULE_DATE_UNDEFINED]:'Date is not defined',
        //             [process.env.SCHEDULE_START_UNDEFINED]:'Start is not defined',
        //             [process.env.SCHEDULE_END_UNDEFINED]:'End is not defined',
        //             [process.env.SCHEDULE_AVAILABILITY_UNDEFINED]:'Availability is not defined',
        //             [process.env.SCHEDULE_START_END_MISMATCH]:'Start time earlier than end time',
        //             [process.env.SCHEDULE_DATE_MISMATCH]:'Date selected is earlier than present date'
        //         };
        //
        //         errorMessage = errorMessages[errorKey];
        //     }
        //     else{
        //         errorMessage = 'Your availability request could not be processed';
        //     }
        //
        //     state = {
        //         ...state,
        //         loading: false,
        //         errorMessage
        //     };
        //     break;
        // }
        //
        // /* DELETE MEETINGS */
        // case 'DELETE_METTINGS_FULFILLED': {
        //     break;
        // }
        // case 'DELETE_METTINGS_PENDING': {
        //     break;
        // }
        // case 'DELETE_METTINGS_REJECTED': {
        //     break;
        // }
    }
    return state;
}

export default scheduleReducer;
