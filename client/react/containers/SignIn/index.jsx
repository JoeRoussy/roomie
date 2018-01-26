import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { submitForm } from '../../../redux/actions/signInActions';
import SignInForm from '../../components/SignInForm';

const SignIn = ({
    user,
    onSubmit,
    isFormProcessing,
    errorMessage,
    formValues
}) => (
    <div>
        <h1>Log In</h1>
        {user ? (<Redirect to='/'/>) : ('')}
        <SignInForm
            onSubmit={onSubmit(formValues)}
            isProcessing={isFormProcessing}
            errorMessage={errorMessage}
        >
        </SignInForm>
    </div>
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
    onSubmit: (formData) => () => dispatch(submitForm(formData))
});

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
