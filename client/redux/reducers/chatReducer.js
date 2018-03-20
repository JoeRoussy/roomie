import moment from 'moment';
const config = {
    channels: [],
    activeChannel: {},
    activeChannelUsers:{},
    chatLog: [],
    pendingMessages: {},
    newChannelName:'',
    displayNewChannelModal:false,
    displayInviteModal:false,
    chatTimer:null,
    isUserSearchLoading: false,
    userSearchResults: [],
    displayLeaveChannelModal:false,
    channelToLeave:{},
    chatTimer:null
};

// NOTE: islandlord needs to be lowercase because it is not a normal dom element
const mapUserForSearchResults = (user) => ({
    title: user.name,
    image: `${process.env.ASSETS_ROOT}${user.profilePictureLink}`,
    islandlord: user.isLandlord ? 'true' : 'false',
    api_response: user
});

const ChatReducer = (state = config, actions) => {
    switch(actions.type) {

        case 'GET_CHANNELS_FULFILLED': {
            state = {
                ...state,
                channels:actions.payload.data.channels
            }
            break;
        }

        case 'GET_CHANNELS_PENDING': {
            //console.log('Get channels is pending');
            break;
        }

        case 'GET_CHANNELS_REJECTED' : {
            //console.log('Get channels was rejected');
            break;
        }

        case 'CREATE_CHANNEL_FULFILLED': {
            const channels  = state.channels.concat(actions.payload.data.channel);
            state = {
                ...state,
                channels: channels
            }
            break;
        }

        case 'CREATE_CHANNEL_PENDING': {
            //console.log('Get channels is pending');
            break;
        }

        case 'CREATE_CHANNEL_REJECTED' : {
            //console.log('Get channels was rejected');
            break;
        }

        case 'SET_ACTIVE_CHANNEL':{
            const channelUsers = actions.payload.channel.users.reduce((r,e)=>{
                    r[e.userId] = e;
                    return r;
                },{})
            state = {
                ...state,
                activeChannel: actions.payload.channel,
                activeChannelUsers: channelUsers
            }
            break;
        }

        case 'MODIFY_NEW_CHANNEL_NAME':{
            state = {
                ...state,
                newChannelName: actions.payload.channelName
            }
            break;
        }

        case 'MODIFY_DISPLAY_NEW_CHANNEL_MODAL':{
            state = {
                ...state,
                displayNewChannelModal: actions.payload.displayModal
            }
            break;
        }

        case 'MODIFY_DISPLAY_INVITE_MODAL':{
            state = {
                ...state,
                displayInviteModal: actions.payload.displayModal
            }
            break;
        }

        case 'MODIFY_DISPLAY_LEAVE_MODAL':{
            state = {
                ...state,
                displayLeaveChannelModal: actions.payload.displayModal,
                channelToLeave: actions.payload.channel
            }
            break;
        }

        case 'LOAD_ACTIVE_CHANNEL_FULFILLED': {
            state = {
                ...state,
                chatLog:actions.payload.data.messages
            }
            break;
        }

        case 'LOAD_ACTIVE_CHANNEL_PENDING': {
            //console.log('Get active channel is pending');
            break;
        }

        case 'LOAD_ACTIVE_CHANNEL_REJECTED' : {
            //console.log('Get active channel was rejected');
            break;
        }
        case 'MODIFY_PENDING_MESSAGE': {
            state = {
                ...state,
                pendingMessages: {
                    ...state.pendingMessages,
                    [actions.payload.message.channelName]: actions.payload.message.message
            }};
            break;
        }

        case 'SEND_MESSAGE_FULFILLED': {
            break;
        }

        case 'SEND_MESSAGE_PENDING': {
            const messages  = state.chatLog.concat(actions.payload.message);
            state = {
                ...state,
                chatLog: messages
            }
            break;
        }

        case 'SEND_MESSAGE_REJECTED' : {
            //error sending message
            const messages = state.chatLog.map((message)=>{
                if(moment(message.createdAt).isSame(actions.payload.message.createdAt)){
                    message.failed = true;
                }
                return message;
            });
            state = {
                ...state,
                chatLog: messages
            }
            break;
        }

        case 'ACCEPT_CHANNEL_INVITE_FULFILLED': {
            const channels = state.channels.map((channel)=>{
                if(channel._id === actions.payload.data.channel._id){
                    return actions.payload.data.channel;
                }
                return channel;
            });
            state = {
                ...state,
                channels: channels
            }
            break;
        }
        case 'ACCEPT_CHANNEL_INVITE_PENDING': {
            break;
        }
        case 'ACCEPT_CHANNEL_INVITE_REJECTED' : {
            break;
        }

        case 'DECLINE_CHANNEL_INVITE_FULFILLED': {
            const channels = state.channels.filter((channel)=>{
                if(channel._id === actions.payload.data.channel._id){
                    return false;
                }
                return true;
            });
            state = {
                ...state,
                channels: channels
            }
            break;
        }
        case 'DECLINE_CHANNEL_INVITE_PENDING': {
            break;
        }
        case 'DECLINE_CHANNEL_INVITE_REJECTED' : {
            break;
        }

        case 'DECLINE_CHANNEL_INVITE_FULFILLED': {
            const channels = state.channels.filter((channel)=>{
                if(channel._id === actions.payload.data.channel._id){
                    return false;
                }
                return true;
            });
            state = {
                ...state,
                channels: channels
            }
            break;
        }
        case 'DECLINE_CHANNEL_INVITE_PENDING': {
            break;
        }
        case 'DECLINE_CHANNEL_INVITE_REJECTED' : {
            break;
        }

        case 'LEAVE_CHANNEL_FULFILLED': {
            const channels = state.channels.filter((channel)=>{
                if(channel._id === actions.payload.data.channel._id){
                    return false;
                }
                return true;
            });
            state = {
                ...state,
                channels: channels
            }
            break;
        }
        case 'LEAVE_CHANNEL_PENDING': {
            break;
        }
        case 'LEAVE_CHANNEL_REJECTED' : {
            break;
        }
        case 'START_TIMER': {
            const tmr = setInterval(actions.payload.tick,actions.payload.interval);
            state = {
                ...state,
                chatTimer:tmr
            }
            break;
        }
        case 'STOP_TIMER' : {
            const tmr = clearInterval(state.chatTimer);
            state = {
                ...state,
                chatTimer:tmr
            }
            break;
        }
        case 'SEND_CHANNEL_INVITE_FULFILLED': {
            const channels = state.channels.map((channel)=>{
                if(channel._id === actions.payload.data.channel._id){
                    return actions.payload.data.channel;
                }
                return channel;
            });
            state = {
                ...state,
                channels: channels
            }
            break;
        }
        case 'SEND_CHANNEL_INVITE_PENDING': {
            break;
        }
        case 'SEND_CHANNEL_INVITE_REJECTED' : {
            break;
        }

        case 'CHAT_USER_SEARCH_BY_NAME_PENDING': {
            state = {
                ...state,
                isUserSearchLoading: true,
                userSearchResults: []
            };

            break;
        }

        case 'CHAT_USER_SEARCH_BY_NAME_FULFILLED': {
            console.log(actions.payload)

            // Filter out the current participants from the search result
            const searchResults = actions.payload.data.users
                    .filter((user) => !Object.values(state.activeChannelUsers).some(x => x.api_response._id === user._id))
                    .map(mapUserForSearchResults)

            state = {
                ...state,
                isUserSearchLoading: false,
                userSearchResults: searchResults
            };

            break;
        }

        case 'CHAT_USER_SEARCH_BY_NAME_REJECTED': {
            state = {
                ...state,
                isUserSearchLoading: false,
                userSearchResults: []
            };

            break;
        }
    }
    return state;
}

export default ChatReducer;
