import React from 'react';
import { Container } from 'semantic-ui-react';
import { connect } from 'react-redux';

import PasswordResetForm from '../../components/PasswordResetForm';
import { submitForm } from '../../../redux/actions/forgotPasswordFormActions';

import './styles.css';


const ForgotPasswordForm = ({
    token,
    errorMessage,
    isProcessing,
    formData,
    onSubmit
}) => {
    return (
        <Container>
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
    } = {}
}) => ({
    token,
    errorMessage,
    isProcessing,
    formData: values
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (formData) => () => dispatch(submitForm(formData))
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordForm);
