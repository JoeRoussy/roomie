const config = {
    channels: ['Channel 1',"Second Channel","Another Channel"],
    activeChannel: 'Channel 1',
    chatLog: [],
    pendingMessages: {}
};

//Test chat data
const Channel1Chat = [
    {
        channelName: 'Channel 1',
        userName: "Alice",
        timestamp: '12:00 AM',
        body: "Hello"
    },
    {
        channelName: 'Channel 1',
        userName: "Bob",
        timestamp: '12:15 AM',
        body: "Hello"
    }
];

const SecondChannelChat = [
    {
        channelName: 'Second Channel',
        userName: "Myself",
        timestamp: '1:00 AM',
        body: "Hello!"
    },
    {
        channelName: 'Second Channel',
        userName: "You",
        timestamp: '1:15 AM',
        body: "Good bye."
    }
];
const AnotherChannelChat = [
    {channelName: 'Another Channel',userName: "Random",timestamp: '??:?? ??',body: "Test"},
    {channelName: 'Another Channel',userName: "Random",timestamp: '??:?? ??',body: "Test"},
    {channelName: 'Another Channel',userName: "Random",timestamp: '??:?? ??',body: "Test"},
    {channelName: 'Another Channel',userName: "Random",timestamp: '??:?? ??',body: "Test"},
    {channelName: 'Another Channel',userName: "Random",timestamp: '??:?? ??',body: "Test"},
    {channelName: 'Another Channel',userName: "Random",timestamp: '??:?? ??',body: "Test"},
    {channelName: 'Another Channel',userName: "Random",timestamp: '??:?? ??',body: "Test"},
    {channelName: 'Another Channel',userName: "Random",timestamp: '??:?? ??',body: "Test"},
    {channelName: 'Another Channel',userName: "Random",timestamp: '??:?? ??',body: "Test"},
    {channelName: 'Another Channel',userName: "Random",timestamp: '??:?? ??',body: "Test"}
];

const ChatReducer = (state = config, actions) => {
    switch(actions.type) {
        case 'GET_CHANNELS': {
            state = {...state}
            break;
        }
        case 'SET_ACTIVE_CHANNEL':{
            state = {...state,activeChannel: actions.payload.channel.name}
            break;
        }
        case 'LOAD_ACTIVE_CHANNEL':{
            //load test chat data
            switch (state.activeChannel){
                case 'Channel 1':{
                    state = {...state, chatLog: Channel1Chat};
                    break;
                }
                case 'Second Channel':{
                    state = {...state, chatLog: SecondChannelChat};
                    break;
                }
                case 'Another Channel':{
                    state = {...state, chatLog: AnotherChannelChat};
                    break;
                }
                default:{
                    state = {...state, chatlog:[]};
                    break;
                }
            }
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
    }
    return state;
}

export default ChatReducer;
