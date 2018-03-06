import axios from 'axios';

export const getChannels = () => ({
    type: 'GET_CHANNELS',
    payload: axios.get(`${process.env.API_ROOT}/api/channels`)
});

export const setActiveChannel= (name) =>({
    type: 'SET_ACTIVE_CHANNEL',
    payload: {
        channel:{
            name
        }
    }
});

export const loadActiveChannel = (name) => ({
    type: 'LOAD_ACTIVE_CHANNEL',
    payload: {
        channel:{
            name
        }
    }
});

export const modifyPendingMessage = (channelName,message) => ({
    type: 'MODIFY_PENDING_MESSAGE',
    payload: {
        message:{
            channelName,
            message
        }
    }
});
