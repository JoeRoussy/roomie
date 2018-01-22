import React, {Component} from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Container, Menu, Icon } from 'semantic-ui-react';

/*
    This is an example of a pure stateless component. It is just a function that returns some
    jsx given some props. Props can be directly passed on by the parent or can be mapped from
    states or props (see below).
*/

const NavBar = ({
    navigateTo,
    location
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
    			<Menu.Item onClick={() => navigateTo('/sign-up')}>
    				<Icon name='signup'/>Sign In
    			</Menu.Item>
    		</Menu.Menu>
        </Container>
    </Menu>
);

// A stateless component has no referece to the store's dispatch function. This function
// gives us a chance to add props in the context of the store dispatch function.
const mapDispatchToProps = (dispatch) => ({
    navigateTo: (path) => dispatch(push(path))
});

// TODO: we can also make a function that takes the current state of the app and return new props based on it

// We use the connect function to return a new component with props defined by the
// original props of the component and the props added by mapStateToProps and mapDispatchToProps
export default connect(null, mapDispatchToProps)(NavBar);
