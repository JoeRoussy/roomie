import axios from 'axios';


export const getSchedules = (user) => ({
    type: "GET_SCHEDULES",
    payload: axios.get(`${process.env.API_ROOT}/api/schedule/`, user)
});

export const createTimeblock = (options, user) => {
    const submissionData = {...options, ...user};
    const action = {
        type: "POST_TIMEBLOCK",
        payload: axios.post(`${process.env.API_ROOT}/api/schedule/timeblock/`, submissionData)
    }
    return action;
}

export const createMeeting = (options, user) => {
    const id = user._id;
    const submissionData = {...options, ...user};
    const action = {
        type: "POST_MEETING",
        payload: axios.post(`${process.env.API_ROOT}/api/schedule/meeting/`, submissionData)
    }
    return action;
}

export const deleteTimeblock = (options, user) => {
    const userId = user._id;
    const timeblockId = options._id;
    const action = {
        type: "DELETE_TIMEBLOCK",
        payload: axios.delete(`${process.env.API_ROOT}/api/schedule/timeblock/${timeblockId}`, user)
    }
    return action;
}

export const deleteMeeting = (options, user) => {
    const userId = user._id;
    const meetingId = options._id;
    const action = {
        type: "DELETE_MEETING",
        payload: axios.delete(`${process.env.API_ROOT}/api/schedule/meeting/${meetingId}`, user)
    }
    return action;
}
