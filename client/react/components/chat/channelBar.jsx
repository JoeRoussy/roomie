import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Container,Icon, Menu} from 'semantic-ui-react';

import CreateChannelModal from './createChannelModal'

const listChannels = ({
    channels,
    changeChannel,
    activeChannel
}) => {
    return channels.map((element,i) => (
        <Menu.Item key={i} onClick={()=>{changeChannel(element)}} active= {activeChannel._id === element._id}>{element.name}</Menu.Item>
    ));
}

const ChannelBar = ({
    channels,
    changeChannel,
    activeChannel,
    toggleDisplayNewChannelModal,
    displayNewChannelModal
}) => (
    <Container>
        <Menu id='chatSideBar' float='left' vertical inverted fluid>
            <Menu.Item header>Channels</Menu.Item>
            {listChannels({channels,changeChannel,activeChannel})}
            <Menu.Item key={channels.size} onClick={()=>{toggleDisplayNewChannelModal(!displayNewChannelModal)}}>New Channel</Menu.Item>

        </Menu>
    </Container>

);

export default ChannelBar;
