import axios from 'axios';

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

export const modifyDisplayLeaveChannelModal = (displayModal,channel) => ({
    type: 'MODIFY_DISPLAY_LEAVE_MODAL',
    payload: {
        displayModal,
        channel
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

export const leaveChannel = (channel,userId) => ({
    type: 'LEAVE_CHANNEL',
    payload: axios.put(`${process.env.API_ROOT}/api/channels/${channel._id}/leave`,{
        userId
    })
});
