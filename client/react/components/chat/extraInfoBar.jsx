import React, {Component} from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { Container, Menu, Icon } from 'semantic-ui-react';

const ExtraInfoBar = ({
    navigateTo,
    user
}) => (
    <Container>
        <Menu float='right' vertical inverted fluid>
            <Menu.Item header>User Information</Menu.Item>
            <Menu.Item>Channel 1</Menu.Item>
            <Menu.Item>Channel 2</Menu.Item>
            <Menu.Item>Channel 3</Menu.Item>
        </Menu>
    </Container>

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
export default connect(mapStateToProps, mapDispatchToProps)(ExtraInfoBar);
