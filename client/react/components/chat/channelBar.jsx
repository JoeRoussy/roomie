import React, {Component} from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Container,Icon, Menu, Button} from 'semantic-ui-react';

import CreateChannelModal from './createChannelModal'

const listChannels = ({
    channels,
    changeChannel,
    activeChannel,
    leaveChannel
}) => {
    return channels.map((element,i) => (
        <Menu.Item key={i} onClick={()=>{changeChannel(element)}} active= {activeChannel._id === element._id}>
            {element.name} <Button size='tiny' color='black' icon='remove' onClick={()=>{leaveChannel(element)}}/>
        </Menu.Item>
    ));
}

const ChannelBar = ({
    channels,
    changeChannel,
    activeChannel,
    toggleDisplayNewChannelModal,
    displayNewChannelModal,
    leaveChannel
}) => (
    <Container>
        <Menu id='chatSideBar' float='left' vertical inverted fluid>
            <Menu.Item header>Channels</Menu.Item>
            {listChannels({channels,changeChannel,activeChannel,leaveChannel})}
            <Menu.Item key={channels.size} onClick={()=>{toggleDisplayNewChannelModal(!displayNewChannelModal)}}>New Channel</Menu.Item>

        </Menu>
    </Container>

);

export default ChannelBar;
