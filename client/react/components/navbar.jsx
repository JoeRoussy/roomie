import React, {Component} from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Container, Menu, Icon } from 'semantic-ui-react';
import { ToastContainer, toast } from 'react-toastify';

import { setJwt } from '../../components';
import { setCurrentUser } from '../../redux/actions/userActions';

/*
    This is an example of a pure stateless component. It is just a function that returns some
    jsx given some props. Props can be directly passed on by the parent or can be mapped from
    states or props (see below).
*/

const NavBar = ({
    navigateTo,
    user,
    logout
}) => {
    let rightSection;

    if (user) {
        rightSection = [
            <Menu.Item key='profile-link' onClick={() => navigateTo('/profile')}>
                <Icon name='signup'/>Welcome {user.name}
            </Menu.Item>,
            <Menu.Item key='sign-out' onClick={() => logout()}>
                <Icon name='sign out'/>Log Out
            </Menu.Item>
        ];
    } else {
        rightSection = [
            <Menu.Item key='sign-up-link' onClick={() => navigateTo('/sign-up')}>
                <Icon name='signup'/>Register
            </Menu.Item>,
            <Menu.Item key='sign-in-link' onClick={() => navigateTo('/sign-in')}>
                <Icon name='signup'/>Log In
            </Menu.Item>
        ];
    }

    return (
        <Menu fixed='top' inverted>
            <ToastContainer />
            <Container>
                //left side
                <Menu.Item header onClick={() => navigateTo('/')}>Roomie</Menu.Item>
                <Menu.Item onClick={() => navigateTo('/search')}>Search </Menu.Item>
                <Menu.Item onClick={() => navigateTo('/chat')}><Icon name='chat'/> Chat</Menu.Item>
                <Menu.Item onClick={() => navigateTo('/groups')}><Icon name='group'/> Groups</Menu.Item>
                <Menu.Item onClick={() => navigateTo('/listings')}><Icon name='feed'/> Listings</Menu.Item>
                <Menu.Item onClick={() => navigateTo('/edit')}><Icon name='asl'/>Edit</Menu.Item>
                //right side
                <Menu.Menu position='right'>
                    {rightSection}
                </Menu.Menu>
            </Container>
        </Menu>
    )
};

// A stateless component has no referece to the store's dispatch function. This function
// gives us a chance to add props in the context of the store dispatch function.
const mapDispatchToProps = (dispatch) => ({
    navigateTo: (path) => dispatch(push(path)),
    logout: () => {
        setJwt(null);
        dispatch(setCurrentUser(null));
        toast.success('You have been logged out');
    }
});

// Similarly, this function takes the state of the app and maps it to props for this component
const mapStateToProps = ({
    userReducer
}) => ({
    user: userReducer.user
});

// We use the connect function to return a new component with props defined by the
// original props of the component and the props added by mapStateToProps and mapDispatchToProps
export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
