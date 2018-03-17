import axios from 'axios';


export const getSchedules = (user) => {
    const id = user._id.toString();
    const action = {
        type: "GET_SCHEDULES",
        payload: axios.get(`${process.env.API_ROOT}/api/schedule/`, user)
    }
    return action;
}

export const createTimeblock = (options, user) => {
    const submissionData = {...options, ...user};
    const action = {
        type: "POST_TIMEBLOCK",
        payload: axios.post(`${process.env.API_ROOT}/api/schedule/timeblock/`, submissionData)
    }
    return action;
}

export const createMeeting = (options, user) => {
    const id = user._id.toString();
    const submissionData = {...options, ...user};
    const action = {
        type: "POST_MEETING",
        payload: axios.post(`${process.env.API_ROOT}/api/schedule/meeting/`, submissionData)
    }
    return action;
}

export const deleteTimeblock = (options, user) => {
    const userId = user._id.toString();
    const timeblockId = options._id.toString();
    const action = {
        type: "DELETE_TIMEBLOCK",
        payload: axios.delete(`${process.env.API_ROOT}/api/schedule/timeblock/${timeblockId}`, user)
    }
    return action;
}

export const deleteMeeting = (options, user) => {
    const userId = user._id.toString();
    const meetingId = options._id.toString();
    const action = {
        type: "DELETE_MEETING",
        payload: axios.delete(`${process.env.API_ROOT}/api/schedule/meeting/${meetingId}`, user)
    }
    return action;
}
