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
};

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


        case 'LOAD_ACTIVE_CHANNEL_FULFILLED': {
            //console.log(actions.payload.data.messages)
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
            const messages  = state.chatLog.concat(actions.payload.data.message);
            state = {
                ...state,
                chatLog: messages
            }
            break;
        }

        case 'SEND_MESSAGE_PENDING': {
            //console.log('Get channels is pending');
            break;
        }

        case 'SEND_MESSAGE_REJECTED' : {
            //console.log('Get channels was rejected');
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

    }
    return state;
}

export default ChatReducer;
