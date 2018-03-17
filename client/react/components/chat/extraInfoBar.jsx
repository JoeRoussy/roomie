import React, {Component} from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Container, Menu, Icon } from 'semantic-ui-react';

const listUsers = ({
    users
}) => {
    if(users){
        return Object.values(users).map((element,i) => (
            <Menu.Item key={i} >{element.name}</Menu.Item>
        ));
    }
}

const ExtraInfoBar = ({
    users
}) => (
    <Container>
        <Menu float='right' vertical inverted fluid>
            <Menu.Item header>User Information</Menu.Item>
            {listUsers({users})}
        </Menu>
    </Container>
);

export default ExtraInfoBar;
