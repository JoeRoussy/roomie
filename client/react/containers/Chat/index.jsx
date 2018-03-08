import {connect} from 'react-redux';
import {Divider,Grid} from 'semantic-ui-react'
import {push} from 'react-router-redux';
import React, {Component}  from 'react';

import ChannelBar from '../../components/chat/ChannelBar'
import ChatInput from '../../components/chat/ChatInput'
import ChatView from '../../components/chat/ChatView'
import ExtraInfoBar from '../../components/chat/ExtraInfoBar'

import { getChannels,loadActiveChannel,setActiveChannel,modifyPendingMessage } from '../../../redux/actions/chatActions';

import './styles.css';

@connect((store)=>({
    channels: store.ChatReducer.channels,
    activeChannel: store.ChatReducer.activeChannel,
    chatLog: store.ChatReducer.chatLog,
    pendingMessages: store.ChatReducer.pendingMessages
}))
class Chat extends React.Component{
    constructor(){
        super();
        this.getChannels = this.getChannels.bind(this);
        this.getChatLog = this.getChatLog.bind(this);
        this.changeChannel = this.changeChannel.bind(this);
        this.getActiveChannel = this.getActiveChannel.bind(this);
        this.getCurrentPendingMessage = this.getCurrentPendingMessage.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.checkForEnter = this.checkForEnter.bind(this);
    }
    getChannels(){
        return this.props.channels;
    }
    getChatLog(){
        return this.props.chatLog;
    }
    getActiveChannel(){
        return this.props.activeChannel;
    }
    getCurrentPendingMessage(){
        const message = this.props.pendingMessages[this.getActiveChannel()];
        //if the message undefined then return an empty string
        return message?message:'';
    }
    changeChannel(channel){
        //set the active channel in the state
        this.props.dispatch(setActiveChannel(channel));
        //load the chat log for the acive channel
        this.props.dispatch(loadActiveChannel());
    }

    handleMessageChange(event){
        //Save the the partial message to the state
        this.props.dispatch(modifyPendingMessage(this.getActiveChannel(),event.target.value));
    }

    checkForEnter(event){
        if(event.keyCode === 13){
            //just blank the pending message.
            //This is where saving a message will go
            this.props.dispatch(modifyPendingMessage(this.getActiveChannel(),''));
        }
    }

    componentWillMount() {
        this.props.dispatch(getChannels());
        this.props.dispatch(loadActiveChannel(this.props.activeChannel));
    }
    render(){
        return(
            <div>
                <Grid>
                    <Grid.Column width={2}>
                        <ChannelBar channels={this.getChannels()} changeChannel={this.changeChannel} activeChannel={this.getActiveChannel()}/>
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <ChatView chatLog={this.getChatLog()}/>
                        <Divider horizontal></Divider>
                        <ChatInput onChange={this.handleMessageChange} onKeyUp={this.checkForEnter} text={this.getCurrentPendingMessage()}/>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <ExtraInfoBar/>
                    </Grid.Column>
                </Grid>
            </div>
        )
    }
}

export default Chat;
