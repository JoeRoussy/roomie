import React from 'react';
import { Container } from 'semantic-ui-react';
import { connect } from 'react-redux';


import './styles.css';


const ForgotPasswordForm = ({
    token
}) => {
    return (
        <Container>
            <h1>Password Reset</h1>
            <h2>Enter your new password in the form below</h2>
            
        </Container>
    )
};

const mapStateToProps = ({
    forgotPasswordFormReducer: {
        token
    } = {}
}) => ({
    token
});

export default connect(mapStateToProps, null)(ForgotPasswordForm);
