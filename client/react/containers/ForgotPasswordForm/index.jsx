import React from 'react';
import { Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import PasswordResetForm from '../../components/PasswordResetForm';
import { submitForm } from '../../../redux/actions/forgotPasswordFormActions';

import './styles.css';


const ForgotPasswordForm = ({
    token,
    errorMessage,
    isProcessing,
    formData,
    onSubmit,
    user
}) => {
    // If the request ends up going through there will be a user added to the state
    // In that case, go to the home page.
    const redirectSection = user ? (<Redirect to='/' />) : '';

    return (
        <Container className='rootContainer'>
            {redirectSection}
            <h1>Password Reset</h1>
            <h2>Enter your new password in the form below</h2>
            <PasswordResetForm
                isProcessing={isProcessing}
                errorMessage={errorMessage}
                onSubmit={onSubmit({ ...formData, token })}
            />
        </Container>
    )
};

const mapStateToProps = ({
    forgotPasswordFormReducer: {
        token,
        errorMessage,
        isProcessing
    } = {},
    form: {
        passwordResetForm: {
            values
        } = {}
    } = {},
    userReducer: {
        user
    } = {}
}) => ({
    token,
    errorMessage,
    isProcessing,
    formData: values,
    user
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (formData) => () => dispatch(submitForm(formData))
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordForm);
