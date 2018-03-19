import axios from 'axios';
import { toast } from 'react-toastify';
import moment from 'moment';

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
         toast.error("Failed to load channel messages");
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

export const modifyDisplayInviteModal = (displayModal) => ({
    type: 'MODIFY_DISPLAY_INVITE_MODAL',
    payload: {
        displayModal
    }
});

export const postMessageToActiveChannel = (channel,message,user) => (dispatch) =>{
    dispatch({
        type: 'SEND_MESSAGE_PENDING',
        payload:{
            message:{
                "channelId": channel._id,
                "userId": user._id,
                "body": message,
                "createdAt": moment()
            }
        }
    });
     axios.post(`${process.env.API_ROOT}/api/channels/${channel._id}/messages`,{
         channelId: channel._id,
         message:message
     })
     .then( res =>{
         dispatch({
             type: 'SEND_MESSAGE_FULFILLED',
             payload: res
         });
     }).catch(e => {
         toast.error("Failed to send message");
         console.log(e);
         dispatch({
             type: 'SEND_MESSAGE_REJECTED',
             payload: e
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
