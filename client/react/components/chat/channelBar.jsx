import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Container,Icon, Menu} from 'semantic-ui-react';

const listChannels = ({
    channels,
    changeChannel,
    activeChannel
}) => {
    return channels.map((element,i) => (
        <Menu.Item key={i} onClick={()=>{changeChannel(element)}} active= {activeChannel === element}>{element}</Menu.Item>
    ));
}

const ChannelBar = ({
    channels,
    changeChannel,
    activeChannel
}) => (
    <Container>
        <Menu id='chatSideBar' float='left' vertical inverted fluid>
            <Menu.Item header>Channels</Menu.Item>
            {listChannels({channels,changeChannel,activeChannel})}
        </Menu>
    </Container>

);

export default ChannelBar;
