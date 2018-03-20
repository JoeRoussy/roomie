import React, {Component} from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Container, Menu, Icon,Search } from 'semantic-ui-react';

const InviteSearch = ({
    isAdmin,
    searchResults,
    searchLoading,
    searchOnSelect,
    searchOnChange
})=>{
    if(isAdmin){
        return(
            <Search
                results={searchResults}
                loading={searchLoading}
                onResultSelect={searchOnSelect}
                onSearchChange={searchOnChange}
            />
        )
    }
    return;
}

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
    users,
    isAdmin,
    searchResults,
    searchLoading,
    searchOnSelect,
    searchOnChange
}) => (
    <Container>
        <Menu float='right' vertical inverted fluid>
            <Menu.Item header>User Information</Menu.Item>
            {listUsers({users})}
            <Menu.Item key={users.size}>{InviteSearch({isAdmin,searchResults,searchLoading,searchOnSelect,searchOnChange})}</Menu.Item>

        </Menu>
    </Container>
);

export default ExtraInfoBar;
