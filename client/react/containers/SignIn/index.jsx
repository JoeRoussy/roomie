import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { Container, Button } from 'semantic-ui-react';

import { submitForm } from '../../../redux/actions/signInActions';
import SignInForm from '../../components/SignInForm';
import { navigateTo as getNavigateTo } from '../../../components';

import './styles.css';

const SignIn = ({
    user,
    onSubmit,
    isFormProcessing,
    errorMessage,
    formValues,
    onForgotPasswordClick,
    navigateTo
}) => (
    <Container className='rootContainer'>
        <h1>Log In</h1>
        {user ? (<Redirect to='/'/>) : ('')}
        <div id='forgotPasswordButtonWrapper'>
            <Button type='button' onClick={() => navigateTo('/forgot-password')}>Forgot Password?</Button>
        </div>
        <SignInForm
            onSubmit={onSubmit(formValues)}
            isProcessing={isFormProcessing}
            errorMessage={errorMessage}
        />
    </Container>
);

const mapStateToProps = ({
    userReducer: {
        user
    } = {},
    signInReducer: {
        isFormProcessing,
        errorMessage
    } = {},
    form: {
        signIn: {
            values
        } = {}
    } = {}
}) => ({
    user,
    isFormProcessing,
    errorMessage,
    formValues: values
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (formData) => () => dispatch(submitForm(formData)),
    navigateTo: getNavigateTo(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
