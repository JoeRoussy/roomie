import React, {Component} from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Container, Menu, Icon } from 'semantic-ui-react';

/*
    This is an example of a pure stateless component. It is just a function that returns some
    jsx given some props. Props can be directly passed on by the parent or can be mapped from
    states or props (see below).
*/

const getRightSection = ({
    navigateTo,
    user
}) => {
    if (user) {
        // We want to render a link to their profile
        return (
            <Menu.Item onClick={() => navigateTo('/profile')}>
                <Icon name='signup'/>Welcome {user.name}
            </Menu.Item>
        )
    }

    // We want to render the register and sign in pages (and we also need can wrap both element so we do this map hack)
    return [
        {
            iconName: 'signup',
            text: 'Join',
            path: '/sign-up'
        },
        {
            iconName: 'signup',
            text: 'Sign In',
            path: '/sign-in'
        }
    ].map((element, i) => (
        <Menu.Item key={i} onClick={() => navigateTo(element.path)}>
            <Icon name={element.iconName}/>{element.text}
        </Menu.Item>
    ));
}

const NavBar = ({
    navigateTo,
    user
}) => (
    <Menu fixed='top' inverted>
        <Container>
            //left side
            <Menu.Item header onClick={() => navigateTo('/')}>Roomie</Menu.Item>
            <Menu.Item onClick={() => navigateTo('/search')}>Search </Menu.Item>
            <Menu.Item onClick={() => navigateTo('/chat')}><Icon name='chat'/> Chat</Menu.Item>
            <Menu.Item onClick={() => navigateTo('/groups')}><Icon name='group'/> Groups</Menu.Item>
            //right side
            <Menu.Menu position='right'>
    			{getRightSection({ navigateTo, user })}
    		</Menu.Menu>
        </Container>
    </Menu>
);

// A stateless component has no referece to the store's dispatch function. This function
// gives us a chance to add props in the context of the store dispatch function.
const mapDispatchToProps = (dispatch) => ({
    navigateTo: (path) => dispatch(push(path))
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
