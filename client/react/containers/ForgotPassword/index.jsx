import React from 'react';
import { connect } from 'react-redux';
import { Container, Message, Button } from 'semantic-ui-react';

import ForgotPasswordEmailForm from '../../components/ForgotPasswordEmailForm';
import { submitForm, resendEmail, deleteEmail } from '../../../redux/actions/forgotPasswordActions';

import './styles.css';

const ForgotPassword = ({
    onSubmit,
    onResendEmail,
    onDeleteEmail,
    formData,
    errorMessage,
    navigateTo,
    isProcessing,
    email
}) => {
    let bodySection;

    if (email) {
        // We have already sent the email
        bodySection = (
            <div id='successMessageContainer'>
                <Message positive>
                    <Message.Header>An email is on the way!</Message.Header>
                    <p>We sent an email you can use to reset your password to {email}</p>
                    <Button type='button' onClick={onResendEmail(email)}>Send again</Button>
                    <Button type='button' onClick={onDeleteEmail}>Use another email</Button>
                </Message>

            </div>
        );
    } else {
        // Still need to show a form to get the email
        bodySection = (
            <div>
                <h2>Enter the email associated with your account and we will send you a link to reset your password</h2>
                <ForgotPasswordEmailForm
                    onSubmit={onSubmit(formData)}
                    errorMessage={errorMessage}
                    isProcessing={isProcessing}
                />
            </div>
        );
    }

    return (
        <Container id='forgotPasswordWrapper' className='rootContainer'>
            <h1>Password Recovery</h1>
            {bodySection}
        </Container>
    );
}

const mapStateToProps = ({
    forgotPasswordReducer: {
        errorMessage,
        isProcessing,
        email
    } = {},
    form: {
        forgotPasswordEmail: {
            values
        } = {}
    } = {}
}) => ({
    errorMessage,
    formData: values,
    isProcessing,
    email
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (formData) => () => dispatch(submitForm(formData)),
    onResendEmail: (email) => () => dispatch(resendEmail(email)),
    onDeleteEmail: () => dispatch(deleteEmail())
});

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
