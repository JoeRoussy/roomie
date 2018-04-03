import React, {Component} from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {Button, Container, Menu, Icon, Search } from 'semantic-ui-react';

const InviteSearch = ({
    isAdmin,
    searchResults,
    searchLoading,
    searchOnSelect,
    searchOnChange,
    searchValue,
    inviteUser
})=>{
    if(isAdmin){
        return(
            <div id='extraInfoSearchWrapper'>
                <span id="extraInfoSearchHeading">Invite User:</span>
                <Search
                    fluid
                    results={searchResults}
                    loading={searchLoading}
                    onResultSelect={searchOnSelect}
                    onSearchChange={searchOnChange}
                    value={searchValue}
                />
            <Button id='extraInfoInviteButton' color='green' onClick={inviteUser}>Invite</Button>
            </div>
        )
    }
    return;
}

const listUsers = ({
    users
}) => {
    if(users){
        return Object.values(users).map((element,i) => {
            if(element.isActive){
                return (
                    <Menu.Item key={i} ><Icon name='user' /> {element.name}</Menu.Item>
                )
            }
            return ;
        });
    }
}

const ExtraInfoBar = ({
    users,
    isAdmin,
    searchResults,
    searchLoading,
    searchOnSelect,
    searchOnChange,
    searchValue,
    inviteUser,
    show
}) => (
    <Container>
        {show ? (
            <Menu id='extraInfoBar' float='right' vertical inverted fluid>
                <Menu.Item header>User Information</Menu.Item>
                {listUsers({users})}
                <Menu.Item key={users.size}>{InviteSearch({isAdmin,searchResults,searchLoading,searchOnSelect,searchOnChange,inviteUser,searchValue})}</Menu.Item>
            </Menu>
        ) : (
            ''
        )}
    </Container>
);

export default ExtraInfoBar;
