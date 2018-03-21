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

export const deleteTimeblock = (id) => (dispatch) => {
    dispatch({
        type: 'DELETE_TIMEBLOCK_PENDING'
    });

    axios.delete(`${process.env.API_ROOT}/api/schedule/timeblock/${id}`)
        .then((res) => {
            dispatch({
                type: "DELETE_TIMEBLOCK_FULLFILED",
                payload: res
            });
            dispatch(getSchedules());
        })
        .catch((e) => {
            dispatch({
                type: "DELETE_TIMEBLOCK_REJECTED",
                payload: e
            });
        });
};

export const deleteMeeting = (id) => (dispatch) => {
    dispatch({
        type: "SCHEDULE_DELETE_MEETING_PENDING",
    });

    axios.delete(`${process.env.API_ROOT}/api/schedule/meeting/${id}`)
        .then((res) => {
            dispatch({
                type: "SCHEDULE_DELETE_MEETING_FULLFILED",
                payload: res
            });
            dispatch(getSchedules());
        })
        .catch((e) => {
            dispatch({
                type: "SCHEDULE_DELETE_MEETING_REJECTED",
                payload: e
            });
        });
};

export const showEventDetail = (event) => ({
    type: 'SCHEDULE_ACTIONS_SHOW_EVENT_DETAIL',
    payload: event
});


export const clearEventDetail = () => ({
    type: 'SCHEDULE_ACTIONS_CLEAR_EVENT_DETAIL'
});
