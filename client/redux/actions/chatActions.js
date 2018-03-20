import axios from 'axios';
import { toast } from 'react-toastify';
import { userTypes } from '../../../common/constants';

export const getChannels = () => ({
    type: 'GET_CHANNELS',
    payload: axios.get(`${process.env.API_ROOT}/api/channels`)
});

export const setActiveChannel= (channel) =>({
    type: 'SET_ACTIVE_CHANNEL',
    payload: {
        channel
    }
});

export const loadActiveChannel = (channel) => ({
    type: 'LOAD_ACTIVE_CHANNEL',
    payload: axios.get(`${process.env.API_ROOT}/api/channels/${channel._id}`)
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

export const modifyNewChannelName = (channelName) => ({
    type: 'MODIFY_NEW_CHANNEL_NAME',
    payload: {
        channelName
    }
});

export const modifyDisplayNewChannelModal = (displayModal) => ({
    type: 'MODIFY_DISPLAY_NEW_CHANNEL_MODAL',
    payload: {
        displayModal
    }
});

export const modifyDisplayInviteModal = (displayModal) => ({
    type: 'MODIFY_DISPLAY_INVITE_MODAL',
    payload: {
        displayModal
    }
});

export const postMessageToActiveChannel = (channel,message) => ({
    type: 'SEND_MESSAGE',
    payload: axios.post(`${process.env.API_ROOT}/api/channels/${channel._id}/messages`,{
        channelId: channel._id,
        message:message
    })
});

export const createChannel  = (channelName) =>({
    type: 'CREATE_CHANNEL',
    payload: axios.post(`${process.env.API_ROOT}/api/channels/`,{
        channelName
    })
});

export const acceptInviteToChannel = (channel) => ({
    type: 'ACCEPT_CHANNEL_INVITE',
    payload: axios.put(`${process.env.API_ROOT}/api/channels/${channel._id}/invites`,{
        channelId: channel._id,
        accepted:true
    })
});
export const declineInviteToChannel = (channel) => ({
    type: 'DECLINE_CHANNEL_INVITE',
    payload: axios.put(`${process.env.API_ROOT}/api/channels/${channel._id}/invites`,{
        channelId: channel._id,
        accepted:false
    })
});

export const startTimer = (tick) => ({
    type: 'START_TIMER',
    payload: {
        tick,
        interval:`${process.env.CHAT_UPDATE_INTERVAL}`
    }
})
export const stopTimer = (tick) => ({
    type: 'STOP_TIMER'
})

export const sendChannelInvite = (channel,userId) => (dispatch) =>{
    dispatch({
        type: 'SEND_CHANNEL_INVITE_PENDING'
    });
    axios.post(`${process.env.API_ROOT}/api/channels/${channel._id}/invites`,{
        userIds:[userId]
    })
     .then( res =>{
         dispatch({
             type: 'SEND_CHANNEL_INVITE_FULFILLED',
             payload: res
         });
     }).catch(e => {
         toast.error("Failed to send channel invite");
         console.log(e);
         dispatch({
             type: 'SEND_CHANNEL_INVITE_REJECTED',
             payload: e
         });
     });
}

export const userSearch = (name) => ({
    type: 'CHAT_USER_SEARCH_BY_NAME',
    payload: axios.get(`${process.env.API_ROOT}/api/users?name=${name}&type=${userTypes.tenant}`)
        .catch((e) => {
            toast.error('Something went wrong with the user search, please try again later');

            // Return the error so other handlers can use it
            return e;
        })
});
