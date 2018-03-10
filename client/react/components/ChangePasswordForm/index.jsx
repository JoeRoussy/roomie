import React from 'react';
import { Button, Form, Message } from 'semantic-ui-react'
import { Field, reduxForm } from 'redux-form';
import { InputField } from 'react-semantic-redux-form';

import { isPassword } from '../../../../common/validation';

import './styles.css';

const validate = (values) => {
    let errors = {};

    const {
        oldPassword,
        newPassword,
        confirmNewPassword
    } = values;

    const isNewPasswordValid = isPassword(newPassword);
    const isConfirmNewPasswordValid = isPassword(confirmNewPassword);

    if (!isPassword(oldPassword, false)) {
        errors = {
            oldPassword: 'Please enter a valid password',
            ...errors
        };
    }

    if (!isNewPasswordValid) {
        errors = {
            newPassword: 'Please enter a valid password',
            ...errors
        };
    }

    if (!isConfirmNewPasswordValid) {
        errors = {
            confirmNewPassword: 'Please enter a valid password',
            ...errors
        };
    }

    if (isNewPasswordValid && isConfirmNewPasswordValid && newPassword !== confirmNewPassword) {
        errors = {
            confirmNewPassword: 'Passwords must match',
            ...errors
        };
    }

    return errors;
};

const ChangePasswordForm = ({
    navigateTo,
    errorMessage,
    onSubmit,
    valid,
    isProcessing
}) => (
    <div>
        <Button onClick={() => navigateTo('/profile')}>Back to Profile</Button>
        <Form id='changePasswordForm' onSubmit={onSubmit} error={!!errorMessage}>
            <Message
                error
                header='Error'
                content={errorMessage}
            />
            <Field
                name='oldPassword'
                component={InputField}
                placeholder='Enter Your Old Password'
                type='password'
            />
            <Field
                name='newPassword'
                component={InputField}
                placeholder='Enter Your New Password'
                type='password'
            />
            <Field
                name='confirmNewPassword'
                component={InputField}
                placeholder='Confirm Your New Password'
                type='password'
            />
            <Button type='submit' color='green' loading={isProcessing} disabled={!valid || isProcessing}>Change Password</Button>
        </Form>
    </div>
);

export default reduxForm({
    form: 'changePassword',
    validate
})(ChangePasswordForm);
