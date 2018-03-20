import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';

import { userTypes } from '../../../common/constants';

export const getChannels = () => (dispatch) =>{
    dispatch({
        type: 'GET_CHANNELS_PENDING'
    });
     axios.get(`${process.env.API_ROOT}/api/channels`)
     .then( res =>{
         dispatch({
             type: 'GET_CHANNELS_FULFILLED',
             payload: res
         });
     }).catch(e => {
         toast.error("Failed to retireve channels");
         console.log(e);
         dispatch({
             type: 'CREATE_LISTING_REJECTED',
             payload: e
         });
     });
}

export const setActiveChannel= (channel) =>({
    type: 'SET_ACTIVE_CHANNEL',
    payload: {
        channel
    }
});

export const loadActiveChannel = (channel) => (dispatch) =>{
    dispatch({
        type: 'LOAD_ACTIVE_CHANNEL_PENDING'
    });
     axios.get(`${process.env.API_ROOT}/api/channels/${channel._id}`)
     .then( res =>{
         dispatch({
             type: 'LOAD_ACTIVE_CHANNEL_FULFILLED',
             payload: res
         });
     }).catch(e => {
         console.log(e);
         dispatch({
             type: 'LOAD_ACTIVE_CHANNEL_REJECTED',
             payload: e
         });
     });
}

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

export const modifyDisplayLeaveChannelModal = (displayModal,channel) => ({
    type: 'MODIFY_DISPLAY_LEAVE_MODAL',
    payload: {
        displayModal,
        channel
    }
});

export const postMessageToActiveChannel = (channel,message,user) => (dispatch) =>{
    const msg = {
        "channelId": channel._id,
        "userId": user._id,
        "body": message,
        "createdAt": moment()
    }
    dispatch({
        type: 'SEND_MESSAGE_PENDING',
        payload:{
            message:msg
        }
    });
     axios.post(`${process.env.API_ROOT}/api/channels/${channel._id}/messages`,{
         channelId: channel._id,
         message:message
     })
     .then( res =>{
         dispatch({
             type: 'SEND_MESSAGE_FULFILLED',
             payload: {res,
                 message:msg}
         });
     }).catch(e => {
         console.log(e);
         dispatch({
             type: 'SEND_MESSAGE_REJECTED',
             payload: {e,message:msg}
         });
     });
}

export const createChannel  = (channelName) => (dispatch) =>{
    dispatch({
        type: 'CREATE_CHANNEL_PENDING'
    });
    axios.post(`${process.env.API_ROOT}/api/channels/`,{
        channelName
    })
     .then( res =>{
         dispatch({
             type: 'CREATE_CHANNEL_FULFILLED',
             payload: res
         });
     }).catch(e => {
         toast.error("Failed to create channel");
         console.log(e);
         dispatch({
             type: 'CREATE_CHANNEL_REJECTED',
             payload: e
         });
     });
}

export const acceptInviteToChannel = (channel) => (dispatch) =>{
    dispatch({
        type: 'ACCEPT_CHANNEL_INVITE_PENDING'
    });
    axios.put(`${process.env.API_ROOT}/api/channels/${channel._id}/invites`,{
        channelId: channel._id,
        accepted:true
    })
     .then( res =>{
         dispatch({
             type: 'ACCEPT_CHANNEL_INVITE_FULFILLED',
             payload: res
         });
     }).catch(e => {
         toast.error("Failed to accept channel invite");
         console.log(e);
         dispatch({
             type: 'ACCEPT_CHANNEL_INVITE_REJECTED',
             payload: e
         });
     });
}

export const declineInviteToChannel = (channel) => (dispatch) =>{
    dispatch({
        type: 'DECLINE_CHANNEL_INVITE_PENDING'
    });
    axios.put(`${process.env.API_ROOT}/api/channels/${channel._id}/invites`,{
        channelId: channel._id,
        accepted:false
    })
     .then( res =>{
         dispatch({
             type: 'DECLINE_CHANNEL_INVITE_FULFILLED',
             payload: res
         });
     }).catch(e => {
         toast.error("Failed to decine channel invite");
         console.log(e);
         dispatch({
             type: 'DECLINE_CHANNEL_INVITE_REJECTED',
             payload: e
         });
     });
}

export const leaveChannel = (channel,userId) => ({
    type: 'LEAVE_CHANNEL',
    payload: axios.put(`${process.env.API_ROOT}/api/channels/${channel._id}/leave`,{
        userId
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
