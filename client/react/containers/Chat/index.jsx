import {connect} from 'react-redux';
import {Divider,Grid} from 'semantic-ui-react'
import {push} from 'react-router-redux';
import React, {Component}  from 'react';

import ChannelBar from '../../components/chat/ChannelBar'
import ChatInput from '../../components/chat/ChatInput'
import ChatView from '../../components/chat/ChatView'
import ExtraInfoBar from '../../components/chat/ExtraInfoBar'
import CreateChannelModal from '../../components/chat/createChannelModal'
import AcceptInviteModal from '../../components/chat/acceptInviteModal'

import {
    getChannels,
    loadActiveChannel,
    setActiveChannel,
    modifyPendingMessage,
    modifyNewChannelName,
    modifyDisplayNewChannelModal,
    postMessageToActiveChannel,
    createChannel,
    modifyDisplayInviteModal,
    acceptInviteToChannel,
    declineInviteToChannel
} from '../../../redux/actions/chatActions';

import './styles.css';

@connect((store)=>({
    channels: store.ChatReducer.channels,
    activeChannel: store.ChatReducer.activeChannel,
    chatLog: store.ChatReducer.chatLog,
    pendingMessages: store.ChatReducer.pendingMessages,
    newChannelName: store.ChatReducer.newChannelName,
    displayNewChannelModal: store.ChatReducer.displayNewChannelModal,
    displayInviteModal: store.ChatReducer.displayInviteModal,
    user: store.userReducer.user
}))
class Chat extends React.Component{
    constructor(){
        super();
        this.getChannels = this.getChannels.bind(this);
        this.getChatLog = this.getChatLog.bind(this);
        this.getActiveChannel = this.getActiveChannel.bind(this);
        this.getUser = this.getUser.bind(this);
        this.changeChannel = this.changeChannel.bind(this);
        this.createChannel = this.createChannel.bind(this);
        this.getCurrentPendingMessage = this.getCurrentPendingMessage.bind(this);
        this.getDisplayNewChannelModal = this.getDisplayNewChannelModal.bind(this);
        this.getDisplayInviteModal = this.getDisplayInviteModal.bind(this);
        this.setDisplayInviteModal = this.setDisplayInviteModal.bind(this);
        this.getNewChannelName = this.getNewChannelName.bind(this);
        this.setDisplayNewChannelModal = this.setDisplayNewChannelModal.bind(this);
        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleNewChannelNameChange = this.handleNewChannelNameChange.bind(this);
        this.blankNewChannelName = this.blankNewChannelName.bind(this);
        this.checkForEnter = this.checkForEnter.bind(this);
        this.acceptInvite = this.acceptInvite.bind(this);
        this.declineInvite = this.declineInvite.bind(this);
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
    getUser(){
        return this.props.user;
    }
    getCurrentPendingMessage(){
        const message = this.props.pendingMessages[this.getActiveChannel()];
        //if the message undefined then return an empty string
        return message?message:'';
    }

    getNewChannelName(){
        const name = this.props.newChannelName;
        //if the name undefined then return an empty string
        return name?name:'';
    }

    getDisplayNewChannelModal(){
        return this.props.displayNewChannelModal;
    }

    setDisplayNewChannelModal(displayModal){
        this.props.dispatch(modifyDisplayNewChannelModal(displayModal));
    }

    getDisplayInviteModal(){
        return this.props.displayInviteModal;
    }
    setDisplayInviteModal(displayModal){
        this.props.dispatch(modifyDisplayInviteModal(displayModal));
    }

    acceptInvite(){
        this.props.dispatch(acceptInviteToChannel(this.getActiveChannel()));
        this.setDisplayInviteModal(false);
    }
    declineInvite(){
        this.props.dispatch(declineInviteToChannel(this.getActiveChannel()));
        this.setDisplayInviteModal(false);
    }

    changeChannel(channel){
        const channelUser = channel.users.find((user)=>{
            return user.userId === this.getUser()._id;
        });
        //set the active channel in the state
        this.props.dispatch(setActiveChannel(channel));
        if(channelUser.acceptedInvite){
            //load the chat log for the acive channel
            this.props.dispatch(loadActiveChannel(channel));
        }else{
            //ask user to accept invite
            this.props.dispatch(modifyDisplayInviteModal(true));
        }

    }

    createChannel(){
        this.props.dispatch(createChannel(this.getNewChannelName()));
        this.setDisplayNewChannelModal(false);
    }

    handleMessageChange(event){
        //Save the the partial message to the state
        this.props.dispatch(modifyPendingMessage(this.getActiveChannel(),event.target.value));
    }

    handleNewChannelNameChange(event){
        //Save the the new channe name to the state
        this.props.dispatch(modifyNewChannelName(event.target.value));
    }

    blankNewChannelName(){
        this.setDisplayNewChannelModal(false);
        this.props.dispatch(modifyNewChannelName(''));
    }

    checkForEnter(event){
        //if the enter key was pressed
        if(event.keyCode === 13){
            //check if a channel was selected
            if(this.getActiveChannel()._id){
                //check if the message is not null or empty
                if(event.target.value){
                    this.props.dispatch(postMessageToActiveChannel(this.getActiveChannel(),event.target.value));
                    //clear the pending message.
                    this.props.dispatch(modifyPendingMessage(this.getActiveChannel(),''));
                }
            }
        }
    }



    componentWillMount() {
        this.props.dispatch(getChannels());
    }

    render(){
        return(
            <div>
                <Grid>
                    <Grid.Column width={2}>
                        <ChannelBar
                            channels={this.getChannels()}
                            changeChannel={this.changeChannel}
                            activeChannel={this.getActiveChannel()}
                            toggleDisplayNewChannelModal={this.setDisplayNewChannelModal}
                            displayNewChannelModal={this.getDisplayNewChannelModal()}
                        />
                        <CreateChannelModal
                            onChange={this.handleNewChannelNameChange}
                            text={this.newChannelName}
                            onConfirm={this.createChannel}
                            onClose={this.blankNewChannelName}
                            displayModal={this.getDisplayNewChannelModal()}
                        />
                        <AcceptInviteModal
                            channel={this.getActiveChannel()}
                            onAccept={this.acceptInvite}
                            onDecline={this.declineInvite}
                            displayModal={this.getDisplayInviteModal()}
                        />
                    </Grid.Column>
                    <Grid.Column width={11}>
                        <ChatView chatLog={this.getChatLog()}/>
                        <Divider horizontal></Divider>
                        <ChatInput
                            onChange={this.handleMessageChange}
                            onKeyUp={this.checkForEnter}
                            text={this.getCurrentPendingMessage()}
                            disabled={!this.getActiveChannel()._id}
                        />
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
