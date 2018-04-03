import React, {Component} from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Container, Icon, Menu, Button } from 'semantic-ui-react';

import CreateChannelModal from './createChannelModal'

const listChannels = ({
    channels,
    changeChannel,
    activeChannel,
    leaveChannel,
    userId
}) => channels.map((element,i) => {
    const channelUser = element.users.find((user)=> user.userId === userId);

    return (
        <Menu.Item key={i} onClick={()=>{changeChannel(element)}} active= {activeChannel._id === element._id}>
            {element.name}
            {channelUser.acceptedInvite ? (
                <Button className='leaveChannelButton' size='tiny' circular icon='remove' onClick={()=>{leaveChannel(element)}}/>
            ) : (
                <Icon className='newChannelButton' name='exclamation' color='white' circular />
            )}
        </Menu.Item>
    )
});

const ChannelBar = ({
    channels,
    changeChannel,
    activeChannel,
    toggleDisplayNewChannelModal,
    displayNewChannelModal,
    leaveChannel,
    userId
}) => (
    <Container>
        <Menu id='chatSideBar' float='left' vertical inverted fluid>
            <Menu.Item header>Channels</Menu.Item>
            {listChannels({channels,changeChannel,activeChannel,leaveChannel,userId})}
            <Menu.Item id='channelBarNewChannelButtonItem' key={channels.size} onClick={()=>{toggleDisplayNewChannelModal(!displayNewChannelModal)}}>New Channel <Icon id='plusIcon' name='plus' /></Menu.Item>
        </Menu>
    </Container>

);

export default ChannelBar;
