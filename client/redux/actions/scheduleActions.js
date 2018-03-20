import axios from 'axios';


export const getSchedules = () => ({
    type: "GET_SCHEDULES",
    payload: axios.get(`${process.env.API_ROOT}/api/schedule/`)
});

export const createTimeblock = (options, user) => (dispatch) => {
    const submissionData = {...options, ...user};

    dispatch({
        type: "POST_TIMEBLOCK",
        payload: axios.post(`${process.env.API_ROOT}/api/schedule/timeblock/`, submissionData)
            .then(res => {
                // Refresh the events since we just added one
                // TODO: Our reducer should really do this but it is hard with the repeating stuff
                dispatch({
                    type: 'GET_SCHEDULES',
                    payload: axios.get(`${process.env.API_ROOT}/api/schedule/`)
                });

                return res;
            })
    });
};

export const createMeeting = (options, user) => {
    const id = user._id;
    const submissionData = {...options, ...user};
    const action = {
        type: "POST_MEETING",
        payload: axios.post(`${process.env.API_ROOT}/api/schedule/meeting/`, submissionData)
    }
    return action;
};

export const deleteTimeblock = (options, user) => {
    const userId = user._id;
    const timeblockId = options._id;
    const action = {
        type: "DELETE_TIMEBLOCK",
        payload: axios.delete(`${process.env.API_ROOT}/api/schedule/timeblock/${timeblockId}`, user)
    }
    return action;
};

export const showEventDetail = (event) => ({
    type: 'SCHEDULE_ACTIONS_SHOW_EVENT_DETAIL',
    payload: event
});


export const clearEventDetail = () => ({
    type: 'SCHEDULE_ACTIONS_CLEAR_EVENT_DETAIL'
});
